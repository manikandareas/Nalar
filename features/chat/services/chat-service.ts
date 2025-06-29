import { api } from "@/convex/_generated/api";
import { optimisticallySendMessage, useThreadMessages } from "@convex-dev/agent/react";
import { useMutation, useQuery } from "convex/react";

/**
 * Service for handling chat-related API calls
 */
export const useChatService = () => {
  // Get room details by thread ID
  const getRoomDetails = (threadId: string) => {
    return useQuery(api.chat.queries.roomDetails, { threadId });
  };

  // List messages in a thread
  const getThreadMessages = (threadId: string, options: { initialNumItems: number; stream: boolean }) => {
    return useThreadMessages(
      api.chat.queries.listThreadMessages,
      { threadId },
      { initialNumItems: options.initialNumItems, stream: options.stream }
    );
  };

  // Send a message to a thread with optimistic updates
  const sendMessage = () => {
    return useMutation(api.chat.mutations.streamChatAsynchronously).withOptimisticUpdate(
      optimisticallySendMessage(api.chat.queries.listThreadMessages)
    );
  };

  // Create a new thread
  const createThread = () => {
    return useMutation(api.chat.mutations.createThread);
  };

  return {
    getRoomDetails,
    getThreadMessages,
    sendMessage,
    createThread,
  };
};
