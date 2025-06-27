import { MutationCtx, QueryCtx } from "../_generated/server";

export const assertUserAuthenticated = async (ctx: MutationCtx | QueryCtx) => {
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

    return user;
}