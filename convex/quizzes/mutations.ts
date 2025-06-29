import { v } from "convex/values";
import { mutation } from "../_generated/server";

// Create a new quiz based on the conversation
export const createQuiz = mutation({
    args: {
        userId: v.id("users"),
        threadId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        topic: v.string(),
        difficulty: v.union(
            v.literal("easy"),
            v.literal("medium"),
            v.literal("hard")
        ),
    },
    handler: async (ctx, args) => {
        const quizId = await ctx.db.insert("quizzes", {
            userId: args.userId,
            threadId: args.threadId,
            title: args.title,
            description: args.description,
            topic: args.topic,
            difficulty: args.difficulty,
            status: "pending",
        });

        return quizId;
    },
});

// Add questions to a quiz
export const addQuizQuestion = mutation({
    args: {
        quizId: v.id("quizzes"),
        question: v.string(),
        options: v.array(v.string()),
        correctOptionIndex: v.number(),
        explanation: v.string(),
        questionNumber: v.number(),
        type: v.union(
            v.literal("multiple_choice"),
            v.literal("true_false")
        ),
        difficulty: v.union(
            v.literal("easy"),
            v.literal("medium"),
            v.literal("hard")
        ),
    },
    handler: async (ctx, args) => {
        const questionId = await ctx.db.insert("quiz_questions", {
            quizId: args.quizId,
            question: args.question,
            options: args.options,
            correctOptionIndex: args.correctOptionIndex,
            explanation: args.explanation,
            questionNumber: args.questionNumber,
            type: args.type,
            difficulty: args.difficulty,
        });

        return questionId;
    },
});

// Start a quiz (update status to in_progress)
export const startQuiz = mutation({
    args: {
        quizId: v.id("quizzes"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.quizId, {
            status: "in_progress",
        });
        return true;
    },
});

// Submit an answer to a quiz question
export const submitQuizAnswer = mutation({
    args: {
        userId: v.id("users"),
        quizId: v.id("quizzes"),
        questionId: v.id("quiz_questions"),
        selectedOptionIndex: v.number(),
        timeSpentSeconds: v.number(),
    },
    handler: async (ctx, args) => {
        // Get the question to check if the answer is correct
        const question = await ctx.db.get(args.questionId);
        if (!question) {
            throw new Error("Question not found");
        }

        const isCorrect = question.correctOptionIndex === args.selectedOptionIndex;

        // Save the response
        const responseId = await ctx.db.insert("quiz_responses", {
            userId: args.userId,
            quizId: args.quizId,
            questionId: args.questionId,
            selectedOptionIndex: args.selectedOptionIndex,
            isCorrect,
            timeSpentSeconds: args.timeSpentSeconds,
            submittedAt: Date.now(),
        });

        return {
            responseId,
            isCorrect,
            explanation: question.explanation,
        };
    },
});

// Complete a quiz and calculate the score
export const completeQuiz = mutation({
    args: {
        quizId: v.id("quizzes"),
    },
    handler: async (ctx, args) => {
        // Get all responses for this quiz
        const quiz = await ctx.db.get(args.quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }

        const questions = await ctx.db
            .query("quiz_questions")
            .withIndex("by_quizId", (q) => q.eq("quizId", args.quizId))
            .collect();

        const responses = await ctx.db
            .query("quiz_responses")
            .withIndex("by_userId_quizId", (q) =>
                q.eq("userId", quiz.userId).eq("quizId", args.quizId)
            )
            .collect();

        // Calculate score
        const totalQuestions = questions.length;
        const correctAnswers = responses.filter(r => r.isCorrect).length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);

        // Calculate total time spent
        const totalTimeSpent = responses.reduce((sum, r) => sum + r.timeSpentSeconds, 0);

        // Update quiz with results
        await ctx.db.patch(args.quizId, {
            status: "completed",
            completedAt: Date.now(),
            score,
            timeSpentSeconds: totalTimeSpent,
        });

        return {
            score,
            totalTimeSpent,
            totalQuestions,
            correctAnswers,
        };
    },
});
