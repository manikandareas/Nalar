"use client"

import { Button, buttonVariants } from "@/components/ui/button"
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
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { BookOpen, ChevronDown, FilePen, FolderSearch, MoreVertical, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { NavUser } from "./nav-user"

const navigationItems = [
    { title: "Search", icon: FolderSearch, url: "#" },
    { title: "Your Plans", icon: BookOpen, url: "/plans" },
    { title: "Your Quizzes", icon: FilePen, url: "/quizzes" },
]

export function AppSidebar() {
    const { conversationId } = useParams()
    const currentUser = useQuery(api.users.queries.getCurrentUser, {})
    const userRooms = useQuery(api.chat.queries.userRooms, {})
    const removeConversation = useMutation(api.chat.mutations.remove)

    const handleRemove = (threadId: string) => {
        removeConversation({ threadId })
    }


    return (
        <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2 py-2">
                    <h2 className="text-lg font-semibold text-foreground">Hi, {currentUser?.username}</h2>
                    <Link className={buttonVariants({ size: "icon", variant: "ghost" })} href="/rooms">
                        <Plus className="size-5" />
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild variant="ghost">
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
                            <CollapsibleTrigger className="flex w-full items-center space-x-2">
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                <span className="font-medium">Rooms</span>
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu className="mt-2 space-y-1">
                                    {userRooms?.filter(r => !!r.title.trim()).map(r => (
                                        <SidebarMenuItem key={r.threadId} className="group/room flex items-center justify-between rounded-md pr-2">
                                            <Link
                                                href={`/rooms/${r.threadId}`}
                                                className={cn(
                                                    buttonVariants({
                                                        variant: conversationId === r.threadId ? "secondary" : "ghost",
                                                        size: 'sm'
                                                    }),
                                                    "flex-1 justify-start truncate"
                                                )}
                                            >
                                                <span className="line-clamp-1 capitalize">{r.title.toLowerCase()}</span>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="ml-auto h-7 w-7 shrink-0 opacity-0 group-hover/room:opacity-100">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem asChild>
                                                        <Button className="w-full" variant="destructive" size={"sm"} onClick={() => handleRemove(r.threadId)}>
                                                            <Trash className="size-4 mr-2" />
                                                            Delete
                                                        </Button>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={currentUser as Doc<"users">} />
            </SidebarFooter>
        </Sidebar>
    )
}
