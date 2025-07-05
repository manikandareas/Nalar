import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
import { assertUserAuthenticated } from "../users/utils";

export const saveLearningPlan = internalMutation({
    args: {
        userId: v.id("users"),
        title: v.string(),
        description: v.string(),
        steps: v.array(v.object({
            title: v.string(),
            description: v.string(),
            status: v.union(v.literal("not-started"), v.literal("in-progress"), v.literal("completed")),
            resources: v.optional(v.array(v.object({
                title: v.string(),
                url: v.string(),
                type: v.string(),
            }))),
        })),
    },
    handler: async (ctx, { userId, title, description, steps }) => {
        await ctx.db.insert("learning_plans", {
            userId,
            title,
            description,
            steps,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const updateLearningPlan = internalMutation({
    args: {
        planId: v.id("learning_plans"),
        steps: v.array(v.object({
            title: v.string(),
            description: v.string(),
            threadId: v.optional(v.string()),
            status: v.union(v.literal("not-started"), v.literal("in-progress"), v.literal("completed")),
            resources: v.optional(v.array(v.object({
                title: v.string(),
                url: v.string(),
                type: v.string(),
            }))),
        })),
    },
    handler: async (ctx, { planId, steps }) => {
        await ctx.db.patch(planId, { steps });
    },
});

export const updateLearningPlanStepStatus = mutation({
    args: {
        planId: v.id("learning_plans"),
        stepIndex: v.number(),
        status: v.union(v.literal("not-started"), v.literal("in-progress"), v.literal("completed")),
    },
    handler: async (ctx, { planId, stepIndex, status }) => {
        const user = await assertUserAuthenticated(ctx);

        const plan = await ctx.db.get(planId);

        if (!plan || plan.userId !== user._id) {
            throw new Error("Learning plan not found or you don't have permission to update it.");
        }

        if (stepIndex < 0 || stepIndex >= plan.steps.length) {
            throw new Error("Invalid step index.");
        }

        const newSteps = [...plan.steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], status };

        await ctx.db.patch(planId, { steps: newSteps, updatedAt: Date.now() });
    },
});


export const askNalar = mutation({
    args: {
        planId: v.id("learning_plans"),
        stepIndex: v.number(),
    },
    returns: v.string(),
    handler: async (ctx, { planId, stepIndex }) => {
        const user = await assertUserAuthenticated(ctx);
        const existingPlan = await ctx.db.get(planId);

        if (!existingPlan || existingPlan.userId !== user._id) {
            throw new Error("Learning plan not found or you don't have permission to update it.");
        }
        const userProfile = await ctx.db.query("user_profiles").withIndex("by_userId", q => q.eq("userId", user._id)).first();

        const requestPlan = existingPlan.steps[stepIndex];
        const prompt = `I want to learn about: ${requestPlan.title}. 
                        This is part of my broader goal to learn about ${existingPlan.title}.
                        Here's a brief description of what I want to learn in this step: ${requestPlan.description}.
                        My current expertise level is ${userProfile?.level || 'not specified'}.
                        My preferred learning style is ${user.learningStyle || 'not specified'}.
                        Please act as my tutor and help me understand this topic. Let's start with the basics and then we can move on to more advanced concepts.`;

        const threadId = await ctx.runMutation(api.chat.mutations.createThread, {
            prompt,
        });

        const newSteps = [...existingPlan.steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], threadId };

        if (!newSteps[stepIndex].threadId) {
            throw new Error("Thread ID not found.");
        }

        await ctx.runMutation(internal.learning.mutations.updateLearningPlan, {
            planId,
            steps: newSteps,
        });

        return newSteps[stepIndex].threadId as string;
    }
})