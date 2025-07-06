import { vStreamArgs } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { nalarAgent } from "../model";
import { assertUserAuthenticated } from "../users/utils";

export const listThreadMessages = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        streamArgs: vStreamArgs,
    },
    handler: async (ctx, args) => {
        const { threadId, paginationOpts, streamArgs } = args;
        // await authorizeThreadAccess(ctx, threadId);
        const streams = await nalarAgent.syncStreams(ctx, { threadId, streamArgs });

        const paginated = await nalarAgent.listMessages(ctx, {
            threadId,
            paginationOpts,
        });

        return {
            ...paginated,
            streams,
        };
    },
});

export const roomDetails = query({
    args: {
        threadId: v.string(),
    },
    handler: async (ctx, args) => {
        const { threadId } = args;
        const room = await ctx.db.query("chat_conversations").withIndex("by_thread_id", (q) => q.eq("threadId", threadId)).first();
        return room;
    },
});

export const userRooms = query({
    args: {},
    handler: async (ctx) => {
        const user = await assertUserAuthenticated(ctx)
        const rooms = await ctx.db.query("chat_conversations").withIndex("by_userId", (q) => q.eq("userId", user._id)).collect();
        return rooms;
    },
});
