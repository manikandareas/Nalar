"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FolderPen } from "lucide-react"
import { QuizHistorySheet } from "../quiz/quiz-history-sheet"
import { useChat } from "./hooks/use-chat"

/**
 * Props for the ChatHeader component
 */
interface ChatHeaderProps {
    title?: string;
    threadId: string
}

/**
 * Header component for the chat interface
 */
export function ChatHeader({ title, threadId }: ChatHeaderProps) {

    // Get room details if we have a conversation ID
    const { roomDetails } = threadId ? useChat(threadId) : { roomDetails: null };

    // Use provided title or room details title or default
    const chatTitle = title || (roomDetails?.title) || "New Conversation";
    return (
        <header className="flex h-16 shrink-0 items-center bg-background justify-between px-4 sticky top-0 z-50">
            <div className="flex items-center space-x-2">
                <SidebarTrigger className="-ml-1" />
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50">
                    <span className="font-medium truncate max-w-[200px]">{chatTitle}</span>
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <QuizHistorySheet threadId={threadId}>
                    <Button variant="ghost" size="sm" className="hidden md:flex text-gray-600">
                        <FolderPen className="h-4 w-4 mr-2" />
                        Quiz
                    </Button>
                </QuizHistorySheet>
            </div>
        </header>
    )
}
