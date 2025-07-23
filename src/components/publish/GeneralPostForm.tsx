
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, Plus, X, Vote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Switch } from "@/components/ui/switch";

interface PostOption {
    id: string;
    text: string;
    votes: number;
}

interface GeneralPostFormProps {
    postType: 'education' | 'culture';
}

export function GeneralPostForm({ postType }: GeneralPostFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    // Voting state
    const [isVotingPost, setIsVotingPost] = useState(false);
    const [options, setOptions] = useState<PostOption[]>([]);
    const [currentOptionText, setCurrentOptionText] = useState("");

    const handleAddOption = () => {
        if (currentOptionText.trim()) {
            const newOption: PostOption = {
                id: `opc_${uuidv4()}`,
                text: currentOptionText.trim(),
                votes: 0,
            };
            setOptions([...options, newOption]);
            setCurrentOptionText("");
        }
    };
    
    const handleRemoveOption = (id: string) => {
        setOptions(options.filter(option => option.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) return;
        setIsLoading(true);

        try {
            const postData: any = {
                title,
                content,
                type: postType,
                authorId: authUser.uid,
                authorName: authUser.displayName || "Anonymous",
                createdAt: serverTimestamp(),
                isVotingPost,
                voters: {},
            };
            
            if(isVotingPost) {
                postData.options = options.length > 0 ? options : [
                    { id: `opc_${uuidv4()}`, text: "De acuerdo", votes: 0 },
                    { id: `opc_${uuidv4()}`, text: "En desacuerdo", votes: 0 },
                ];
            }
            
            // We can create separate collections later if needed
            const docRef = await addDoc(collection(db, "general_posts"), postData);
            
            toast({ title: "Publicación Creada!" });
            // Redirect to a generic post view page (to be created)
            // router.push(`/${postType}/${docRef.id}`);
            router.push(`/${postType}`); // For now, go back to the section page
        } catch (error) {
            toast({ title: "Error al publicar", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl capitalize">Nueva Publicación de {postType}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" placeholder="Título de tu publicación" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Contenido</Label>
                        <Textarea id="content" placeholder="Escribe tu contenido aquí..." required className="min-h-[150px]" value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Herramientas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch id="voting-switch" checked={isVotingPost} onCheckedChange={setIsVotingPost} />
                        <Label htmlFor="voting-switch" className="text-lg flex items-center gap-2"><Vote className="h-5 w-5"/>Convertir en una publicación con votación</Label>
                    </div>

                    {isVotingPost && (
                        <div className="mt-6 space-y-4 border-t border-primary/20 pt-6">
                            <h3 className="font-semibold">Opciones de Votación</h3>
                            <div className="flex gap-2">
                                <Input value={currentOptionText} onChange={(e) => setCurrentOptionText(e.target.value)} placeholder="Texto de la opción..."/>
                                <Button type="button" onClick={handleAddOption}><Plus className="mr-2 h-4 w-4"/>Añadir</Button>
                            </div>
                            <div className="space-y-2 mt-4">
                                {options.map((option) => (
                                    <div key={option.id} className="flex items-center justify-between p-2 bg-background/50 rounded-md">
                                        <p>{option.text}</p>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)}><X className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <div className="flex justify-end pt-2">
                <Button size="lg" type="submit" disabled={isLoading} className="shadow-lg shadow-primary/30">
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                    Publicar
                </Button>
            </div>
        </form>
    );
}
