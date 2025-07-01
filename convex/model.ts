import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import type { EmbeddingModel, LanguageModelV1, } from "ai";
import { embed } from "ai";
import { components } from "./_generated/api";

// Import the Nalar system prompt
import { NALAR_SYSTEM_PROMPT } from "./instructions";
import { createQuizTool } from "./quizzes/agent";
import { updateKnowledgeGraphTool } from "./knowledge/agent";

export const MAIN_MODEL: LanguageModelV1 = openai.chat("gpt-4.1-mini");

export const GENERATE_QUIZ_MODEL: LanguageModelV1 = openai.chat("gpt-4.1");

const textEmbedding: EmbeddingModel<string> = openai.textEmbeddingModel("text-embedding-3-small",);

export const embedText = async (text: string) => {
    const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: text,
    });
    return embedding;
};

export const nalarAgent = new Agent(components.agent, {
    name: "Nalar Agent",
    chat: MAIN_MODEL,
    textEmbedding: textEmbedding,
    maxSteps: 3,
    instructions: NALAR_SYSTEM_PROMPT,
    contextOptions: {
        excludeToolMessages: false,
        searchOptions: {
            limit: 5,
            messageRange: { before: 2, after: 1 },
        },
    },
    tools: {
        createQuizTool,
        updateKnowledgeGraphTool,
    },
});