import { createTool } from "@convex-dev/agent";
import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { createQuizSchema } from "./validations";

/**
 * Tool for generating quizzes using AI
 * Creates a structured quiz based on topic and difficulty
 */
export const createQuizTool = createTool({
    description: "Generates a complete quiz with questions and answers based on the given topic and difficulty",
    args: createQuizSchema,
    handler: async (ctx, args): Promise<Id<"quizzes">> => {
        const generatedQuiz = await ctx.runAction(internal.quizzes.actions.generateQuiz, {
            description: args.description,
            difficulty: args.difficulty,
            title: args.title,
            topic: args.topic
        })

        // Create the quiz in the database
        const quizId = await ctx.runMutation(api.quizzes.mutations.createQuiz, {
            title: args.title,
            description: args.description,
            topic: args.topic,
            difficulty: args.difficulty,
            userId: ctx.userId as Id<"users">,
            threadId: ctx.threadId as string,
        });

        // Add all questions to the quiz
        for (const question of generatedQuiz.questions) {
            await ctx.runMutation(api.quizzes.mutations.addQuizQuestion, {
                quizId,
                question: question.question,
                options: question.options,
                correctOptionIndex: question.correctOptionIndex,
                explanation: question.explanation,
                questionNumber: question.questionNumber,
                type: question.type,
                difficulty: question.difficulty,
            });
        }

        return quizId;
    }
});