import { v } from "convex/values";
import { query } from "../_generated/server";

export const getGraph = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {

        const nodes = await ctx.db
            .query("knowledge_nodes")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        const edges = await ctx.db
            .query("knowledge_edges")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        return { nodes, edges };
    },
});

export const getNodeByTopic = query({
    args: { topic: v.string(), userId: v.id("users") },
    handler: async (ctx, { topic, userId }) => {
        return ctx.db
            .query("knowledge_nodes")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("topic"), topic))
            .first();
    },
});
