
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
import { ArrowLeft, Check, BookMarked, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateTutorialPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            const docRef = await addDoc(collection(db, "tutorials"), {
                title: title,
                summary: summary,
                category: category,
                authorId: authUser.uid,
                authorName: authUser.displayName || "Anonymous Educator",
                createdAt: serverTimestamp(),
                // Add more fields as needed, e.g., videoUrl, contentBlocks
            });

            toast({
                title: "¡Tutorial Creado!",
                description: "Tu contribución ha sido añadida a la sección de Educación.",
            });
            
            // Redirect to the main education page to see the new tutorial in the list
            router.push(`/education`);

        } catch (error) {
             console.error("Error creating tutorial:", error);
             toast({
                title: "Error al crear el tutorial",
                variant: "destructive"
             });
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
                        <BookMarked className="h-8 w-8 text-primary glowing-icon" />
                        Crear Nuevo Tutorial
                    </CardTitle>
                    <CardDescription>
                        Comparte tu conocimiento con la comunidad creando un nuevo recurso educativo.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título del Tutorial</Label>
                            <Input id="title" placeholder="Ej: Introducción a la Inteligencia Artificial Generativa" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Input id="category" placeholder="Tecnología, Arte, Filosofía, etc." required value={category} onChange={(e) => setCategory(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="summary">Resumen Corto</Label>
                            <Textarea id="summary" placeholder="Una guía para principiantes sobre los conceptos fundamentales de la IA generativa." required value={summary} onChange={(e) => setSummary(e.target.value)} disabled={isLoading} />
                        </div>
                        {/* We can add a more complex form for the full content later */}
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading || !title || !summary || !category}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Publicar Tutorial
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
