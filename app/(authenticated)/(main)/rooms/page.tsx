"use client"
import { Container } from "@/components/container"
import { MainContent } from "@/components/main-content"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { api } from "@/convex/_generated/api"
import { MathAttachment } from "@/features/chat/chat-input"
import { useCreateThread } from "@/features/chat/hooks/use-create-thread"
import { MathInput } from "@/features/chat/math-input"
import { useQuery } from "convex/react"
import { Calculator, Loader2, SendHorizonal, Type } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
type InputMode = 'text' | 'math';

/**
 * Home page component with chat creation functionality
 */
export default function HomePage() {
    const [prompt, setPrompt] = useState("")
    const [mathAttachment, setMathAttachment] = useState<string | null>(null);
    const [inputMode, setInputMode] = useState<InputMode>('text');
    const router = useRouter()
    const { createThread, isLoading } = useCreateThread();
    const currentUser = useQuery(api.users.queries.getCurrentUser);

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalMessage = prompt.trim() +
            (mathAttachment ? `
            $$${mathAttachment}$$` : '');

        if (!finalMessage) return;

        try {
            const newId = await createThread(finalMessage);
            if (newId) {
                setPrompt("");
                setMathAttachment(null);
                setInputMode('text');
                router.push(`/rooms/${newId}`)
            }
        } catch (err) {
            // Keep the prompt if there was an error
            console.error("Failed to create thread:", err);
        }
    }

    const handlePromptTemplateClick = (prompt: string) => {
        setPrompt(prompt);
    }

    return (
        <Container className="relative overflow-hidden h-[calc(100vh-16px)]">
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
            </header>
            <MainContent>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 space-y-4" >
                        <div className="flex items-center gap-2 justify-center ">
                            <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                            <h1 className="text-base font-bold md:text-3xl">Nalar</h1>
                        </div>
                        <p className="text-lg text-muted-foreground">
                            Hello, {currentUser?.username || "friend"}. What shall we explore today?
                        </p>
                    </div>
                    <div className="mb-6  z-50 sm:mb-8 w-full mx-auto border-t border-gray-200 rounded-2xl bg-zinc-500/5 backdrop-blur-sm p-2 sm:p-4 shadow-md relative">
                        <form onSubmit={handleCreateThread} className="relative space-y-4">
                            {inputMode === 'text' ? (
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="What do you want to learn about?"
                                    className="w-full p-4 pr-28 text-base rounded-lg border-2 bg-background/80 focus:border-primary"
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
                                    />
                                </div>
                            )}

                            {mathAttachment && (
                                <MathAttachment
                                    content={mathAttachment}
                                    onRemove={() => setMathAttachment(null)}
                                    onClick={() => setInputMode('math')}
                                />
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
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
                                    disabled={(!prompt.trim() && !mathAttachment) || isLoading}
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
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-2xl mx-auto z-50">
                    {
                        !mathAttachment && promptTemplateOptions.map(p => <PromptTemplate key={p.label} label={p.label} onClick={() => handlePromptTemplateClick(p.prompt)} />)
                    }
                </div>
            </MainContent>
            <Image
                src="/assets/Growth.svg"
                alt="Growth"
                width={350}
                height={350}
                className="mx-auto absolute bottom-0 right-0 scale-x-[-1] translate-x-1/5 z-0 hidden lg:block"
            />
        </Container>
    )
}

const promptTemplateOptions = [
    {
        label: "What is an integral?",
        prompt: "Explain the concept of an integral in calculus with a simple example."
    },
    {
        label: "How does photosynthesis work?",
        prompt: "Describe the process of photosynthesis in plants."
    },
    {
        label: "What is Newton's Second Law?",
        prompt: "State and explain Newton's Second Law of Motion with an example."
    },
    {
        label: "What are the states of matter?",
        prompt: "List and describe the different states of matter."
    },
    {
        label: "Explain Pythagoras' Theorem",
        prompt: "What is Pythagoras' Theorem and how is it used in geometry?"
    }
]

interface IPrompTemplateProps {
    label: string
    onClick: () => void
}

const PromptTemplate: React.FC<IPrompTemplateProps> = (props) => {
    return (
        <Button onClick={props.onClick} variant={"secondary"} className="rounded-full px-4 py-2 text-sm">
            {props.label}
        </Button>
    )
}