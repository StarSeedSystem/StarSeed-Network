
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Repeat, Heart, Share, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export interface FeedPostType {
  author: string;
  handle: string;
  avatar: string;
  avatarHint: string;
  content: string;
  comments: number;
  reposts: number;
  likes: number;
  destinations?: string[];
}

export function FeedPost({ post }: { post: FeedPostType }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [reposts, setReposts] = useState(post.reposts);
  const [isReposted, setIsReposted] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleRepost = () => {
    if (isReposted) {
      setReposts(reposts - 1);
    } else {
      setReposts(reposts + 1);
    }
    setIsReposted(!isReposted);
  };

  return (
    <Card className="glass-card rounded-2xl overflow-hidden flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.avatar} alt={post.author} data-ai-hint={post.avatarHint} />
            <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{post.author}</p>
            <p className="text-sm text-muted-foreground">@{post.handle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/90">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {post.destinations && post.destinations.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <SendHorizonal className="h-3 w-3" />
                <span>Publicado en:</span>
                {post.destinations.map(dest => <Badge variant="secondary" key={dest} className="font-normal">{dest}</Badge>)}
            </div>
        )}
        <div className="flex justify-between w-full">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <MessageSquare className="h-4 w-4" /> {post.comments}
            </Button>
            <Button 
            variant="ghost" 
            size="sm" 
            className={cn("flex items-center gap-2 text-muted-foreground hover:text-sea-green", isReposted && "text-sea-green")}
            onClick={handleRepost}
            >
            <Repeat className="h-4 w-4" /> {reposts}
            </Button>
            <Button 
            variant="ghost" 
            size="sm" 
            className={cn("flex items-center gap-2 text-muted-foreground hover:text-accent", isLiked && "text-accent")}
            onClick={handleLike}
            >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} /> {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-sky-blue">
            <Share className="h-4 w-4" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
