"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { BookOpen, ChevronDown, FileText, Plus, Search, Video } from "lucide-react"
import Link from "next/link"

const navigationItems = [
    {
        title: "Search",
        icon: Search,
        url: "#",
    },
    {
        title: "Your Library",
        icon: BookOpen,
        url: "#",
    },
    {
        title: "Video Vault",
        icon: Video,
        url: "#",
    },
    {
        title: "Read Articles",
        icon: FileText,
        url: "#",
    },
]

export function AppSidebar() {
    const currentUser = useQuery(api.users.queries.getCurrentUser, {})
    const userRooms = useQuery(api.chat.queries.userRooms, {})

    return (
        <Sidebar className="border-none">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2 py-2">
                    <h2 className="text-lg font-medium text-gray-900">Hi, {currentUser?.username}</h2>
                    <Link className={buttonVariants({ size: "icon", variant: "ghost" })} href="/rooms">
                        <Plus className="size-5" />
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-secondary">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className="flex items-center space-x-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex items-center space-x-2 w-full">
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                <span>Rooms</span>
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {
                                        userRooms?.filter(r => !!r.title.trim()).map(r => (
                                            <SidebarMenuItem key={r.threadId}>
                                                <SidebarMenuButton asChild className="ml-6">
                                                    <Link href={`/rooms/${r.threadId}`} className="text-gray-500 ">
                                                        <span className="line-clamp-1">{r.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))
                                    }
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>


            </SidebarContent>

            <SidebarFooter className="bg-secondary border mb-4 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <Avatar className="h-8 w-8 bg-purple-500">
                                        <AvatarFallback className="text-white text-sm font-medium">V</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium">Vito</span>
                                        <span className="text-xs text-gray-500">Free</span>
                                    </div>
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Account Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Upgrade Plan</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
