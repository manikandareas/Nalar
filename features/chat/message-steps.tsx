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
                    return (
                        <Step key={index} title={title} isLast={isLast}>
                            <div className="bg-gray-100 p-2 rounded-md flex items-center gap-2 text-gray-700 border border-gray-200">
                                <pre className="text-xs whitespace-pre-wrap font-mono"><code>{JSON.stringify(part.toolInvocation.args, null, 2)}</code></pre>
                            </div>
                        </Step>
                    );
                }
                return null;
            })}
        </div>
    );
};
