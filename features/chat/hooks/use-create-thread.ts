import { useState, useCallback } from "react";
import { useChatService } from "../services/chat-service";

/**
 * Custom hook for creating new chat threads
 */
export const useCreateThread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { createThread } = useChatService();

  const createThreadMutation = createThread();

  const createNewThread = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return null;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const newId = await createThreadMutation({ prompt });
        return newId;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to create thread"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [createThreadMutation]
  );

  return {
    createThread: createNewThread,
    isLoading,
    error,
  };
};
