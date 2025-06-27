"use client"
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { optimisticallySendMessage, toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { useMutation, useQuery } from "convex/react";
import { Lightbulb } from "lucide-react";
import { useEffect } from "react";
import { Message } from "./message";

const sampleMessages = [
    {
        id: 1,
        type: "user" as const,
        content: `2. Coba modifikasi parameter seperti batch size dan jumlah epoch
3. Evaluasi performa model pada data testing

Apakah kamu ingin mencoba menjalankan kode ini atau memahami konsep CNN lebih dalam terlebih dahulu?`,
    },
    {
        id: 2,
        type: "ai" as const,
        content: (
            <div>
                <div className="flex items-center gap-2 mb-3 text-teal-600">
                    <Lightbulb className="h-5 w-5" />
                    <span className="font-medium">Want to learn more?</span>
                </div>
                <p className="mb-4">
                    Saya ingin memahami konsep CNN lebih dalam sebelum menjalankan kode. Bisakah dijelaskan lebih lanjut tentang
                    cara kerja Convolutional Layer dan Pooling Layer?
                </p>
            </div>
        ),
        showActions: true,
    },
    {
        id: 3,
        type: "user" as const,
        content:
            "Saya ingin mencoba menjalankan kode yang diberikan. Bagaimana cara saya mendapatkan dataset CIFAR-10 dan apa yang harus saya persiapkan sebelum menjalankan kode tersebut?",
    },
    {
        id: 4,
        type: "user" as const,
        content:
            "Saya ingin memodifikasi parameter seperti batch size dan jumlah epoch. Bagaimana pengaruh perubahan parameter tersebut terhadap performa model?",
    },
]

interface IMessageAreaProps {
    threadId: string
}

export const MessagesArea: React.FC<IMessageAreaProps> = ({ threadId }) => {
    const messages = useThreadMessages(
        api.chat.queries.listThreadMessages,
        { threadId },
        { initialNumItems: 10, stream: true },
    );


    const sendMessage = useMutation(
        api.chat.mutations.streamChatAsynchronously,
    ).withOptimisticUpdate(
        optimisticallySendMessage(api.chat.queries.listThreadMessages),
    );

    const roomDetails = useQuery(api.chat.queries.roomDetails, { threadId })

    useEffect(() => {
        if (roomDetails && messages.results?.length === 0) {
            void sendMessage({ threadId, prompt: roomDetails.title });
        }
    }, [roomDetails])

    return (
        <ScrollArea className="h-[calc(100vh-1rem-8rem-6rem)] w-full">
            <div className="w-full px-4 py-6">
                {toUIMessages(messages.results ?? []).map((m) => (
                    <Message  {...m} key={m.key} />
                ))}
            </div>
        </ScrollArea>
    )
}
