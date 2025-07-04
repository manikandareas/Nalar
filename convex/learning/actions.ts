import { generateObject } from "ai";
import { v } from "convex/values";
import { z } from "zod";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { GENERATE_QUIZ_MODEL } from "../model";
import { learningPlanSchema } from "./validations";

export const generateLearningPlan = internalAction({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }): Promise<z.infer<typeof learningPlanSchema> | null> => {
        const userProfile = await ctx.runQuery(internal.users.queries.getUserProfile, { userId });

        if (!userProfile || userProfile.learningGoals.length === 0) {
            console.log("No learning goals found for user, skipping plan generation.");
            return null;
        }

        const learningGoalsText = userProfile.learningGoals.map((goal: string) => `- ${goal}`).join("\n");

        const prompt = `
            You are an expert curriculum designer. Your task is to create a personalized learning plan for a user based on their stated goals. 
            The user's current level is ${userProfile.level}.
            The user wants to learn about the following topics:
            ${learningGoalsText}
            The user is studying for this reason: ${userProfile.studyReason}.
            The user's preferred study plan is: ${userProfile.studyPlan}.

            Generate a comprehensive, step-by-step learning plan that is broken down into logical sections. For each step, provide a clear title, a detailed description of the concepts to be learned, and optionally, a few high-quality online resources (articles, videos, tutorials) to aid in learning.
            The plan should be tailored to the user's level, study reason, and study plan.
            Ensure the output is a valid JSON object matching the provided schema.
        `;

        const { object: learningPlan } = await generateObject({
            model: GENERATE_QUIZ_MODEL,
            schema: learningPlanSchema,
            prompt: prompt,

        });

        await ctx.runMutation(internal.learning.mutations.saveLearningPlan, {
            userId: userProfile.userId,
            title: learningPlan.title,
            description: learningPlan.description,
            steps: learningPlan.steps,
        });

        return learningPlan;
    },
});
