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
import { useState } from "react"
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

    return (
        <Container className="relative overflow-hidden h-[calc(100vh-16px)]">
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
            </header>
            <MainContent>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center font-bold mb-2 text-3xl text-primary">
                            <span className="bg-primary/10 text-primary p-2 rounded-lg flex items-center justify-center aspect-square">
                                N
                            </span>
                            <span className="ml-3">Nalar</span>
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
            </MainContent>
            <Image
                src="/assets/Waiting.svg"
                alt="Waiting"
                width={400}
                height={400}
                className="mx-auto absolute bottom-0 left-1/2 -translate-x-1/2 z-0 translate-y-1/5"
            />
        </Container>
    )
}
