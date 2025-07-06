import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import type { EmbeddingModel, LanguageModelV1, } from "ai";
import { embed } from "ai";
import { components } from "./_generated/api";

// Import the Nalar system prompt
import { gatherRelevantResourceTool } from "./chat/agent";
import { NALAR_SYSTEM_PROMPT } from "./instructions";
import { updateKnowledgeGraphTool } from "./knowledge/agent";
import { createQuizTool } from "./quizzes/agent";


export const MAIN_MODEL: LanguageModelV1 = openai.chat("gpt-4.1-mini");

export const MAIN_REASONING_MODEL: LanguageModelV1 = openai.chat("o3-mini");

export const GENERATE_QUIZ_MODEL: LanguageModelV1 = openai.chat("gpt-4.1", { structuredOutputs: true });

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
    maxSteps: 5,
    instructions: NALAR_SYSTEM_PROMPT,
    contextOptions: {
        excludeToolMessages: false,
        searchOptions: {
            limit: 5,
            messageRange: { before: 2, after: 1 },
        },
    },
    tools: {
        ['gather-relevant-resource']: gatherRelevantResourceTool,
        ["create-quiz"]: createQuizTool,
        ["update-knowledge-graph"]: updateKnowledgeGraphTool,
    },
});