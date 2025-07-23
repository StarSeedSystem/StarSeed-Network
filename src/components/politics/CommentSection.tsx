
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, updateDoc, doc, runTransaction } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Loader2, Gavel } from "lucide-react";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";

interface Comment {
    id: string;
    author: { name: string; avatar: string; uid: string; };
    content: string;
    timestamp: any;
    likes: number;
    dislikes: number;
    isOptionProposal?: boolean;
}

interface CommentSectionProps {
    proposalId: string;
}

export function CommentSection({ proposalId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [isOptionProposal, setIsOptionProposal] = useState(false);
    const { user, profile } = useUser();
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
        if (!newComment.trim() || !user || !profile) {
            toast({ title: "Debes iniciar sesión y escribir un comentario.", variant: "destructive" });
            return;
        }

        setIsPosting(true);
        const commentsRef = collection(db, "proposals", proposalId, "comments");
        const proposalRef = doc(db, "proposals", proposalId);

        try {
            if (isOptionProposal) {
                // If it's an option proposal, update the main proposal document
                await runTransaction(db, async (transaction) => {
                    const proposalDoc = await transaction.get(proposalRef);
                    if (!proposalDoc.exists()) throw "Proposal does not exist!";

                    const newOption = {
                        id: `opc_${uuidv4()}`,
                        text: newComment.trim(),
                        votes: 1, // Proposer's vote is counted
                        proposerId: user.uid,
                        proposerName: profile.name,
                    };
                    
                    const currentOptions = proposalDoc.data().options || [];
                    const newVoters = { ...proposalDoc.data().voters, [user.uid]: newOption.id };
                    
                    transaction.update(proposalRef, { 
                        options: [...currentOptions, newOption],
                        voters: newVoters
                    });
                });
                toast({ title: "¡Opción Propuesta!", description: "Tu sugerencia ha sido añadida a la votación." });
            } else {
                 // It's a regular comment
                await addDoc(commentsRef, {
                    author: { name: profile.name, avatar: profile.avatarUrl, uid: user.uid },
                    content: newComment,
                    timestamp: serverTimestamp(),
                    likes: 0,
                    dislikes: 0,
                });
            }
            
            setNewComment("");
            setIsOptionProposal(false);
        } catch (error) {
            console.error(error);
            toast({ title: "Error al publicar", description: "No se pudo guardar tu contribución.", variant: "destructive" });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="glass-card rounded-2xl">
            <CardHeader><CardTitle>Debate y Comentarios</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10"><AvatarImage src={profile?.avatarUrl || ''} /><AvatarFallback>{profile?.name?.substring(0,2) || 'U'}</AvatarFallback></Avatar>
                    <div className="flex-1 space-y-3">
                        <Textarea placeholder="Aporta tu perspectiva al debate..." value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={!user || isPosting}/>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="propose-option" checked={isOptionProposal} onCheckedChange={(checked) => setIsOptionProposal(!!checked)} disabled={!user || isPosting}/>
                                <Label htmlFor="propose-option" className="text-sm font-medium text-muted-foreground">
                                    Proponer como opción de votación
                                </Label>
                            </div>
                            <Button onClick={handleAddComment} disabled={!newComment.trim() || !user || isPosting}>
                                {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                                {isOptionProposal ? "Proponer Opción" : "Publicar Comentario"}
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator />

                {isLoading ? <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin"/></div> : (
                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map(comment => (
                            <div key={comment.id} className="flex gap-4">
                                 <Avatar className="h-10 w-10"><AvatarImage src={comment.author.avatar} /><AvatarFallback>{comment.author.name.substring(0,2)}</AvatarFallback></Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{comment.author.name}</p>
                                        <p className="text-xs text-muted-foreground">{comment.timestamp?.toDate ? comment.timestamp.toDate().toLocaleDateString() : 'Just now'}</p>
                                    </div>
                                    {comment.isOptionProposal && (
                                        <Badge variant="secondary" className="mt-2 text-xs"><Gavel className="mr-1.5 h-3 w-3" />Propuesta de Opción</Badge>
                                    )}
                                    <p className="text-foreground/90 mt-2">{comment.content}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Button variant="ghost" size="sm" className="gap-1.5"><ThumbsUp className="h-4 w-4" /> {comment.likes}</Button>
                                        <Button variant="ghost" size="sm" className="gap-1.5"><ThumbsDown className="h-4 w-4" /> {comment.dislikes}</Button>
                                    </div>
                                </div>
                            </div>
                        )) : <p className="text-muted-foreground text-center py-4">Sé el primero en comentar.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
