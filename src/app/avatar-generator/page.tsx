
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { AIAvatarGenerator } from "@/components/profile/AIAvatarGenerator";
import { useToast } from "@/hooks/use-toast";

export default function AvatarGeneratorPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleAvatarGenerated = (newAvatarUrl: string) => {
        // In a real app, you would save this URL to the user's profile in the database.
        // For now, we can just show a success message and redirect.
        console.log("New avatar to be saved:", newAvatarUrl);
        
        toast({
            title: "¡Insignia Desbloqueada!",
            description: "Has obtenido la insignia 'AI Symbiote'. ¡Tu nuevo avatar está listo para ser usado en tu perfil!",
            duration: 5000,
        });

        // Redirect to profile page after a short delay
        setTimeout(() => {
            router.push('/profile');
        }, 2000);
    };

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card className="glass-card rounded-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-2">
                        <Bot className="text-primary h-8 w-8 glowing-icon" />
                        Generador de Avatares con IA
                    </CardTitle>
                    <CardDescription>
                       Forja una nueva identidad virtual. Describe tu visión en lenguaje natural y deja que la IA la materialice.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <AIAvatarGenerator onAvatarGenerated={handleAvatarGenerated} />
                </CardContent>
            </Card>
        </div>
    );
}
