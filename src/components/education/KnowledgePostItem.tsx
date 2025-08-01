
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
        <Card className="bg-background/50 hover:bg-background/80 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-x-4 gap-y-2 p-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={post.avatarUrl} alt={post.authorName} data-ai-hint={post.avatarHint} />
                        <AvatarFallback>{post.authorName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow overflow-hidden min-w-0">
                        <p className="font-semibold truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            por {post.authorName} • {timeAgo}
                        </p>
                    </div>
                </div>
                 <Button variant="outline" size="sm" asChild className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <Link href={`/post/${post.id}`}>
                        Ver Publicación <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </Card>
    )

}
