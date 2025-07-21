
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Flag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";

export default function CreatePartyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [partyName, setPartyName] = useState("");
    const [partyDescription, setPartyDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Error", description: "You must be logged in to create a party.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const partySlug = slugify(partyName);
        if (!partySlug) {
            toast({ title: "Error", description: "Party name is required.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        const partyData = {
            name: partyName,
            slug: partySlug,
            description: partyDescription,
            members: 1,
            creatorId: authUser.uid,
            avatar: `https://avatar.vercel.sh/${partySlug}.png`,
            avatarHint: "party logo",
            banner: `https://placehold.co/1200x400/000000/ffffff?text=${partyName}`,
            bannerHint: "political banner",
            createdAt: serverTimestamp(),
            ideology: "Not defined", 
        };
        
        try {
            const partyRef = doc(db, "political_parties", partySlug);
            await setDoc(partyRef, partyData);

            toast({
                title: "¡Partido Político Creado!",
                description: `El partido "${partyName}" ha sido registrado en la red.`,
            });
            router.push(`/party/${partySlug}`);

        } catch (error) {
             console.error("Error creating political party:", error);
             toast({
                title: "Error al crear el partido",
                description: "Hubo un problema al guardar los datos en el servidor.",
                variant: "destructive"
             });
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
                        <Flag className="h-8 w-8 text-primary glowing-icon" />
                        Registrar un Nuevo Partido Político
                    </CardTitle>
                    <CardDescription>
                        Establece una nueva fuerza política y ideológica en la red.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="party-name">Nombre del Partido</Label>
                            <Input id="party-name" placeholder="Ej: Partido de la Conciencia Digital" required value={partyName} onChange={(e) => setPartyName(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="party-slug">URL (automático)</Label>
                           <Input id="party-slug" placeholder="partido-conciencia-digital" disabled value={slugify(partyName)} />
                       </div>
                        <div className="space-y-2">
                            <Label htmlFor="party-description">Descripción Corta (Principios clave)</Label>
                            <Textarea id="party-description" placeholder="Un partido dedicado a la soberanía de los datos, la IA ética y la democracia digital..." required value={partyDescription} onChange={(e) => setPartyDescription(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Registrar Partido
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
