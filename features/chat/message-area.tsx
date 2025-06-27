"use client"

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useChat } from "./hooks/use-chat";
import { Message } from "./message";

/**
 * Props for the MessagesArea component
 */
interface IMessageAreaProps {
    threadId: string;
}

/**
 * Component that displays chat messages in a scrollable area
 */
export const MessagesArea: React.FC<IMessageAreaProps> = ({ threadId }) => {
    const { messages, isLoadingMessages, sendInitialMessage, roomDetails } = useChat(threadId);

    useEffect(() => {
        sendInitialMessage();
    }, [roomDetails]);
    return (
        <ScrollArea className="h-[calc(100vh-1rem-8rem-6rem)] w-full">
            <div className="w-full px-4 py-6">
                {/* Show loading indicator if messages are loading */}
                {isLoadingMessages && messages.length === 0 && (
                    <div className="flex justify-center py-4 text-gray-500">
                        <p>Loading messages...</p>
                    </div>
                )}

                {/* Display messages */}
                {messages.map((message) => (
                    <Message {...message} key={message.key} />
                ))}

                {/* Show empty state if no messages and not loading */}
                {!isLoadingMessages && messages.length === 0 && (
                    <div className="flex justify-center py-4 text-gray-500">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}
