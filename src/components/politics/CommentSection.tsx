
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Separator } from "../ui/separator";

interface Comment {
    id: string;
    author: { name: string; avatar: string; avatarHint: string; };
    content: string;
    timestamp: string;
    likes: number;
    dislikes: number;
}

const initialComments: Comment[] = [
    {
        id: "comment-1",
        author: { name: "Helios", avatar: "https://placehold.co/100x100.png", avatarHint: "sun god" },
        content: "Apoyo firmemente esta ley. La soberanía de datos es la base de la libertad individual en esta era digital. Sin ella, no somos más que productos.",
        timestamp: "Hace 2 horas",
        likes: 15,
        dislikes: 1
    },
    {
        id: "comment-2",
        author: { name: "CyberSec-DAO", avatar: "https://placehold.co/100x100.png", avatarHint: "cybernetic eye" },
        content: "La intención es buena, pero la implementación técnica propuesta en el anexo B tiene vulnerabilidades. Sugerimos un enfoque de cifrado de conocimiento cero (Zero-Knowledge) para la verificación de consentimiento. Adjunto un borrador técnico.",
        timestamp: "Hace 1 hora",
        likes: 22,
        dislikes: 0
    },
];

export function CommentSection() {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const newCommentObj: Comment = {
            id: `comment-${Date.now()}`,
            author: { name: "Starlight", avatar: "https://placehold.co/100x100.png", avatarHint: "glowing astronaut" },
            content: newComment,
            timestamp: "Ahora mismo",
            likes: 0,
            dislikes: 0,
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
    };

    return (
        <Card className="glass-card rounded-2xl">
            <CardHeader>
                <CardTitle>Debate y Comentarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* New Comment Input */}
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Starlight" data-ai-hint="glowing astronaut" />
                        <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea 
                            placeholder="Aporta tu perspectiva al debate..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="text-base"
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleAddComment} disabled={!newComment.trim()}>Publicar Comentario</Button>
                        </div>
                    </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                             <Avatar className="h-10 w-10">
                                <AvatarImage src={comment.author.avatar} alt={comment.author.name} data-ai-hint={comment.author.avatarHint} />
                                <AvatarFallback>{comment.author.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
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
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
