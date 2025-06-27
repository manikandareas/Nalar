"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Calculator, Loader2, SendHorizonal, Type } from "lucide-react"
import { useState } from "react"
import { useChat } from "./hooks/use-chat"
import { MathInput } from "./math-input"

/**
 * Props for the ChatInput component
 */
interface IChatInputProps {
    threadId: string;
}

type InputMode = 'text' | 'math';

/**
 * Component for sending chat messages
 */
export const ChatInput: React.FC<IChatInputProps> = ({ threadId }) => {
    const [message, setMessage] = useState("");
    const [inputMode, setInputMode] = useState<InputMode>('text');
    const { sendMessage, isLoading } = useChat(threadId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            // If in math mode, wrap the LaTeX in dollar signs for rendering
            const formattedMessage = inputMode === 'math' ?
                `$$${message}$$` : message;

            try {
                await sendMessage(formattedMessage);
                setMessage("");
            } catch (error) {
                console.error("Failed to send message:", error)
                // Keep the message in the input if sending fails
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSubmit(e);
        }
    };

    // Toggle between text and math input modes
    const toggleInputMode = () => {
        setInputMode(prev => prev === 'text' ? 'math' : 'text');
    };

    return (
        <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="relative">
                    {/* Input toggle buttons and template selector */}
                    <div className="absolute -top-10 right-0 flex space-x-2">
                        <Toggle
                            pressed={inputMode === 'text'}
                            onPressedChange={() => inputMode !== 'text' && toggleInputMode()}
                            size="sm"
                            variant="outline"
                            aria-label="Text mode"
                        >
                            <Type className="h-4 w-4" />
                            <span className="ml-2">Text</span>
                        </Toggle>
                        <Toggle
                            pressed={inputMode === 'math'}
                            onPressedChange={() => inputMode !== 'math' && toggleInputMode()}
                            size="sm"
                            variant="outline"
                            aria-label="Math mode"
                        >
                            <Calculator className="h-4 w-4" />
                            <span className="ml-2">Math</span>
                        </Toggle>
                    </div>

                    {/* Dynamic input based on mode */}
                    {inputMode === 'text' ? (
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Teach me about..."
                            className="min-h-[60px] max-h-[200px] pr-12 resize-none border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                            rows={1}
                            disabled={isLoading}
                        />
                    ) : (
                        <div className="border rounded-md overflow-hidden">
                            <MathInput
                                value={message}
                                onChange={setMessage}
                                placeholder="Enter math expression..."
                                className="min-h-[60px] max-h-[200px]"
                                onSubmit={() => void handleSubmit(new Event('submit') as unknown as React.FormEvent)}
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="sm"
                        className="absolute right-2 bottom-2 h-8 w-8 p-0"
                        disabled={!message.trim() || isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <SendHorizonal className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
