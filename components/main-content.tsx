import { cn } from "@/lib/utils"

export const MainContent: React.FC<React.ComponentProps<"main">> = ({ children, className, ...props }) => {
    return (
        <main className={cn("p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto", className)} {...props}>
            {children}
        </main>
    )
}