"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UIMessage, useSmoothText } from "@convex-dev/agent/react";
import type React from "react";
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';

/**
 * Props for the Message component
 */
interface MessageProps extends UIMessage {
    className?: string;
}

/**
 * Message component that displays a chat message with proper styling based on the sender
 */
export const Message: React.FC<MessageProps> = (props) => {
    const { content, role, className } = props;
    const [visibleText] = useSmoothText(content);
    const isUser = role === "user";

    return (
        <div className={cn("group relative mb-6", className)}>
            <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                {/* AI Avatar - only shown for AI messages */}
                {!isUser && (
                    <Avatar className="h-8 w-8 bg-teal-600 flex-shrink-0">
                        <AvatarFallback className="text-white text-sm font-medium">AI</AvatarFallback>
                    </Avatar>
                )}

                {/* Message Content */}
                <div
                    className={cn(
                        "max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]",
                        isUser ? "bg-zinc-100/50 backdrop-blur-sm rounded-2xl rounded-br-md px-4 py-3" : "bg-transparent",
                    )}
                >
                    <div className={cn("text-sm sm:text-base leading-relaxed", isUser ? "text-foreground" : "text-gray-800")}>
                        <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {visibleText}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* User Avatar - only shown for user messages */}
                {isUser && (
                    <Avatar className="h-8 w-8 bg-purple-500 flex-shrink-0">
                        <AvatarFallback className="text-white text-sm font-medium">V</AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
    )
}
