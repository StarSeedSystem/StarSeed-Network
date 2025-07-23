
"use client";

import { FeedPostType } from "../dashboard/FeedPost";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


export function KnowledgePostItem({ post }: { post: FeedPostType }) {
    
    const timeAgo = post.createdAt?.seconds 
    ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true, locale: es })
    : "ahora";

    return (
        <Card className="p-3 flex items-center gap-4 bg-background/50">
            <Avatar className="h-10 w-10">
                <AvatarImage src={post.avatarUrl} alt={post.authorName} data-ai-hint={post.avatarHint} />
                <AvatarFallback>{post.authorName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                    por {post.authorName} • {timeAgo}
                </p>
            </div>
             <Button variant="outline" size="sm" asChild>
                <Link href={`/publish/${post.id}`}>
                    Ver Publicación <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
            </Button>
        </Card>
    )

}

    