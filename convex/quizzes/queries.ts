import { v } from "convex/values";
import { query } from "../_generated/server";

// Get a quiz by ID
export const getQuiz = query({
    args: {
        quizId: v.id("quizzes"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.quizId);
    },
});

// Get all questions for a quiz
export const getQuizQuestions = query({
    args: {
        quizId: v.id("quizzes"),
    },
    handler: async (ctx, args) => {
        const questions = await ctx.db
            .query("quiz_questions")
            .withIndex("by_quizId", q => q.eq("quizId", args.quizId))
            .collect();
        return questions.sort((a, b) => a.questionNumber - b.questionNumber);
    },
});

// Get quiz results including responses
export const getQuizResults = query({
    args: {
        quizId: v.id("quizzes"),
    },
    handler: async (ctx, args) => {
        const quiz = await ctx.db.get(args.quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }

        const questions = await ctx.db
            .query("quiz_questions")
            .withIndex("by_quizId", q => q.eq("quizId", args.quizId))
            .collect();



        const responses = await ctx.db
            .query("quiz_responses")
            .withIndex("by_userId_quizId", (q) =>
                q.eq("userId", quiz.userId).eq("quizId", args.quizId)
            )
            .collect();

        // Map responses to questions
        const questionsWithResponses = questions.sort((a, b) => a.questionNumber - b.questionNumber).map(question => {
            const response = responses.find(r => r.questionId === question._id);
            return {
                ...question,
                response: response || null,
            };
        });

        return {
            quiz,
            questions: questionsWithResponses,
            totalQuestions: questions.length,
            correctAnswers: responses.filter(r => r.isCorrect).length,
        };
    },
});

// Get all quizzes for a user
export const getUserQuizzes = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("quizzes")
            .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Get completed quiz history for the current user
export const getHistory = query({
    args: {
        threadId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) {
            return [];
        }
        const quizzes = await ctx.db
            .query("quizzes")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .filter((q) => q.eq(q.field("status"), "completed"))
            .order("desc")
            .collect();

        if (args.threadId) {
            return quizzes.filter(q => q.threadId === args.threadId)
        }
        return quizzes
    },
});
