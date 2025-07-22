
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
import { ArrowLeft, Check, Palette, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateCulturalPostPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // For simplicity, we'll use a URL for now.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            await addDoc(collection(db, "cultural_posts"), {
                title: title,
                description: description,
                imageUrl: imageUrl, // Later this would come from Firebase Storage
                authorId: authUser.uid,
                authorName: authUser.displayName || "Anonymous Artist",
                createdAt: serverTimestamp(),
                likes: 0,
            });

            toast({
                title: "¡Obra Publicada!",
                description: "Tu creación ha sido añadida a la galería cultural.",
            });
            
            router.push(`/culture`);

        } catch (error) {
             console.error("Error creating cultural post:", error);
             toast({ title: "Error al publicar", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <Palette className="h-8 w-8 text-primary glowing-icon" />
                        Publicar en la Galería Cultural
                    </CardTitle>
                    <CardDescription>
                        Comparte tu arte, música, escritos u otras formas de expresión cultural con la red.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título de la Obra</Label>
                            <Input id="title" placeholder="Ej: Amanecer en el Nexus" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">URL de la Imagen</Label>
                            <Input id="imageUrl" placeholder="https://..." required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción o Manifiesto del Artista</Label>
                            <Textarea id="description" placeholder="Esta obra representa la fusión entre la conciencia humana y la inteligencia artificial..." required value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading || !title || !description || !imageUrl}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Publicar Obra
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
