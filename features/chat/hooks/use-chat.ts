import { toUIMessages } from "@convex-dev/agent/react";
import { useCallback, useState } from "react";
import { useChatService } from "../services/chat-service";

/**
 * Custom hook for chat functionality
 */
export const useChat = (threadId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { getRoomDetails, getThreadMessages, sendMessage } = useChatService();

    // Get room details
    const roomDetails = getRoomDetails(threadId);

    // Get messages with streaming enabled
    const messagesQuery = getThreadMessages(threadId, { initialNumItems: 10, stream: true });
    const messages = toUIMessages(messagesQuery.results ?? []);

    // Send message function with error handling
    const sendMessageMutation = sendMessage();
    const sendChatMessage = useCallback(
        async (message: string) => {
            if (!message.trim()) return;

            setIsLoading(true);
            setError(null);

            try {
                await sendMessageMutation({ threadId, prompt: message });
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to send message"));
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [threadId, sendMessageMutation]
    );

    const sendInitialMessage = () => {
        if (!roomDetails || messages.length > 0) return;
        sendChatMessage(roomDetails.title);
    }

    return {
        messages,
        roomDetails,
        isLoading,
        error,
        sendMessage: sendChatMessage,
        isLoadingMessages: isLoading,
        sendInitialMessage,
    };
};
