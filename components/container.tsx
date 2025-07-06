import { cn } from "@/lib/utils"



export const Container: React.FC<React.ComponentProps<"div">> = ({ children, className, ...props }) => {
    return (
        <div className={cn("min-h-[calc(100vh-1rem)] m-2 rounded-lg border shadow-sm", className)} {...props}>
            {children}
        </div>
    )
}