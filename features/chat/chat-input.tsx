"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { optimisticallySendMessage } from "@convex-dev/agent/react"
import { useMutation } from "convex/react"
import { SendHorizonal } from "lucide-react"
import { useState } from "react"

interface IChatInputProps {
    threadId: string
}
export const ChatInput: React.FC<IChatInputProps> = ({ threadId }) => {
    const [message, setMessage] = useState("")

    const sendMessage = useMutation(
        api.chat.mutations.streamChatAsynchronously,
    ).withOptimisticUpdate(
        optimisticallySendMessage(api.chat.queries.listThreadMessages),
    );


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            void sendMessage({ threadId, prompt: message }).catch(() => setMessage(message));
            console.log("Sending message:", message)
            setMessage("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="relative">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Teach me about..."
                        className="min-h-[60px] max-h-[200px] pr-12 resize-none border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        rows={1}
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="absolute right-2 bottom-2 h-8 w-8 p-0"
                        disabled={!message.trim()}
                    >
                        <SendHorizonal className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
