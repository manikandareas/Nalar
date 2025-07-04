import { v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { assertUserAuthenticated } from "./utils";

/**
 * Schedules the generation of a personalized learning plan for the user.
 */
export const generateAndSaveLearningPlan = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        ctx.scheduler.runAfter(0, internal.learning.actions.generateLearningPlan, {
            userId: args.userId,
        });
    },
});

/**
 * Updates the username of the currently authenticated user.
 *
 * @param username - The new username.
 * @returns A promise that resolves to the updated user document or null if not authenticated or user not found.
 */
export const updateUsername = mutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (!user) {
            return null;
        }

        await ctx.db.patch(user._id, {
            username: args.username,
        });

        return await ctx.db.get(user._id);
    },
});

/**
 * Removes the profile image of the currently authenticated user.
 *
 * @throws Error if the user is not authenticated or not found.
 */
export const removeUserImage = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        ctx.db.patch(user._id, { profileImage: undefined });
    },
});

/**
 * Updates the profile image of the currently authenticated user.
 *
 * @param imageUrl - The URL of the new profile image.
 * @throws Error if the user is not authenticated or not found.
 */
export const updateUserImage = mutation({
    args: {
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, { profileImage: args.imageUrl });
    },
});

/**
 * Completes the onboarding process for the currently authenticated user.
 *
 * @param username - The username to set for the user.
 * @throws Error if the user is not authenticated or not found.
 */
export const completeOnboardingUsername = mutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return;
        }

        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (existingUser) {
            throw new Error("User already exists");
        }

        // Create an empty user profile to be filled in the next step
        const createdUserId = await ctx.db.insert("users", {
            userId: identity.subject,
            alreadyOnboarded: false,
            username: args.username,
            email: identity.email as string,
            onboardingStep: "username",
            profileImage: identity.pictureUrl as string,
        })

        if (!createdUserId) {
            throw new Error("User not created");
        }


        // Create an empty user profile to be filled in the next step
        await ctx.db.insert("user_profiles", {
            userId: createdUserId,
            learningGoals: [],
            studyReason: "",
            studyPlan: "weekly",
            studyStreak: 0,
            level: "beginner",
            updatedAt: Date.now(),
        });
    },
});

/**
 * Saves the user's learning goals during the onboarding process.
 *
 * @param learningGoals - An array of learning goals with topics and levels.
 * @throws Error if the user is not authenticated or not found.
 */
export const saveLearningPlan = mutation({
    args: {
        learningGoals: v.array(
            v.string()
        ),
        studyReason: v.string(),
        studyPlan: v.string(),
        level: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await assertUserAuthenticated(ctx);

        const profile = await ctx.db
            .query("user_profiles")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .first();

        if (!profile) {
            throw new Error("User profile not found");
        }

        await ctx.db.patch(profile._id, {
            learningGoals: args.learningGoals,
            studyReason: args.studyReason,
            studyPlan: args.studyPlan,
            level: args.level as "beginner" | "intermediate" | "advanced",
            updatedAt: Date.now(),
        });

        await ctx.db.patch(user._id, {
            onboardingStep: "completed",
            alreadyOnboarded: true, // Mark as fully onboarded
        });
    },
});