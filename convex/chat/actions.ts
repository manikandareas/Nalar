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
            { promptMessageId, maxSteps: 2 },
            { saveStreamDeltas: true },
        );
        await result.consumeStream();
    },
});