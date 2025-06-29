import { v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { nalarAgent } from "../model";
import { assertUserAuthenticated } from "../users/utils";


export const createThread = mutation({
    args: {
        prompt: v.string()
    },
    handler: async (ctx, args) => {
        const user = await assertUserAuthenticated(ctx)
        if (!user) {
            throw new Error("User not authenticated");
        }
        const { threadId } = await nalarAgent.createThread(ctx, {
            userId: user._id,
        });

        await ctx.db.insert("chat_conversations", {
            threadId,
            userId: user._id,
            updatedAt: Date.now(),
            isArchived: false,
            title: args.prompt,
        });

        return threadId;
    },
});

export const streamChatAsynchronously = mutation({
    args: { prompt: v.string(), threadId: v.string() },
    handler: async (ctx, { prompt, threadId }) => {
        const { messageId } = await nalarAgent.saveMessage(ctx, {
            threadId,
            prompt,
            skipEmbeddings: true,
        });
        await ctx.scheduler.runAfter(0, internal.chat.actions.streamChat, {
            threadId,
            promptMessageId: messageId,
        });
    },
});


