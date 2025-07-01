import { cn } from "@/lib/utils"

interface IContainerProps extends React.ComponentProps<"div"> { }

export const Container: React.FC<IContainerProps> = ({ children, className, ...props }) => {
    return (
        <div className={cn("min-h-[calc(100vh-1rem)] m-2 rounded-lg border shadow-sm", className)} {...props}>
            {children}
        </div>
    )
}