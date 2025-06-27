import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, ExternalLink, Share } from "lucide-react"

export function ChatHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50">
                            <span className="font-medium">Deep Learning Basics</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem>Deep Learning Basics</DropdownMenuItem>
                        <DropdownMenuItem>Machine Learning Fundamentals</DropdownMenuItem>
                        <DropdownMenuItem>Neural Networks</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hidden sm:flex">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Tools
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                </Button>
                <div className="relative">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center p-0">
                        1
                    </Badge>
                </div>
            </div>
        </header>
    )
}
