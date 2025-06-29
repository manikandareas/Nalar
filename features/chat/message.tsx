"use client"

import { MathRenderer } from "@/components/math-renderer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UIMessage, useSmoothText } from "@convex-dev/agent/react";
import { Bot, Copy, User } from 'lucide-react';
import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';

// Define a generic type for ReactMarkdown components
type MarkdownComponentProps = {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
};

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
                        "text-sm sm:text-base leading-relaxed prose prose-slate max-w-none",
                        isUser ? "text-foreground" : "text-gray-800"
                    )}>
                        <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: MarkdownComponentProps) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = match && match[1];

                                    // Handle math blocks specially
                                    if (language === 'math') {
                                        const value = String(children).replace(/\n$/, '');
                                        return <MathRenderer math={value} display={true} />;
                                    }

                                    // Handle inline math
                                    if (inline && className === 'math-inline') {
                                        const value = String(children).replace(/\n$/, '');
                                        return <MathRenderer math={value} display={false} />;
                                    }

                                    // Regular code blocks
                                    return !inline && match ? (
                                        <div className="rounded-md overflow-hidden my-2 shadow-sm">
                                            <div className="bg-gray-800 text-gray-200 text-xs px-4 py-1 flex justify-between items-center">
                                                <span>{match[1]}</span>
                                            </div>
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                                className="!mt-0 !bg-gray-900 !rounded-t-none"
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                // Enhance table styling
                                table({ children, ...props }: MarkdownComponentProps) {
                                    return (
                                        <div className="overflow-x-auto my-4 rounded-md shadow-sm">
                                            <table className="border-collapse border border-gray-300 w-full" {...props}>
                                                {children}
                                            </table>
                                        </div>
                                    );
                                },
                                th({ children, ...props }: MarkdownComponentProps) {
                                    return <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left" {...props}>{children}</th>;
                                },
                                td({ children, ...props }: MarkdownComponentProps) {
                                    return <td className="border border-gray-300 px-4 py-2" {...props}>{children}</td>;
                                },
                                hr({ ...props }: MarkdownComponentProps) {
                                    return <hr className=" my-6" {...props} />;
                                },
                                // List styling
                                ul({ children, ...props }: MarkdownComponentProps) {
                                    return <ul className="list-disc pl-6 space-y-2" {...props}>{children}</ul>;
                                },
                                ol({ children, ...props }: MarkdownComponentProps) {
                                    return <ol className="list-decimal pl-6 space-y-2" {...props}>{children}</ol>;
                                },
                                li({ children, ...props }: MarkdownComponentProps) {
                                    return <li className="pl-1" {...props}>{children}</li>;
                                },
                                // Heading styling
                                h1({ children, ...props }: MarkdownComponentProps) {
                                    return <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>{children}</h1>;
                                },
                                h2({ children, ...props }: MarkdownComponentProps) {
                                    return <h2 className="text-xl font-bold mt-5 mb-3" {...props}>{children}</h2>;
                                },
                                h3({ children, ...props }: MarkdownComponentProps) {
                                    return <h3 className="text-lg font-bold mt-4 mb-2" {...props}>{children}</h3>;
                                },
                                // Paragraph styling
                                p({ children, ...props }: MarkdownComponentProps) {
                                    // To avoid hydration errors with nested divs in paragraphs,
                                    // we always use a div with paragraph styling instead of an actual p tag
                                    // This is safer and prevents the "div cannot be a descendant of p" error
                                    return <div className="mb-4 paragraph" {...props}>{children}</div>;
                                },
                                // Blockquote styling
                                blockquote({ children, ...props }: MarkdownComponentProps) {
                                    return <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props}>{children}</blockquote>;
                                }
                            }}
                        >
                            {visibleText}
                        </ReactMarkdown>
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
