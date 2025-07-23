
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Repeat, Heart, Share, SendHorizonal, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { PollData, PollOption } from "../publish/PollBlock";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { CommentSection } from "../politics/CommentSection";
import { VotingSystem } from "../politics/VotingSystem";
import { doc, runTransaction, arrayUnion, updateDoc, increment, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Skeleton } from "../ui/skeleton";

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

function FeedPostSkeleton() {
    return (
        <Card className="glass-card rounded-2xl overflow-hidden">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-8 w-full" />
            </CardFooter>
        </Card>
    )
}

export function FeedPost({ post: initialPost }: { post: FeedPostType }) {
  const [post, setPost] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (!initialPost.id) {
        setIsLoading(false);
        setPost(initialPost);
        return;
    };
    
    setIsLoading(true);
    const postRef = doc(db, "posts", initialPost.id);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const data = { id: doc.id, ...doc.data() };
        setPost(data);
        if (user && data.likers) {
          setIsLiked(data.likers.includes(user.uid));
        }
      } else {
        setPost(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching post in real-time:", error);
        setPost(initialPost); // Fallback to initial data on error
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [initialPost, user]);


  const handleLike = async () => {
    if (!user || !post) return toast({ variant: "destructive", title: "Necesitas iniciar sesión." });
    
    const postRef = doc(db, "posts", post.id);
    
    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) throw "Post not found";

        const likers = postDoc.data().likers || [];
        const alreadyLiked = likers.includes(user.uid);
        
        let newLikers;
        let newLikes;

        if (alreadyLiked) {
          newLikers = likers.filter((uid: string) => uid !== user.uid);
          newLikes = increment(-1);
        } else {
          newLikers = [...likers, user.uid];
          newLikes = increment(1);
        }

        transaction.update(postRef, {
          likes: newLikes,
          likers: newLikers
        });
      });
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({ variant: "destructive", title: "Error al dar Me Gusta" });
    }
  };

  const handleVote = async (optionIndex: number) => {
    if (!user || !post) return toast({ variant: "destructive", title: "Necesitas iniciar sesión para votar." });

    const postRef = doc(db, "posts", post.id);

    try {
        await runTransaction(db, async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists()) throw "Post not found";

            const data = postDoc.data();
            const blocks = [...(data.blocks || [])];
            const pollIndex = blocks.findIndex(b => b.type === 'poll');
            if (pollIndex === -1) throw "Poll not found in post";

            const pollData: PollData = blocks[pollIndex];
            if (pollData.voters && pollData.voters[user.uid]) {
                toast({ variant: "destructive", title: "Ya has votado en esta propuesta." });
                return; // Exit transaction early
            }
            
            const selectedOption = pollData.options[optionIndex];
            if (!selectedOption) throw "Invalid option selected";

            // Update vote count
            pollData.options[optionIndex].votes = (pollData.options[optionIndex].votes || 0) + 1;
            
            // Record user's vote
            if (!pollData.voters) {
                pollData.voters = {};
            }
            pollData.voters[user.uid] = selectedOption.text;

            blocks[pollIndex] = pollData;

            transaction.update(postRef, { blocks: blocks });
        });

        toast({ title: "¡Voto registrado!", description: "Tu voto ha sido contabilizado." });

    } catch (error: any) {
        if (error.message && !error.message.includes("Ya has votado")) {
            console.error("Error al registrar el voto:", error);
            toast({ variant: "destructive", title: "Error al Votar", description: error.message });
        }
    }
  }

  const handleRepost = async () => {
    toast({ title: "Función no implementada todavía." });
  };
  
  if (isLoading) return <FeedPostSkeleton />;
  if (!post) return null;

  const timeAgo = post.createdAt?.seconds 
    ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true, locale: es })
    : "ahora";

  const pollBlockData = post.blocks?.find((b: any) => b.type === 'poll') as PollData | undefined;

  return (
    <Card className="glass-card rounded-2xl overflow-hidden flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.avatarUrl} alt={post.authorName} data-ai-hint={post.avatarHint} />
            <AvatarFallback>{post.authorName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-bold">{post.authorName}</p>
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
            postId={post.id}
            onVote={handleVote}
          />
        )}

      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {post.destinations && post.destinations.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <SendHorizonal className="h-3 w-3" />
                <span>Publicado en:</span>
                {post.destinations.map((dest: any) => {
                    return <Badge variant="secondary" key={dest.id} className="font-normal">{dest.name}</Badge>
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
                    isPoll={!!pollBlockData}
                />
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
