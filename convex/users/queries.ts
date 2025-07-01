import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Retrieves the currently authenticated user.
 *
 * @returns A promise that resolves to the user document or null if not authenticated or not found.
 */
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const userData = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (!userData) {
            return null;
        }

        return userData;
    },
});

export const getUserProfile = internalQuery({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const user = await ctx.db.query("users").withIndex("by_user_id", q => q.eq("userId", userId)).first();
        if (!user) {
            throw new Error("User not found");
        }

        return ctx.db
            .query("user_profiles")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .first();
    },
});


