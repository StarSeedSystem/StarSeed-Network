
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Repeat, Heart, Share, SendHorizonal, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { PollData } from "../publish/PollBlock";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { CommentSection } from "../politics/CommentSection";
import { VotingSystem } from "../politics/VotingSystem";

export interface FeedPostType {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  avatarHint: string;
  title: string;
  content: string;
  comments: number;
  reposts: number;
  likes: number;
  destinations?: { id: string; name: string; type: string }[];
  blocks?: any[];
  createdAt?: { seconds: number, nanoseconds: number };
}

export function FeedPost({ post: initialPost }: { post: FeedPostType }) {
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleLike = () => {
    setPost(prev => ({
        ...prev,
        likes: isLiked ? prev.likes -1 : prev.likes + 1
    }));
    setIsLiked(!isLiked);
  };

  const handleRepost = () => {
    setPost(prev => ({
        ...prev,
        reposts: isReposted ? prev.reposts - 1 : prev.reposts + 1
    }));
    setIsReposted(!isReposted);
  };
  
  const handleVote = (blockIndex: number, optionIndex: number) => {
      if (!user) return toast({ variant: "destructive", title: "Necesitas iniciar sesión para votar." });
      
      const newBlocks = [...post.blocks!];
      const pollBlock = newBlocks[blockIndex] as PollData;

      if (pollBlock.userVote !== undefined) {
          return toast({ variant: "destructive", title: "Ya has votado en esta encuesta." });
      }

      pollBlock.options[optionIndex].votes = (pollBlock.options[optionIndex].votes || 0) + 1;
      pollBlock.userVote = optionIndex; 

      setPost(prev => ({ ...prev, blocks: newBlocks }));
      toast({ title: "¡Voto registrado!"});
  }
  
  const handleAddOptionFromComment = (blockIndex: number, newOptionText: string) => {
    if (!user) return toast({ variant: "destructive", title: "Necesitas iniciar sesión para proponer una opción." });

    const newBlocks = [...post.blocks!];
    const pollBlock = newBlocks[blockIndex] as PollData;
    
    pollBlock.options.push({
        text: newOptionText,
        votes: 1, 
        proposer: { name: user.displayName || 'Anonymous', uid: user.uid },
    });
    
    setPost(prev => ({ ...prev, blocks: newBlocks }));
    toast({ title: "Opción propuesta y añadida a la votación."});
  };

  const timeAgo = post.createdAt?.seconds 
    ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true, locale: es })
    : "ahora";

  const pollBlockData = post.blocks?.find(b => b.type === 'poll') as PollData | undefined;

  return (
    <Card className="glass-card rounded-2xl overflow-hidden flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.avatar} alt={post.author} data-ai-hint={post.avatarHint} />
            <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-bold">{post.author}</p>
            <div className="flex items-center text-sm text-muted-foreground">
                <span>@{post.handle}</span>
                <Dot />
                <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <h3 className="text-xl font-headline font-semibold">{post.title}</h3>
        <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>
        
        {pollBlockData && (
          <VotingSystem 
            poll={pollBlockData} 
            onVote={(optionIndex) => handleVote(post.blocks!.findIndex(b => b.type === 'poll'), optionIndex)} 
          />
        )}

      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {post.destinations && post.destinations.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <SendHorizonal className="h-3 w-3" />
                <span>Publicado en:</span>
                {post.destinations.map(dest => {
                    const destName = typeof dest === 'string' ? dest : dest.name;
                    const destId = typeof dest === 'string' ? destName : dest.id || destName;
                    return <Badge variant="secondary" key={destId} className="font-normal">{destName}</Badge>
                })}
            </div>
        )}
        <div className="flex justify-between w-full">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary" onClick={() => setShowComments(!showComments)}>
                <MessageSquare className="h-4 w-4" /> {post.comments}
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                className={cn("flex items-center gap-2 text-muted-foreground hover:text-sea-green", isReposted && "text-sea-green")}
                onClick={handleRepost}
            >
                <Repeat className="h-4 w-4" /> {post.reposts}
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                className={cn("flex items-center gap-2 text-muted-foreground hover:text-accent", isLiked && "text-accent")}
                onClick={handleLike}
            >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} /> {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-sky-blue">
                <Share className="h-4 w-4" />
            </Button>
        </div>
         {showComments && (
            <div className="w-full pt-4 mt-4 border-t border-white/10">
                <CommentSection 
                    postId={post.id}
                    onCommentPosted={() => setPost(prev => ({...prev, comments: prev.comments + 1}))}
                    onOptionProposed={(newOptionText) => handleAddOptionFromComment(post.blocks!.findIndex(b => b.type === 'poll'), newOptionText)}
                    isPoll={!!pollBlockData}
                />
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
