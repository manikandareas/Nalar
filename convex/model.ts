import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import type { EmbeddingModel, LanguageModelV1, } from "ai";
import { embed } from "ai";
import { components } from "./_generated/api";

// Import the Nalar system prompt
import { NALAR_SYSTEM_PROMPT } from "../features/chat/ai-instructions";

const MAIN_MODEL: LanguageModelV1 = openai.chat("gpt-4.1-mini-2025-04-14");
const textEmbedding: EmbeddingModel<string> = openai.textEmbeddingModel("text-embedding-3-small",);

// const watsonxProvider = createWatsonxProvider({
//     projectId: "",
// })

// const GRANITE_MODEL: LanguageModelV1 = watsonxProvider.chat("google/flan-t5-xxl")

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
        searchOptions: {
            limit: 5,
            messageRange: { before: 2, after: 1 },
        },
    },
    tools: {},
});