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
        <Container className="flex flex-col h-[calc(100vh-1rem)]">
            <ChatHeader />
            <MainContent className="max-w-4xl w-full mx-auto flex-1 overflow-y-auto px-4">
                <MessagesArea threadId={conversationId} />
            </MainContent>
            <div className="max-w-4xl w-full mx-auto">
                <ChatInput threadId={conversationId} />
            </div>
        </Container>
    )
}

export default ConversationPage