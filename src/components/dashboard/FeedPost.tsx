
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Repeat, Heart, Share, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";

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
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

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

  const handleAddComment = () => {
      if (newComment.trim()) {
        setComments(comments + 1);
        setNewComment("");
        // In a real app, you would add the comment to a list of comments
      }
  }

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
        <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>
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
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary" onClick={() => setShowComments(!showComments)}>
                <MessageSquare className="h-4 w-4" /> {comments}
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
         {showComments && (
            <div className="w-full pt-4 mt-4 border-t border-white/10 space-y-4">
                 {/* This would be a list of actual comments */}
                <div className="flex gap-3">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="glowing astronaut" />
                        <AvatarFallback>SN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea 
                            placeholder="Escribe tu respuesta..." 
                            className="bg-background/50 text-sm"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                                Responder
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
