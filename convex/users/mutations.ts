import { v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { assertUserAuthenticated } from "./utils";

/**
 * Schedules the generation of a personalized learning plan for the user.
 */
export const generateAndSaveLearningPlan = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await assertUserAuthenticated(ctx);
        await ctx.scheduler.runAfter(0, internal.learning.actions.generateLearningPlan, {
            userId: user._id,
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
export const completeOnboarding = mutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await assertUserAuthenticated(ctx);

        await ctx.db.patch(user._id, {
            username: args.username,
            onboardingStep: "username",
        });

        // Create an empty user profile to be filled in the next step
        await ctx.db.insert("user_profiles", {
            userId: user._id,
            learningGoals: [],
            studyReason: "",
            studyPlan: "weekly",
            studyStreak: 0,
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
export const saveLearningGoals = mutation({
    args: {
        learningGoals: v.array(
            v.object({
                topic: v.string(),
                level: v.union(
                    v.literal("beginner"),
                    v.literal("intermediate"),
                    v.literal("advanced")
                ),
            })
        ),
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
            updatedAt: Date.now(),
        });

        await ctx.db.patch(user._id, {
            onboardingStep: "completed",
            alreadyOnboarded: true, // Mark as fully onboarded
        });
    },
});