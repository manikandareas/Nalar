"use client"

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UIMessage, useSmoothText } from "@convex-dev/agent/react";
import { Bot, Copy, User } from 'lucide-react';
import React, { useState } from "react";



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
    const { content, role, className, parts } = props;
    const [visibleText] = useSmoothText(content);
    const isUser = role === "user";
    const [copied, setCopied] = useState(false);

    // Function to copy message content to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    console.log({ parts })

    return (
        <div className={cn("group relative mb-6 px-4", className)}>
            <div className={cn(
                "flex gap-3 max-w-4xl mx-auto",
                isUser ? "justify-end" : "justify-start"
            )}>
                {/* AI Avatar - only shown for AI messages */}
                {!isUser && (
                    <Avatar className="h-8 w-8 bg-teal-600 flex-shrink-0 mt-1 ring-2 ring-teal-100">
                        <AvatarFallback className="text-white text-sm font-medium">
                            <Bot className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                )}

                {/* Message Content */}
                <div
                    className={cn(
                        "max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] relative group/message",
                        isUser
                            ? "bg-zinc-100/50 backdrop-blur-sm rounded-2xl rounded-br-md px-4 py-3"
                            : "bg-white/5 w-full border-b border-gray-200 pb-6",
                    )}
                >
                    {/* Copy button - only visible on hover */}
                    {!isUser && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={copyToClipboard}
                                        className="absolute right-2 top-2 opacity-0 group-hover/message:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-100"
                                        aria-label="Copy message"
                                    >
                                        <Copy className="h-4 w-4 text-gray-500" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{copied ? "Copied!" : "Copy message"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    <div className={cn(
                        "text-sm sm:text-base leading-relaxed",
                        isUser ? "text-foreground" : "text-gray-800"
                    )}>
                        <MarkdownRenderer
                            content={visibleText}
                            className={isUser ? "text-foreground" : "text-gray-800"}
                        />
                    </div>
                </div>

                {/* User Avatar - only shown for user messages */}
                {isUser && (
                    <Avatar className="h-8 w-8 bg-purple-500 flex-shrink-0 mt-1 ring-2 ring-purple-100">
                        <AvatarFallback className="text-white text-sm font-medium">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
    )
}
