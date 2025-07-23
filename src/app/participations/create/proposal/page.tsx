
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
import { ArrowLeft, Check, Gavel, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // For generating unique option IDs

interface ProposalOption {
    id: string;
    text: string;
    votes: number;
    proposerId: string;
}

export default function CreateProposalPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser, loading: authLoading } = useUser();

    // Proposal State
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [fullText, setFullText] = useState("");

    // Options State
    const [options, setOptions] = useState<ProposalOption[]>([]);
    const [currentOptionText, setCurrentOptionText] = useState("");

    const handleAddOption = () => {
        if (currentOptionText.trim() && authUser) {
            const newOption: ProposalOption = {
                id: `opc_${uuidv4()}`,
                text: currentOptionText.trim(),
                votes: 0,
                proposerId: authUser.uid,
            };
            setOptions([...options, newOption]);
            setCurrentOptionText(""); // Reset input
        }
    };

    const handleRemoveOption = (id: string) => {
        setOptions(options.filter(option => option.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", variant: "destructive" });
            return;
        }
        if (!title.trim() || !summary.trim() || !fullText.trim()) {
            toast({ title: "Missing Information", description: "Please fill in the main proposal details.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            // If no options are provided by the user, create default "For" and "Against"
            const finalOptions = options.length > 0 ? options : [
                { id: `opc_${uuidv4()}`, text: "A favor", votes: 0, proposerId: authUser.uid },
                { id: `opc_${uuidv4()}`, text: "En contra", votes: 0, proposerId: authUser.uid },
            ];

            const docRef = await addDoc(collection(db, "proposals"), {
                title, summary, fullText, options: finalOptions,
                authorId: authUser.uid,
                authorName: authUser.displayName || "Anonymous Pioneer",
                status: "en-votacion",
                createdAt: serverTimestamp(),
                voters: {}, // Initialize empty voters map
            });

            toast({ title: "¡Propuesta Publicada!", description: "Tu propuesta ya está activa para la votación." });
            router.push(`/politics/proposal/${docRef.id}`);

        } catch (error) {
             console.error("Error creating proposal:", error);
             toast({ title: "Error al crear la propuesta", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (authLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin"/></div>;

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Volver</Button>
            <form onSubmit={handleSubmit}>
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl flex items-center gap-3"><Gavel className="h-8 w-8 text-primary glowing-icon" />Crear Propuesta Legislativa</CardTitle>
                        <CardDescription>Presenta una nueva ley o directiva. Define el texto principal y, si es necesario, añade opciones de votación específicas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="title" className="text-lg font-semibold">Propuesta</Label>
                            <Input id="title" placeholder="Título de la Propuesta" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 text-xl h-12"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="summary">Resumen</Label>
                            <Textarea id="summary" placeholder="Un resumen claro y conciso de lo que se propone." required value={summary} onChange={(e) => setSummary(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="full-text">Texto Completo</Label>
                            <Textarea id="full-text" placeholder="El texto detallado de la ley, con artículos y cláusulas." required className="min-h-[200px]" value={fullText} onChange={(e) => setFullText(e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card mt-6">
                    <CardHeader>
                        <CardTitle>Opciones de Votación</CardTitle>
                        <CardDescription>Añade opciones de votación específicas. Si no añades ninguna, se usarán las opciones por defecto "A favor" y "En contra".</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                 <div className="flex justify-end pt-6">
                    <Button size="lg" type="submit" disabled={isLoading} className="shadow-lg shadow-primary/30">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                        Publicar Propuesta
                    </Button>
                </div>
            </form>
        </div>
    );
}
