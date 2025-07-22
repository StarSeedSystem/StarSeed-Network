
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateProfileForm() {
    const { user: authUser, loading: authLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const [handle, setHandle] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/login');
        }
    }, [authUser, authLoading, router]);

    const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!authUser) return;
        setIsCreatingProfile(true);

        const finalHandle = handle.startsWith('@') ? handle : `@${handle}`;

        try {
            const newProfile = {
                name: displayName,
                handle: finalHandle,
                bio: bio,
                avatarUrl: `https://avatar.vercel.sh/${finalHandle}.png`,
                bannerUrl: "https://placehold.co/1200x400.png",
                badges: { nexusPioneer: true },
                createdAt: new Date(),
            };
            await setDoc(doc(db, "users", authUser.uid), newProfile);
            toast({ title: "¡Perfil Creado!", description: "Bienvenido al Nexo, Pionero." });
            router.push('/profile'); // Redirect to their new profile
        } catch (error) {
            console.error("Error creando perfil:", error);
            toast({ title: "Error", description: "No se pudo crear tu perfil.", variant: "destructive" });
        } finally {
            setIsCreatingProfile(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <Card className="mx-auto max-w-lg w-full glass-card">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
                    <UserPlus /> Crea Tu Perfil en el Nexo
                </CardTitle>
                <CardDescription>
                    Forja tu identidad en la red. Esta será tu presencia pública.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCreateProfile} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="displayName">Nombre Público</Label>
                        <Input id="displayName" placeholder="Starlight" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="handle">Handle Único</Label>
                        <Input id="handle" placeholder="@starlight.eth" value={handle} onChange={(e) => setHandle(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Biografía Corta</Label>
                        <Textarea id="bio" placeholder="Pionero digital explorando el nexo..." value={bio} onChange={(e) => setBio(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full mt-2" size="lg" disabled={isCreatingProfile}>
                        {isCreatingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Crear Perfil"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
