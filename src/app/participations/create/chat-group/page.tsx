
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";

export default function CreateChatGroupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupLongDescription, setGroupLongDescription] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Error", description: "You must be logged in to create a group.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const groupSlug = slugify(groupName);
        if (!groupSlug) {
            toast({ title: "Error", description: "Group name is required.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            const groupRef = doc(db, "chat_groups", groupSlug);
            await setDoc(groupRef, {
                id: groupSlug,
                slug: groupSlug,
                name: groupName,
                description: groupDescription,
                longDescription: groupLongDescription,
                avatar: `https://avatar.vercel.sh/${groupSlug}.png`,
                avatarHint: "group logo",
                banner: `https://placehold.co/1200x400/2a2a2b/ffffff.png?text=${encodeURIComponent(groupName)}`,
                bannerHint: "group banner",
                members: [authUser.uid],
                creatorId: authUser.uid,
                createdAt: serverTimestamp(),
            });

             toast({
                title: "¡Grupo de Chat Creado!",
                description: `Tu grupo "${groupName}" ha sido creado.`,
            });
            router.push(`/chat-group/${groupSlug}`);
        } catch (error: any) {
            console.error("Error creating chat group:", error);
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
                        <MessageSquare className="h-8 w-8 text-primary glowing-icon" />
                        Crear un Nuevo Grupo de Chat
                    </CardTitle>
                    <CardDescription>
                        Crea un espacio de conversación público sobre un tema de interés.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Nombre del Grupo</Label>
                            <Input id="group-name" placeholder="Ej: Aficionados a la Ciencia Ficción" required value={groupName} onChange={(e) => setGroupName(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group-description">Descripción Corta del Grupo</Label>
                            <Input id="group-description" placeholder="Un lugar para hablar de libros, películas y series de ciencia ficción." required value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group-long-description">Descripción Larga (Opcional)</Label>
                            <Textarea id="group-long-description" placeholder="Describe con más detalle la misión y las reglas del grupo." value={groupLongDescription} onChange={(e) => setGroupLongDescription(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading || !groupName || !groupDescription}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Crear Grupo de Chat
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
