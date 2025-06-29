import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
	users: defineTable({
		username: v.string(),
		email: v.string(),
		userId: v.string(), // Clerk userId
		profileImage: v.optional(v.string()),
		alreadyOnboarded: v.boolean(),
		learningStyle: v.optional(
			v.union(
				v.literal("visual"),
				v.literal("auditory"),
				v.literal("kinesthetic"),
				v.literal("mixed"),
			),
		),
		preferences: v.optional(v.any()), // Flexible JSON for UI preferences, notifications
	}).index("by_user_id", ["userId"]),

	// USER LEARNING PROFILE
	user_profiles: defineTable({
		userId: v.id("users"),
		learningGoals: v.array(v.string()),
		currentLevel: v.string(),
		studyReason: v.string(),
		studyPlan: v.string(), // "daily", "weekly", "intensive"
		preferences: v.optional(v.any()), // learning style, notification settings
		studyStreak: v.number(), // Consecutive days
		streakStartDate: v.optional(v.number()),
		updatedAt: v.number(),
	}).index("by_userId", ["userId"]),

	// AI CHAT
	chat_conversations: defineTable({
		userId: v.id("users"),
		threadId: v.string(),
		title: v.string(),
		updatedAt: v.number(),
		isArchived: v.boolean(),
	})
		.index("by_userId", ["userId"])
		.index("by_thread_id", ["threadId"]),

	knowledge_nodes: defineTable({
		userId: v.id("users"),
		topic: v.string(),
		description: v.string(),
		understandingLevel: v.number(), // 0-100
		lastUpdated: v.number(),
		connections: v.array(v.id("knowledge_nodes")), // related topics
	}).index("by_userId", ["userId"]),

	// QUIZZES
	quizzes: defineTable({
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
		completedAt: v.optional(v.number()),
		timeSpentSeconds: v.optional(v.number()),
		score: v.optional(v.number()), // 0-100
		status: v.optional(
			v.union(
				v.literal("pending"),
				v.literal("in_progress"),
				v.literal("completed")
			),
		)
	})
		.index("by_userId", ["userId"])
		.index("by_threadId", ["threadId"]),

	// QUIZ QUESTIONS
	quiz_questions: defineTable({
		quizId: v.id("quizzes"),
		questionNumber: v.number(),
		question: v.string(),
		options: v.array(v.string()),
		correctOptionIndex: v.number(),
		explanation: v.string(),
		type: v.union(
			v.literal("multiple_choice"),
			v.literal("true_false")
		),
		difficulty: v.union(
			v.literal("easy"),
			v.literal("medium"),
			v.literal("hard")
		),
	}).index("by_quizId", ["quizId"]),

	// USER QUIZ RESPONSES
	quiz_responses: defineTable({
		userId: v.id("users"),
		quizId: v.id("quizzes"),
		questionId: v.id("quiz_questions"),
		selectedOptionIndex: v.number(),
		isCorrect: v.boolean(),
		timeSpentSeconds: v.number(),
		submittedAt: v.number(),
	})
		.index("by_userId_quizId", ["userId", "quizId"])
		.index("by_questionId", ["questionId"]),
});

export default schema