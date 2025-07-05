"use client"
import { Container } from "@/components/container"
import { MainContent } from "@/components/main-content"
import { SidebarTrigger } from "@/components/ui/sidebar"

/**
 * Home page component with chat creation functionality
 */
export default function LearningPlansPage() {
    return (
        <Container>
            {/* Top Navigation */}
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
            </header>
            {/* Main Dashboard */}
            <MainContent>
            </MainContent>
        </Container>
    )
}
