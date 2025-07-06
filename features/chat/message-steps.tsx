"use client";

import { UIMessage } from "@convex-dev/agent/react";
import { Check } from 'lucide-react';
import React from 'react';

type UIMessagePart = UIMessage['parts'][number];

const Step = ({ title, children, isLast }: { title: string, children: React.ReactNode, isLast: boolean }) => (
    <div className="flex gap-4">
        {/* Icon and vertical line */}
        <div className="flex flex-col items-center self-stretch">
            <div className="bg-primary rounded-full h-6 w-6 flex items-center justify-center text-white z-10 flex-shrink-0">
                <Check className="h-4 w-4" />
            </div>
            {!isLast && <div className="w-px bg-gray-300 flex-grow"></div>}
        </div>

        {/* Content */}
        <div className="pt-0.5 pb-6 w-full">
            <h3 className="font-semibold text-gray-800 -mt-1 text-sm">{title}</h3>
            <div className="text-gray-600 mt-2 text-xs">{children}</div>
        </div>
    </div>
);

export const StepsContainer = ({ parts }: { parts: UIMessagePart[] }) => {
    // Filter out text parts, as they are part of the final message content.
    const steps = parts.filter(p => p.type !== 'text');

    return (
        <div className="relative">
            {steps.map((part, index) => {
                const isLast = index === steps.length - 1;
                if (part.type === 'reasoning') {
                    return (
                        <Step key={index} title="Thinking" isLast={isLast}>
                            <p className="text-gray-600">{part.reasoning}</p>
                        </Step>
                    );
                }
                if (part.type === 'tool-invocation') {
                    const title = `Call to ${part.toolInvocation.toolName}`;
                    switch (part.toolInvocation.toolName) {
                        case "gather-relevant-resource":
                            const toolResults = (part.toolInvocation as { result: { content: string, description: string, og: string, title: string, url: string }[] }).result;
                            if (!Array.isArray(toolResults) || toolResults.length === 0) {
                                return (
                                    <Step key={index} title="No resources found" isLast={isLast}>
                                        <div className="text-gray-500">The search returned no results.</div>
                                    </Step>
                                );
                            }
                            return (
                                <React.Fragment key={index}>
                                    <Step title={`Searched`} isLast={false}>
                                        <div className="bg-gray-100 p-2 rounded-md flex items-center gap-2 text-gray-700 border border-gray-200">
                                            <pre className="text-xs whitespace-pre-wrap font-mono"><code>{JSON.stringify(part.toolInvocation.args, null, 2)}</code></pre>
                                        </div>
                                    </Step>
                                    <Step title={`Synthesized ${toolResults.length} sources`} isLast={isLast}>
                                        <div className="flex overflow-x-auto space-x-4 p-1 -m-2">
                                            {toolResults.map((result, i) => {
                                                try {
                                                    const domain = new URL(result.url).hostname.replace('www.', '');
                                                    return (
                                                        <a
                                                            key={i}
                                                            href={result.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block w-60 flex-shrink-0 border border-gray-200 rounded-lg p-3 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                                                        >
                                                            <div className="flex items-center mb-2">
                                                                <img
                                                                    src={result.og || `https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                                                                    alt={`${domain} favicon`}
                                                                    className="w-4 h-4 mr-2 rounded"
                                                                />
                                                                <span className="text-xs text-gray-500 truncate flex-1">{domain}</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-gray-400"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                                            </div>
                                                            <p className="text-sm text-gray-700 line-clamp-4">{result.description || result.title}</p>
                                                        </a>
                                                    );
                                                } catch (e) {
                                                    return null;
                                                }
                                            })}
                                        </div>
                                    </Step>
                                </React.Fragment>
                            );
                        default:
                            return (
                                <Step key={index} title={title} isLast={isLast}>
                                    <div className="bg-gray-100 p-2 rounded-md flex items-center gap-2 text-gray-700 border border-gray-200">
                                        <pre className="text-xs whitespace-pre-wrap font-mono"><code>{JSON.stringify(part.toolInvocation.args, null, 2)}</code></pre>
                                    </div>
                                </Step>
                            );
                    }
                }
                return null;
            })}
        </div>
    );
};
