import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const addNode = mutation({
    args: { topic: v.string(), description: v.string(), userId: v.id("users") },
    handler: async (ctx, { topic, description, userId }) => {
        ;

        const nodeId = await ctx.db.insert("knowledge_nodes", {
            userId,
            topic,
            description,
            understandingLevel: 0, // Initial understanding level
            lastUpdated: Date.now(),
        });

        return nodeId;
    },
});

export const addEdge = mutation({
    args: {
        sourceNodeId: v.id("knowledge_nodes"),
        targetNodeId: v.id("knowledge_nodes"),
        label: v.optional(v.string()),
        userId: v.id("users"),
    },
    handler: async (ctx, { sourceNodeId, targetNodeId, label, userId }) => {
        const edgeId = await ctx.db.insert("knowledge_edges", {
            userId,
            sourceNodeId,
            targetNodeId,
            label,
        });

        return edgeId;
    },
});

export const updateNodeUnderstanding = mutation({
    args: {
        nodeId: v.id("knowledge_nodes"),
        understandingLevel: v.number(),
        userId: v.id("users"),
    },
    handler: async (ctx, { nodeId, understandingLevel, userId }) => {
        await ctx.db.patch(nodeId, {
            understandingLevel: Math.max(0, Math.min(100, understandingLevel)), // Clamp between 0-100
            lastUpdated: Date.now(),
        });
    },
});
