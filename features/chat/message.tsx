"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UIMessage, useSmoothText } from "@convex-dev/agent/react";
import type React from "react";
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';




interface MessageProps extends UIMessage {
    // showActions?: boolean
    // className?: string
}

export const Message: React.FC<MessageProps> = (props) => {
    const [visibleText] = useSmoothText(props.content);
    const isUser = props.role === "user"

    return (
        <div className={cn("group relative mb-6")}>
            <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                {!isUser && (
                    <Avatar className="h-8 w-8 bg-teal-600 flex-shrink-0">
                        <AvatarFallback className="text-white text-sm font-medium">AI</AvatarFallback>
                    </Avatar>
                )}

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

                {isUser && (
                    <Avatar className="h-8 w-8 bg-purple-500 flex-shrink-0">
                        <AvatarFallback className="text-white text-sm font-medium">V</AvatarFallback>
                    </Avatar>
                )}
            </div>

            {/* {!isUser && props.showActions && (
                <div className="flex items-center gap-2 mt-3 ml-11 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-gray-700">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Rewrite
                    </Button>

                    <div className="flex items-center gap-1 ml-auto">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                            <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                            <ThumbsDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )} */}
        </div>
    )
}
