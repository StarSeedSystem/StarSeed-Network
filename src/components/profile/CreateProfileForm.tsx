
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";

export function CreateProfileForm() {
    const { user: authUser } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const [handle, setHandle] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);

    const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
            return;
        }
        setIsCreatingProfile(true);

        const finalHandle = slugify(handle);
        const avatarUrl = `https://avatar.vercel.sh/${finalHandle}.png`;

        try {
            // 1. Update the Firebase Auth user profile
            await updateProfile(auth.currentUser!, {
                displayName: displayName,
                photoURL: avatarUrl,
            });

            // 2. Create the Firestore user document
            const newProfile = {
                name: displayName,
                handle: finalHandle,
                bio: bio,
                avatarUrl: avatarUrl,
                bannerUrl: "https://placehold.co/1200x400/0a0a0b/9ca3af.png?text=Bienvenido+al+Nexo",
                badges: { nexusPioneer: true },
                createdAt: new Date(),
            };
            await setDoc(doc(db, "users", authUser.uid), newProfile, { merge: true });
            
            toast({ title: "¡Perfil Creado!", description: "Bienvenido al Nexo, Pionero." });
            
            // 3. Force a reload of the /profile page to reflect new state
            router.push('/profile');
            // A full refresh might be needed if UserContext doesn't update immediately
            router.refresh(); 

        } catch (error) {
            console.error("Error creando perfil:", error);
            toast({ title: "Error", description: "No se pudo crear tu perfil.", variant: "destructive" });
        } finally {
            setIsCreatingProfile(false);
        }
    };
    
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
                        <Label htmlFor="handle">Handle Único (sin @)</Label>
                        <Input id="handle" placeholder="starlight" value={handle} onChange={(e) => setHandle(e.target.value)} required />
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
