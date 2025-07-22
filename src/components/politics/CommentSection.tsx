
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Comment {
    id: string;
    author: { name: string; avatar: string; avatarHint: string; };
    content: string;
    timestamp: any;
    likes: number;
    dislikes: number;
}

interface CommentSectionProps {
    proposalId: string;
}

export function CommentSection({ proposalId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const { user } = useUser();
    const { toast } = useToast();

    useEffect(() => {
        const commentsRef = collection(db, "proposals", proposalId, "comments");
        const q = query(commentsRef, orderBy("timestamp", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
            setComments(commentsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [proposalId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) {
            toast({ title: "Debes iniciar sesión y escribir un comentario.", variant: "destructive" });
            return;
        }

        setIsPosting(true);
        const commentsRef = collection(db, "proposals", proposalId, "comments");

        try {
            await addDoc(commentsRef, {
                author: { 
                    name: user.displayName || "Anonymous", 
                    avatar: user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`, 
                    avatarHint: "user avatar" 
                },
                content: newComment,
                timestamp: serverTimestamp(),
                likes: 0,
                dislikes: 0,
            });
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast({ title: "Error al publicar comentario", variant: "destructive" });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="glass-card rounded-2xl">
            <CardHeader>
                <CardTitle>Debate y Comentarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} data-ai-hint="glowing astronaut" />
                        <AvatarFallback>{user?.displayName?.substring(0,2) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea 
                            placeholder="Aporta tu perspectiva al debate..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="text-base"
                            disabled={!user || isPosting}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleAddComment} disabled={!newComment.trim() || !user || isPosting}>
                                {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publicar Comentario
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="bg-white/10" />

                {isLoading ? (
                    <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map(comment => (
                            <div key={comment.id} className="flex gap-4">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} data-ai-hint={comment.author.avatarHint} />
                                    <AvatarFallback>{comment.author.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{comment.author.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {comment.timestamp?.toDate ? comment.timestamp.toDate().toLocaleDateString() : 'Just now'}
                                        </p>
                                    </div>
                                    <p className="text-foreground/90 mt-1">{comment.content}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-sea-green">
                                            <ThumbsUp className="h-4 w-4" /> {comment.likes}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-coral">
                                            <ThumbsDown className="h-4 w-4" /> {comment.dislikes}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground">Responder</Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-center py-4">Sé el primero en comentar.</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
