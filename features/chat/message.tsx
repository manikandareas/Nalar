"use client"

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { UIMessage, useSmoothText } from "@convex-dev/agent/react";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Bot, User } from 'lucide-react';
import React from "react";
import { StepsContainer } from "./message-steps";

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
    const { data: user } = useQuery(convexQuery(api.users.queries.getCurrentUser, {}))
    const { content, role, className, parts, status } = props;
    const [visibleText] = useSmoothText(content);
    const isUser = role === "user";

    const hasSteps = !isUser && parts && parts.filter(p => p.type !== 'text').length > 0;

    return (
        <div className={cn("group relative mb-6 px-4", className)}>
            <div className={cn(
                "flex gap-3 max-w-4xl mx-auto",
                isUser ? "justify-end" : "items-start flex-col"
            )}>

                {/* AI Avatar - only shown for AI messages */}
                {!isUser && (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 bg-primary flex-shrink-0 mt-1">
                            <AvatarFallback className=" text-sm font-medium">
                                <Bot className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold text-primary">Nalar V1</p>
                    </div>
                )}

                {/* Message Content */}
                <div
                    className={cn(
                        "relative group/message",
                        isUser
                            ? "bg-zinc-100/50 backdrop-blur-sm rounded-2xl rounded-br-md px-4 py-3"
                            : "bg-white/5 w-full border-b border-gray-200",
                    )}
                >
                    {/* Agent steps visualization */}
                    {hasSteps && (
                        <div className="px-1">
                            <StepsContainer parts={parts} />
                        </div>
                    )}

                    {/* Final message text, only if there is content */}
                    {visibleText && (
                        <div className={cn(
                            "text-sm sm:text-base leading-relaxed p-4",
                            isUser ? "text-foreground" : "text-gray-800"
                        )}>
                            <MarkdownRenderer
                                content={visibleText}
                                className={isUser ? "text-foreground" : "text-gray-800"}
                            />
                        </div>
                    )}
                </div>

                {/* User Avatar - only shown for user messages */}
                {isUser && (
                    <Avatar className="h-8 w-8 bg-purple-500 flex-shrink-0 mt-1 ring-2 ring-purple-100">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className="text-white text-sm font-medium">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
    )
}
