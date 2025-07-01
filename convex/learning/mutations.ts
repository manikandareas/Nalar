import { v } from "convex/values";
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
