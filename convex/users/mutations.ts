import { v } from "convex/values";
import { mutation } from "../_generated/server";

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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, {
            username: args.username,
            alreadyOnboarded: true,
        });
    },
});