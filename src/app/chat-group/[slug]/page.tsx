
// src/app/chat-group/[slug]/page.tsx
import { ChatGroupPage } from "@/components/groups/ChatGroupPage";

interface ChatGroupPublicPageProps {
  params: {
    slug: string;
  };
}

export default function ChatGroupPublicPage({ params }: ChatGroupPublicPageProps) {
    return <ChatGroupPage slug={params.slug} />;
}
