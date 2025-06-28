"use client"

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
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
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current;
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, [messages]);

    // Send initial message when room details are available
    useEffect(() => {
        sendInitialMessage();
    }, [roomDetails, sendInitialMessage]);

    return (
        <div className="w-full mb-28">
            {/* Background pattern for chat area */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50 pointer-events-none" />

            {/* <ScrollArea className="h-full w-full" ref={scrollAreaRef}> */}
            <div className="w-full py-8 relative z-10">
                {/* Welcome message at the top */}
                <div className="text-center mb-8 px-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Nalar AI Learning Partner</h2>
                    <p className="text-sm text-gray-500">
                        Asisten pembelajaran AI yang akan membantu Anda memahami konsep-konsep matematika
                    </p>
                </div>

                {/* Show loading indicator if messages are loading */}
                {isLoadingMessages && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
                        <p>Memuat percakapan...</p>
                    </div>
                )}

                {/* Display messages with dividers between AI responses */}
                <div className="space-y-2">
                    {messages.map((message, index) => (
                        <Message
                            {...message}
                            key={message.key}
                            className={message.role === "assistant" && index > 0 ? "pt-6" : ""}
                        />
                    ))}
                </div>

                {/* Show empty state if no messages and not loading */}
                {!isLoadingMessages && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <p className="text-center max-w-md">
                            Belum ada pesan. Mulai percakapan dengan mengirim pertanyaan tentang topik yang ingin Anda pelajari!
                        </p>
                    </div>
                )}
            </div>
            {/* </ScrollArea> */}
        </div>
    );
}
