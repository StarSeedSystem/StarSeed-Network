
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Textarea } from "@/components/ui/textarea";

export default function CreateStudyGroupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupTopic, setGroupTopic] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupLongDescription, setGroupLongDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const groupSlug = slugify(groupName);
        if (!groupSlug) {
            toast({ title: "Invalid Name", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            const groupRef = doc(db, "study_groups", groupSlug);
            await setDoc(groupRef, {
                id: groupSlug,
                slug: groupSlug,
                name: groupName,
                description: groupDescription,
                longDescription: groupLongDescription,
                topic: groupTopic,
                avatar: `https://avatar.vercel.sh/${groupSlug}.png`,
                avatarHint: "group logo",
                banner: `https://placehold.co/1200x400/4a4a4b/ffffff.png?text=${encodeURIComponent(groupName)}`,
                bannerHint: "group banner",
                members: [authUser.uid],
                creatorId: authUser.uid,
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Study Group Created!",
                description: `The group "${groupName}" is now active.`,
            });
            router.push(`/study-group/${groupSlug}`);
        } catch (error: any) {
            console.error("Error creating study group:", error);
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
                        <BookOpen className="h-8 w-8 text-primary glowing-icon" />
                        Formar un Grupo de Estudio
                    </CardTitle>
                    <CardDescription>
                        Crea un espacio enfocado para el aprendizaje colaborativo y la investigación.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Nombre del Grupo de Estudio</Label>
                            <Input id="group-name" placeholder="Ej: Exploradores de Computación Cuántica" required value={groupName} onChange={(e) => setGroupName(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group-topic">Tema o Asunto Principal</Label>
                            <Input id="group-topic" placeholder="Mecánica Cuántica, Ética de IA, etc." required value={groupTopic} onChange={(e) => setGroupTopic(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group-description">Descripción Corta</Label>
                            <Input id="group-description" placeholder="Un breve resumen de los objetivos del grupo." required value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} disabled={isLoading}/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="group-long-description">Descripción Larga (Opcional)</Label>
                            <Textarea id="group-long-description" placeholder="Describe los temas a tratar, la frecuencia de las reuniones, los prerrequisitos, etc." value={groupLongDescription} onChange={(e) => setGroupLongDescription(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Formar Grupo
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
