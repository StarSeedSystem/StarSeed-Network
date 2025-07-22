
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("");

    const publishedInProfileId = searchParams.get('publishedInId');
    const publishedInProfileType = searchParams.get('publishedInType');
    const publishedInProfileName = searchParams.get('publishedInName');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- ROBUST CLIENT-SIDE VALIDATION ---
        if (!authUser) {
            toast({ title: "Authentication Required", description: "You must be logged in to create a tutorial.", variant: "destructive" });
            return;
        }
        if (!title.trim() || !summary.trim() || !category.trim()) {
            toast({ title: "Missing Information", description: "Please fill in all required fields (Title, Summary, Category).", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const tutorialData: any = {
                title: title.trim(),
                summary: summary.trim(),
                category: category.trim(),
                authorId: authUser.uid,
                authorName: authUser.displayName || "Anonymous Educator", // Ensure string value
                createdAt: serverTimestamp(),
            };

            if (publishedInProfileId && publishedInProfileType && publishedInProfileName) {
                tutorialData.publishedInProfileId = publishedInProfileId;
                tutorialData.publishedInProfileType = publishedInProfileType;
                tutorialData.publishedInProfileName = publishedInProfileName;
            }

            await addDoc(collection(db, "tutorials"), tutorialData);

            toast({
                title: "¡Tutorial Creado!",
                description: publishedInProfileName 
                    ? `Tu contribución ha sido añadida a ${publishedInProfileName}.` 
                    : "Tu contribución ha sido añadida a la sección de Educación.",
            });
            
            router.push(`/education`); 

        } catch (error: any) {
             console.error("Error creating tutorial:", error);
             // Firebase errors often have a .code and .message
             let errorMessage = "Hubo un problema al guardar el tutorial en la base de datos.";
             if (error.message) {
                 errorMessage = error.message;
             }
             toast({
                title: "Error al crear el tutorial",
                description: errorMessage,
                variant: "destructive"
             });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Button disabled state
    const isFormValid = title.trim() !== '' && summary.trim() !== '' && category.trim() !== '';

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
                         {publishedInProfileName ? `Crear Tutorial en ${publishedInProfileName}` : "Crear Nuevo Tutorial"}
                    </CardTitle>
                    <CardDescription>
                        Comparte tu conocimiento con la comunidad creando un nuevo recurso educativo.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                         {publishedInProfileName && (
                             <div className="text-sm text-muted-foreground mb-4">
                                Publicando como: <span className="font-semibold text-primary">{publishedInProfileName} ({publishedInProfileType})</span>
                             </div>
                         )}
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
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading || !isFormValid}>
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
