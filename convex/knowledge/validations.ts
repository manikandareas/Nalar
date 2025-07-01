import { z } from "zod";

export const updateKnowledgeGraphSchema = z.object({
    topic: z.string().describe("The main topic or concept being discussed."),
    description: z.string().describe("A brief description of the topic."),
    connections: z.array(z.object({
        topic: z.string().describe("The related topic."),
        relationship: z.string().describe("The nature of the relationship (e.g., 'builds on', 'is a type of')."),
    })).optional().describe("Connections to other topics in the knowledge graph."),
});
