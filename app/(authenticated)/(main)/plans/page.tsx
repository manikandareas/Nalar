"use client"
import { Container } from "@/components/container"
import { MainContent } from "@/components/main-content"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LearningPlan } from "@/features/learning-plan/learning-plan"

/**
 * Page to display the user's learning plan.
 */
export default function LearningPlansPage() {
    return (
        <Container>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
            </header>
            <MainContent className="max-w-4xl w-full mx-auto">
                <LearningPlan />
            </MainContent>
        </Container>
    )
}
