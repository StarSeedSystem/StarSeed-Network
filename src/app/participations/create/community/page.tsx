
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Loader2, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";

export default function CreateCommunityPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [communityLongDescription, setCommunityLongDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Error", description: "You must be logged in to create a community.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const communitySlug = slugify(communityName);
        if (!communitySlug) {
            toast({ title: "Error", description: "Community name is required.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            const communityRef = doc(db, "communities", communitySlug);
            await setDoc(communityRef, {
                id: communitySlug,
                slug: communitySlug,
                name: communityName,
                description: communityDescription,
                longDescription: communityLongDescription,
                avatar: `https://avatar.vercel.sh/${communitySlug}.png`,
                avatarHint: "community logo",
                banner: `https://placehold.co/1200x400/1a1a1b/ffffff.png?text=${encodeURIComponent(communityName)}`,
                bannerHint: "community banner",
                members: [authUser.uid], // Creator is the first member
                creatorId: authUser.uid,
                createdAt: serverTimestamp(),
            });

            toast({
                title: "¡Comunidad Creada!",
                description: `Tu comunidad "${communityName}" ha sido creada y ya está activa.`,
            });
            router.push(`/community/${communitySlug}`);
        } catch (error: any) {
            console.error("Error creating community:", error);
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
                        <Users className="h-8 w-8 text-primary glowing-icon" />
                        Crear una Nueva Comunidad
                    </CardTitle>
                    <CardDescription>
                        Forja un nuevo espacio para la colaboración en la red.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="font-headline text-xl font-semibold">Información Esencial</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="community-name">Nombre de la Comunidad</Label>
                                    <Input id="community-name" placeholder="Ej: Innovación Sostenible" required value={communityName} onChange={(e) => setCommunityName(e.target.value)} disabled={isLoading}/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="community-slug">URL (automático)</Label>
                                    <Input id="community-slug" placeholder="innovacion-sostenible" disabled value={slugify(communityName)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="community-description">Descripción Corta</Label>
                                <Input id="community-description" placeholder="Un colectivo para construir un futuro más verde." required value={communityDescription} onChange={(e) => setCommunityDescription(e.target.value)} disabled={isLoading} />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                             <h3 className="font-headline text-xl font-semibold">Contenido Detallado</h3>
                             <div className="space-y-2">
                                <Label htmlFor="about-section">Sección "Acerca de"</Label>
                                <Textarea id="about-section" placeholder="Describe la misión, visión y objetivos..." className="min-h-[150px]" value={communityLongDescription} onChange={(e) => setCommunityLongDescription(e.target.value)} disabled={isLoading} />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Crear Comunidad
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
