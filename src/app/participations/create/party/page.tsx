
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Flag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";

export default function CreatePartyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [partyName, setPartyName] = useState("");
    const [partyIdeology, setPartyIdeology] = useState("");
    const [partyDescription, setPartyDescription] = useState("");
    const [partyLongDescription, setPartyLongDescription] = useState("");

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

        try {
            const partyRef = doc(db, "political_parties", partySlug);
            await setDoc(partyRef, {
                id: partySlug,
                slug: partySlug,
                name: partyName,
                description: partyDescription,
                longDescription: partyLongDescription,
                ideology: partyIdeology,
                avatar: `https://avatar.vercel.sh/${partySlug}.png`,
                avatarHint: "party logo",
                banner: `https://placehold.co/1200x400/5a5a5b/ffffff.png?text=${encodeURIComponent(partyName)}`,
                bannerHint: "party banner",
                members: [authUser.uid],
                creatorId: authUser.uid,
                createdAt: serverTimestamp(),
            });

            toast({
                title: "¡Partido Político Creado!",
                description: `El partido "${partyName}" ha sido registrado en la red.`,
            });
            router.push(`/political-party/${partySlug}`);
        } catch (error: any) {
            console.error("Error creating political party:", error);
            toast({ title: "Error", description: error.message, variant: "destructive"});
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
                            <Label htmlFor="party-ideology">Ideología Principal</Label>
                            <Input id="party-ideology" placeholder="Ej: Soberanía Digital, Tecno-Progresismo" required value={partyIdeology} onChange={(e) => setPartyIdeology(e.target.value)} disabled={isLoading}/>
                        </div>
                       <div className="space-y-2">
                            <Label htmlFor="party-description">Descripción Corta (Lema o Principios clave)</Label>
                            <Input id="party-description" placeholder="Por la soberanía del ser en la era digital." required value={partyDescription} onChange={(e) => setPartyDescription(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="party-long-description">Manifiesto o Descripción Larga</Label>
                            <Textarea id="party-long-description" placeholder="Describe la visión, los objetivos y las propuestas clave del partido..." required value={partyLongDescription} onChange={(e) => setPartyLongDescription(e.target.value)} disabled={isLoading} />
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
