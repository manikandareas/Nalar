"use client"

import { cn } from "@/lib/utils";
import React from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import { buttonVariants } from "./ui/button";

// Define a generic type for ReactMarkdown components
type MarkdownComponentProps = {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
};

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * A reusable Markdown renderer component with math and code highlighting support
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
    return (
        <div className={cn(
            "prose prose-slate max-w-none",
            className
        )}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    [rehypeKatex, {
                        throwOnError: false,
                        strict: false,
                        output: 'html',
                        displayMode: false
                    }]
                ]}
                skipHtml={false}
                components={{

                    // Code block styling
                    code({ node, inline, className, children, ...props }: MarkdownComponentProps) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        if (!inline && language) {
                            return (
                                <div className="relative my-4 rounded-md overflow-hidden">
                                    <div className="bg-gray-800 text-gray-300 px-4 py-1 text-xs font-mono">
                                        {language}
                                    </div>
                                    <SyntaxHighlighter
                                        language={language}
                                        style={oneDark}
                                        customStyle={{
                                            margin: 0,
                                            borderRadius: '0 0 0.375rem 0.375rem',
                                        }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        } else if (inline) {
                            return (
                                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm" {...props}>
                                    {children}
                                </code>
                            );
                        } else {
                            return (
                                <div className="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto">
                                    <code className="font-mono text-sm whitespace-pre-wrap" {...props}>
                                        {children}
                                    </code>
                                </div>
                            );
                        }
                    },

                    // Table styling
                    table({ children, ...props }: MarkdownComponentProps) {
                        return (
                            <div className="overflow-x-auto my-6">
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
                        return <hr className="my-8" {...props} />;
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
                        // To avoid hydration errors with nested divs in paragraphs
                        return <div className="mb-4 paragraph" {...props}>{children}</div>;
                    },

                    // Blockquote styling
                    blockquote({ children, ...props }: MarkdownComponentProps) {
                        return <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props}>{children}</blockquote>;
                    },

                    a({ children, href, ...props }: MarkdownComponentProps & { href?: string }) {
                        const isExternal = href && /^https?:\/\//.test(href);
                        return (
                            <a
                                className={buttonVariants({ variant: "link", className: "mt-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline decoration-dashed font-semibold transition-colors" })}
                                href={href}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                {...props}
                            >
                                {children}
                                {isExternal && (
                                    <svg
                                        aria-label="(opens in a new tab)"
                                        className="inline-block ml-1 h-4 w-4 text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 7V17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10m-1-4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                )}
                            </a>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
