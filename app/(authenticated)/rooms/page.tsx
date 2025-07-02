"use client"
import { Container } from "@/components/container"
import { MainContent } from "@/components/main-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { api } from "@/convex/_generated/api"
import { useCreateThread } from "@/features/chat/hooks/use-create-thread"
import { LearningPlan } from "@/features/learning-plan/learning-plan"
import { QuizHistorySheet } from "@/features/quiz/quiz-history-sheet"
import { useQuery } from "convex/react"
import { Brain, Flame, Loader2, SendHorizonal, Target, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

/**
 * Home page component with chat creation functionality
 */
export default function HomePage() {
    const [prompt, setPrompt] = useState("")
    const router = useRouter()
    const { createThread, isLoading, error } = useCreateThread();
    const currentUser = useQuery(api.users.queries.getCurrentUser);

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault()
        if (prompt.trim() === "") return;

        try {
            const newId = await createThread(prompt);
            if (newId) {
                router.push(`/rooms/${newId}`)
            }
        } catch (err) {
            // Keep the prompt if there was an error
            console.error("Failed to create thread:", err);
        }
    }

    return (<>
        <Container>
            {/* Top Navigation */}
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center space-x-2 ml-auto">
                    <QuizHistorySheet>
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            <Brain className="h-4 w-4 mr-2" />
                            Quiz
                        </Button>
                    </QuizHistorySheet>
                </div>
            </header>

            {/* Main Dashboard */}
            <MainContent>
                <div className="max-w-6xl mx-auto">
                    {/* Header with Paper Plane Icon */}
                    <div className="text-center mb-6 sm:mb-8">
                        <Image className="inline-flex items-center justify-center  mb-4" src={"/logo.png"} alt="Logo" width={120} height={120} />
                        {/* <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary/10 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div> */}

                        <h1 className="text-2xl sm:text-3xl font-medium mb-4 font-mono sm:mb-6 px-4">
                            Time to expand your knowledge! {currentUser?.username}
                        </h1>
                    </div>

                    {/* Search Input */}
                    <div className="mb-6 sm:mb-8 w-full mx-auto">
                        <form onSubmit={handleCreateThread} className="relative">
                            <Input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask anything..."
                                className="w-full h-12 pl-4 pr-12 text-base bg-muted border-border rounded-lg"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground"
                                disabled={isLoading}
                                type="submit"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal />}
                            </Button>
                        </form>
                    </div>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Streak Card */}
                        <Card className="p-4 sm:p-6 bg-card border-border">
                            <CardContent className="p-0">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">STREAK</span>
                                </div>
                                <div className="text-2xl font-bold mb-1">1 days</div>
                                <div className="text-sm text-muted-foreground">Great start!</div>
                            </CardContent>
                        </Card>

                        {/* Progress Card - Highlighted */}
                        <Card className="p-4 sm:p-6 bg-primary/10 border-primary/20">
                            <CardContent className="p-0">
                                <div className="flex items-center space-x-3 mb-3">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">PROGRESS</span>
                                </div>
                                <div className="text-2xl font-bold mb-1">+0.12%</div>
                                <div className="text-sm text-muted-foreground">2 study sessions</div>
                                <div className="text-sm text-muted-foreground">this week</div>
                            </CardContent>
                        </Card>

                        {/* Practice Card */}
                        <Card className="p-4 sm:p-6 bg-card border-border sm:col-span-2 lg:col-span-1">
                            <CardContent className="p-0">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Brain className="h-5 w-5 text-purple-500" />
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">PRACTICE</span>
                                </div>
                                <div className="text-2xl font-bold mb-1">0 / 0</div>
                                <div className="text-sm text-muted-foreground">No problems yet</div>
                            </CardContent>
                        </Card>

                        {/* Learning Goals Card */}
                        <Card className="p-4 sm:p-6 bg-card border-border sm:col-span-2 lg:col-span-2">
                            <CardContent className="p-0">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Target className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">LEARNING GOALS</span>
                                </div>
                                <div className="text-lg font-semibold mb-1">Mathematics</div>
                                <div className="text-sm text-muted-foreground">Tailored to your intermediate level</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <LearningPlan />
                    </div>
                </div>
            </MainContent>
        </Container>
    </>
    )
}
