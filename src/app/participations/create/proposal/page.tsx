
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
import { ArrowLeft, Check, Gavel, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";

export default function CreateProposalPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser, loading: authLoading } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [fullText, setFullText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            const docRef = await addDoc(collection(db, "proposals"), {
                title: title,
                summary: summary,
                fullText: fullText,
                authorId: authUser.uid,
                authorName: authUser.displayName || "Anonymous Pioneer",
                status: "propuesta",
                votes: { for: 0, against: 0, abstain: 0 },
                createdAt: serverTimestamp(),
            });

            toast({
                title: "¡Propuesta Creada!",
                description: "Tu propuesta legislativa ha sido registrada y está abierta a debate.",
            });
            
            router.push(`/politics/proposal/${docRef.id}`);

        } catch (error) {
             console.error("Error creating proposal:", error);
             toast({
                title: "Error al crear la propuesta",
                description: "Hubo un problema al guardar la propuesta en la base de datos.",
                variant: "destructive"
             });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (authLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin"/></div>;
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <Gavel className="h-8 w-8 text-primary glowing-icon" />
                        Crear Propuesta Legislativa
                    </CardTitle>
                    <CardDescription>
                        Presenta una nueva ley o directiva para el debate y la votación de la comunidad.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título de la Propuesta</Label>
                            <Input id="title" placeholder="Ej: Ley de Soberanía de Datos Personales" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="summary">Resumen (1-2 frases)</Label>
                            <Textarea id="summary" placeholder="Una ley para garantizar que los individuos tengan control total sobre sus datos personales generados en la red." required value={summary} onChange={(e) => setSummary(e.target.value)} disabled={isLoading} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="full-text">Texto Completo de la Propuesta</Label>
                            <Textarea id="full-text" placeholder="Artículo 1: Definiciones. Artículo 2: Derechos del individuo..." required className="min-h-[200px]" value={fullText} onChange={(e) => setFullText(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading || !title || !summary || !fullText}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Publicar Propuesta
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
