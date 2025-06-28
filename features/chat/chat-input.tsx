"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Calculator, Loader2, SendHorizonal, Type, Info } from "lucide-react"
import { useState } from "react"
import { useChat } from "./hooks/use-chat"
import { MathInput } from "./math-input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
        <div className="border-t border-gray-200 bg-white p-4 shadow-md">
            <div className="max-w-4xl mx-auto">
                {/* Input mode selection with tooltips */}
                <div className="flex justify-between items-center mb-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center text-xs text-gray-500">
                                    <Info className="h-3.5 w-3.5 mr-1" />
                                    <span>Nalar akan selalu merespons dalam Bahasa Indonesia</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Anda dapat bertanya dalam Bahasa Indonesia atau Inggris</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <div className="flex space-x-2">
                        <Toggle
                            pressed={inputMode === 'text'}
                            onPressedChange={() => inputMode !== 'text' && toggleInputMode()}
                            size="sm"
                            variant="outline"
                            aria-label="Text mode"
                            className={inputMode === 'text' ? "bg-teal-50 border-teal-200" : ""}
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
                            className={inputMode === 'math' ? "bg-teal-50 border-teal-200" : ""}
                        >
                            <Calculator className="h-4 w-4" />
                            <span className="ml-2">Math</span>
                        </Toggle>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    {/* Dynamic input based on mode */}
                    {inputMode === 'text' ? (
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Tanyakan tentang konsep matematika..."
                            className="min-h-[60px] max-h-[200px] pr-12 resize-none border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-xl shadow-sm"
                            rows={1}
                            disabled={isLoading}
                        />
                    ) : (
                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <MathInput
                                value={message}
                                onChange={setMessage}
                                placeholder="Masukkan ekspresi matematika..."
                                className="min-h-[60px] max-h-[200px]"
                                onSubmit={() => void handleSubmit(new Event('submit') as unknown as React.FormEvent)}
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="sm"
                        className={`absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full ${!message.trim() || isLoading ? '' : 'bg-teal-600 hover:bg-teal-700'}`}
                        disabled={!message.trim() || isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <SendHorizonal className="h-4 w-4" />
                        )}
                    </Button>
                </form>
                
                {/* Typing hint */}
                <div className="mt-2 text-xs text-gray-400 text-center">
                    {inputMode === 'text' ? 
                        "Tekan Enter untuk kirim, Shift+Enter untuk baris baru" : 
                        "Gunakan sintaks LaTeX untuk ekspresi matematika"}
                </div>
            </div>
        </div>
    )
}
