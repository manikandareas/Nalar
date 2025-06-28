import { Container } from "@/components/container"
import { MainContent } from "@/components/main-content"
import { ChatHeader } from "@/features/chat/chat-header"
import { ChatInput } from "@/features/chat/chat-input"
import { MessagesArea } from "@/features/chat/message-area"

interface IConversationPageProps {
    params: Promise<{
        conversationId: string
    }>
}

const ConversationPage: React.FC<IConversationPageProps> = async (props) => {
    const { conversationId } = await props.params
    return (
        <Container className="min-h-[calc(100vh-1rem)] relative">
            <ChatHeader />
            <MainContent className="max-w-4xl relative">
                <MessagesArea threadId={conversationId} />
                <ChatInput threadId={conversationId} />
            </MainContent>
        </Container>
    )
}

export default ConversationPage