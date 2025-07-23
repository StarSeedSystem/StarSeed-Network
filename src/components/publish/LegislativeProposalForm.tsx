
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
import { Check, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface ProposalOption {
    id: string;
    text: string;
    votes: number;
    proposerId: string;
}

export function LegislativeProposalForm() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [fullText, setFullText] = useState("");
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
            setCurrentOptionText("");
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
        if (!title.trim() || !fullText.trim()) {
            toast({ title: "Missing Information", description: "Please provide a title and the full text for the proposal.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            const finalOptions = options.length > 0 ? options : [
                { id: `opc_${uuidv4()}`, text: "A favor", votes: 0, proposerId: authUser.uid },
                { id: `opc_${uuidv4()}`, text: "En contra", votes: 0, proposerId: authUser.uid },
            ];

            const docRef = await addDoc(collection(db, "proposals"), {
                title,
                fullText,
                options: finalOptions,
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Detalles de la Propuesta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="title" className="text-lg font-semibold">Propuesta</Label>
                        <Input id="title" placeholder="Título de la Propuesta" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 text-xl h-12"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="full-text">Texto Completo</Label>
                        <Textarea id="full-text" placeholder="El texto detallado de la ley, con artículos y cláusulas." required className="min-h-[200px]" value={fullText} onChange={(e) => setFullText(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Opciones de Votación</CardTitle>
                    <CardDescription>Añade opciones de votación. Si no añades ninguna, se usarán las opciones por defecto "A favor" y "En contra".</CardDescription>
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

            <div className="flex justify-end pt-2">
                <Button size="lg" type="submit" disabled={isLoading} className="shadow-lg shadow-primary/30">
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                    Publicar Propuesta
                </Button>
            </div>
        </form>
    );
}
