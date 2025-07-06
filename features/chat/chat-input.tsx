"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calculator, Info, Loader2, SendHorizonal, Type, X } from "lucide-react"
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
    const [mathAttachment, setMathAttachment] = useState<string | null>(null);
    const [inputMode, setInputMode] = useState<InputMode>('text');
    const { sendMessage, isLoading } = useChat(threadId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalMessage = message.trim() +
            (mathAttachment ? `
            $$${mathAttachment}$$` : '');

        if (finalMessage) {
            try {
                await sendMessage(finalMessage);
                setMessage("");
                setMathAttachment(null);
                setInputMode('text'); // Reset to text mode after sending
            } catch (error) {
                console.error("Failed to send message:", error)
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className="border-t border-gray-200 rounded-2xl bg-zinc-500/5 backdrop-blur-sm p-2 sm:p-4 shadow-md relative">
            <div className="w-full flex flex-col">
                <div className="w-fit mb-2 sm:mb-3">
                    <TooltipProvider>
                        <Tooltip >
                            <TooltipTrigger asChild>
                                <div className="flex items-center text-xs text-gray-500 justify-center sm:justify-start">
                                    <Info className="h-3.5 w-3.5 mr-1" />
                                    <span>Nalar akan selalu merespons dalam Bahasa Indonesia</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Anda dapat bertanya dalam Bahasa Indonesia atau Inggris</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-4">
                    {inputMode === 'text' ? (
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={mathAttachment ? "Tambahkan deskripsi untuk lampiran matematika..." : "Tanyakan tentang konsep matematika..."}
                            className="flex-1 min-h-[48px] sm:min-h-[60px] max-h-[200px] resize-none border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-xl shadow-sm"
                            rows={1}
                            disabled={isLoading}
                        />
                    ) : (
                        <div className="w-full border rounded-xl overflow-hidden shadow-sm">
                            <MathInput
                                value={mathAttachment || ""}
                                onChange={(latex) => {
                                    setMathAttachment(latex);
                                }}
                                placeholder="Masukkan ekspresi matematika..."
                                className="min-h-[48px] sm:min-h-[60px] max-h-[200px]"
                                onSubmit={() => setInputMode('text')}
                            />
                        </div>
                    )}

                    {mathAttachment && (
                        <MathAttachment
                            onClick={() => setInputMode('math')}
                            onRemove={() => {
                                setMathAttachment(null)
                            }}
                            content={mathAttachment}
                        />
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="flex space-x-2 self-center sm:self-auto">
                            <Toggle
                                pressed={inputMode === 'text'}
                                onPressedChange={() => setInputMode('text')}
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
                                onPressedChange={() => setInputMode('math')}
                                size="sm"
                                variant="outline"
                                aria-label="Math mode"
                                className={inputMode === 'math' ? "bg-teal-50 border-teal-200" : ""}
                            >
                                <Calculator className="h-4 w-4" />
                                <span className="ml-2">Math</span>
                            </Toggle>
                        </div>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={(!message.trim() && !mathAttachment) || isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <SendHorizonal className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </form>

                {!mathAttachment && (
                    <div className="mt-1.5 sm:mt-2 text-xs text-gray-400 text-center">
                        {inputMode === 'text' ?
                            "Tekan Enter untuk kirim, Shift+Enter untuk baris baru" :
                            "Gunakan sintaks LaTeX untuk ekspresi matematika"}
                    </div>
                )}
            </div>
        </div>
    )
}


import { cn } from "@/lib/utils"
import { FC } from "react"
interface IMathAttachmentProps {
    onRemove: () => void;
    onClick: () => void;
    content: string;
};

export const MathAttachment: FC<IMathAttachmentProps> = (props) => {
    return (
        <div
            onClick={props.onClick}
            className={cn(
                "relative group bg-zinc-700 border w-fit border-zinc-600 rounded-lg size-[125px] shadow-md flex-shrink-0 overflow-hidden p-3",
            )}
        >
            <div className="flex items-start gap-3 size-[125px] overflow-hidden">


                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                        <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
                            <p className="absolute bottom-2 left-2 capitalize text-white text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md">
                                Math
                            </p>
                        </div>
                    </div>

                    <p
                        className="max-w-[90%] text-xs font-medium text-zinc-100 truncate"
                        title={"Math Attachment"}
                    >
                        Math Attachment
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                        {props.content}
                    </p>
                </div>

            </div>
            <Button
                size="icon"
                variant="outline"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={props.onRemove}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
