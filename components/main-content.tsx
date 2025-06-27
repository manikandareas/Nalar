import { cn } from "@/lib/utils"

interface IMainContentProps extends React.ComponentProps<"main"> { }

export const MainContent: React.FC<IMainContentProps> = ({ children, className, ...props }) => {
    return (
        <main className={cn("p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto", className)} {...props}>
            {children}
        </main>
    )
}