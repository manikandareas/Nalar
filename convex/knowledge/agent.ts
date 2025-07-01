import { createTool } from "@convex-dev/agent";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { updateKnowledgeGraphSchema } from "./validations";

export const updateKnowledgeGraphTool = createTool({
    description: "Updates the user's knowledge graph with a new topic or connections between topics.",
    args: updateKnowledgeGraphSchema,
    handler: async (ctx, { topic, description, connections }): Promise<string> => {
        const userId = ctx.userId as Id<"users">;
        const existingNode = await ctx.runQuery(api.knowledge.queries.getNodeByTopic, { topic, userId });

        let sourceNodeId = existingNode?._id;

        if (!sourceNodeId) {
            sourceNodeId = await ctx.runMutation(api.knowledge.mutations.addNode, {
                topic,
                description,
                userId,
            });
        }

        if (connections) {
            for (const connection of connections) {
                const targetNode = await ctx.runQuery(api.knowledge.queries.getNodeByTopic, { topic: connection.topic, userId });
                let targetNodeId = targetNode?._id;

                if (!targetNodeId) {
                    targetNodeId = await ctx.runMutation(api.knowledge.mutations.addNode, {
                        topic: connection.topic,
                        description: "", // Let the AI fill this in later
                        userId,
                    });
                }

                await ctx.runMutation(api.knowledge.mutations.addEdge, {
                    sourceNodeId: sourceNodeId!,
                    targetNodeId: targetNodeId!,
                    label: connection.relationship,
                    userId,
                });
            }
        }

        return `Successfully updated knowledge graph for: ${topic}`;
    },
});
