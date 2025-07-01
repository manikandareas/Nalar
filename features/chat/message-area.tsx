"use client"

import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State for scroll management
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Refs for tracking scroll behavior
    const isNearBottomRef = useRef(true);
    const prevMessagesLengthRef = useRef(0);
    const userHasScrolledRef = useRef(false);
    const lastMessageRoleRef = useRef<string | null>(null);

    /**
     * Scrolls to the bottom of the chat smoothly
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false);
        isNearBottomRef.current = true;
        userHasScrolledRef.current = false;
    };

    /**
     * Checks if the user is near the bottom of the chat
     * @returns boolean indicating if user is within 100px of bottom
     */
    const checkIfNearBottom = (): boolean => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        return distanceFromBottom < 100; // Consider "near bottom" if within 100px
    };

    /**
     * Handle scroll events to show/hide the scroll button
     */
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            const isScrolledUp = distanceFromBottom > 200;

            // Update scroll state
            if (isScrolledUp && !userHasScrolledRef.current) {
                userHasScrolledRef.current = true;
            }

            // Update button visibility
            setShowScrollButton(isScrolledUp);
            isNearBottomRef.current = !isScrolledUp;
        };

        // Add scroll listener with throttling for better performance
        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
        const throttledScrollHandler = () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                    scrollTimeout = null;
                }, 100); // Throttle to 100ms
            }
        };

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        return () => {
            window.removeEventListener('scroll', throttledScrollHandler);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, []);

    /**
     * Handle auto-scrolling for different scenarios
     */
    useEffect(() => {
        if (messages.length === 0) return;

        const messagesLength = messages.length;
        const hasNewMessages = messagesLength > prevMessagesLengthRef.current;
        const lastMessage = messages[messagesLength - 1];
        const isUserMessage = lastMessage?.role === 'user';
        const isNewUserMessage = isUserMessage && lastMessageRoleRef.current !== 'user';

        // Update tracking refs
        prevMessagesLengthRef.current = messagesLength;
        lastMessageRoleRef.current = lastMessage?.role || null;

        // Case 1: User sends a new message - always scroll to bottom
        if (isNewUserMessage) {
            scrollToBottom();
            return;
        }

        // Case 2: New AI message - scroll only if user is near bottom or hasn't manually scrolled
        if (hasNewMessages && (isNearBottomRef.current || !userHasScrolledRef.current)) {
            scrollToBottom();
        }
    }, [messages]);

    // Send initial message when room details are available
    useEffect(() => {
        sendInitialMessage();
    }, [roomDetails]);

    return (
        <div className="w-full mb-28">
            {/* Background pattern for chat area */}
            <div className="absolute inset-0 bg-background opacity-50 pointer-events-none" />

            {/* Scroll to bottom button */}
            {showScrollButton && (
                <Button
                    onClick={scrollToBottom}
                    className="fixed bottom-28 right-8 z-50 rounded-full w-10 h-10 p-0 shadow-lg"
                    size={"icon"}
                    variant={"outline"}
                    aria-label="Scroll to bottom"
                >
                    <ChevronDown className="h-5 w-5" />
                </Button>
            )}

            <div className="w-full py-8 relative z-10" ref={containerRef}>
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

                {/* Invisible div at the bottom for scrolling */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
