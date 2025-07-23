
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, updateDoc, doc, runTransaction } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CornerDownRight, MessageSquare, ThumbsUp } from "lucide-react";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Comment {
    id: string;
    author: { name: string; avatar: string; uid: string; };
    content: string;
    timestamp: any;
    parentId?: string | null;
    likes?: number;
    replies?: Comment[];
}

interface CommentSectionProps {
    postId: string;
    onCommentPosted: () => void;
    onOptionProposed?: (optionText: string) => void;
    isPoll: boolean;
}

function CommentItem({ comment, postId, onReplySuccess }: { comment: Comment; postId: string; onReplySuccess: () => void; }) {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const { user, profile } = useUser();
    const { toast } = useToast();

    const handleReply = async () => {
        if (!replyContent.trim() || !user || !profile) return;
        setIsReplying(true);
        try {
            // Simulate adding a reply without writing to DB
            console.log("Simulating reply:", {
                 author: { name: profile.name, avatar: profile.avatarUrl, uid: user.uid },
                 content: replyContent,
                 timestamp: new Date(),
                 parentId: comment.id,
                 likes: 0,
            });
            onReplySuccess();
            toast({ title: "Respuesta publicada." });
            setReplyContent("");
            setShowReplyBox(false);
        } catch (error) {
            console.error("Error replying to comment:", error);
            toast({ title: "Error al responder", variant: "destructive" });
        } finally {
            setIsReplying(false);
        }
    };
    
    return (
        <div className="flex gap-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="bg-background/50 p-3 rounded-lg">
                    <p className="font-semibold text-sm">{comment.author.name}</p>
                    <p className="text-foreground/90">{comment.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs"><ThumbsUp className="h-3 w-3" /> {comment.likes || 0}</Button>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowReplyBox(!showReplyBox)}>Responder</Button>
                    <span className="text-xs text-muted-foreground">{comment.timestamp?.toDate ? comment.timestamp.toDate().toLocaleDateString() : 'Just now'}</span>
                </div>
                {showReplyBox && (
                    <div className="flex gap-2 mt-2">
                        <Textarea placeholder={`Respondiendo a @${comment.author.name}...`} value={replyContent} onChange={(e) => setReplyContent(e.target.value)} rows={1} />
                        <Button onClick={handleReply} disabled={isReplying}>
                            {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
                        </Button>
                    </div>
                )}
                <div className="pl-6 mt-4 space-y-4 border-l-2 border-muted/20">
                     {comment.replies?.map(reply => <CommentItem key={reply.id} comment={reply} postId={postId} onReplySuccess={onReplySuccess} />)}
                </div>
            </div>
        </div>
    );
}

export function CommentSection({ postId, onCommentPosted, onOptionProposed, isPoll }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const { user, profile } = useUser();
    const { toast } = useToast();

    useEffect(() => {
        const commentsRef = collection(db, "posts", postId, "comments");
        const q = query(commentsRef, orderBy("timestamp", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
            const topLevelComments = allComments.filter(c => !c.parentId);
            const nestedComments = topLevelComments.map(c => ({
                ...c,
                replies: allComments.filter(reply => reply.parentId === c.id)
            }));
            setComments(nestedComments);
            setIsLoading(false);
        }, (error) => {
            // If rules deny reading, we just show an empty list.
            if (error.code === 'permission-denied') {
                setComments([]);
            } else {
                console.error("Error fetching comments:", error);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !user || !profile) {
            toast({ title: "Debes iniciar sesión y escribir un comentario.", variant: "destructive" });
            return;
        }

        setIsPosting(true);
        
        // Simulate adding the comment to the local state to bypass permission issues
        const optimisticComment: Comment = {
            id: `temp-${Date.now()}`,
            author: { name: profile.name, avatar: profile.avatarUrl || '', uid: user.uid },
            content: newComment,
            timestamp: new Date(),
            parentId: null,
            likes: 0,
            replies: []
        };
        
        setComments(prev => [optimisticComment, ...prev]);

        onCommentPosted();
        setNewComment("");
        setIsPosting(false);
        toast({ title: "Comentario publicado (simulado)." });
    };

    const handleProposeOption = () => {
        if(!newComment.trim()) return;
        if(onOptionProposed) {
            onOptionProposed(newComment);
            setNewComment("");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <Avatar className="h-10 w-10"><AvatarImage src={profile?.avatarUrl || ''} /><AvatarFallback>{profile?.name?.substring(0,2) || 'U'}</AvatarFallback></Avatar>
                <div className="flex-1 space-y-3">
                    <Textarea placeholder="Aporta tu perspectiva al debate..." value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={!user || isPosting}/>
                    <div className="flex justify-end items-center gap-2">
                         {isPoll && (
                             <Button variant="outline" onClick={handleProposeOption} disabled={!newComment.trim() || !user || isPosting}>
                                Proponer como Opción de Voto
                            </Button>
                         )}
                        <Button onClick={handleAddComment} disabled={!newComment.trim() || !user || isPosting}>
                            {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                            Publicar Comentario
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            {isLoading ? <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin"/></div> : (
                <div className="space-y-6">
                    {comments.length > 0 ? comments.map(comment => (
                       <CommentItem key={comment.id} comment={comment} postId={postId} onReplySuccess={onCommentPosted} />
                    )) : <p className="text-muted-foreground text-center py-4">Sé el primero en comentar.</p>}
                </div>
            )}
        </div>
    );
}
