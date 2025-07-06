import FirecrawlApp from "@mendable/firecrawl-js";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { nalarAgent } from "../model";

export const streamChat = internalAction({
    args: {
        promptMessageId: v.string(),
        threadId: v.string(),
    },
    handler: async (ctx, { promptMessageId, threadId }) => {
        const { thread } = await nalarAgent.continueThread(ctx, { threadId });
        const result = await thread.streamText(
            { promptMessageId },
            { saveStreamDeltas: true },
        );
        await result.consumeStream();
    },
});

const fireCrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

export const searchResources = internalAction({
    args: {
        query: v.string(),
        params: v.optional(v.object({
            limit: v.number(),
        }))
    },
    handler: async (ctx, args) => {
        try {
            const result = await fireCrawl.search(args.query, {
                limit: args.params?.limit || 3,
                scrapeOptions: {
                    "formats": ["markdown"]
                }
            });

        } catch (error) {
            console.error("Failed to search resources")
            console.error(error)
        }

    },
})