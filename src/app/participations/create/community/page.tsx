
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Check, Image as ImageIcon, Users, Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function CreateCommunityPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "¡Comunidad Creada!",
            description: `Tu comunidad "${communityName}" ha sido creada y ya está activa.`,
        });
        router.push("/participations");
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Hub de Conexiones
            </Button>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary glowing-icon" />
                        Crear una Nueva Comunidad
                    </CardTitle>
                    <CardDescription>
                        Forja un nuevo espacio para la colaboración, el debate y la acción colectiva en la red.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        {/* Step 1: Basic Info */}
                        <div className="space-y-4">
                            <h3 className="font-headline text-xl font-semibold border-b border-primary/20 pb-2">Paso 1: Información Esencial</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="community-name">Nombre de la Comunidad</Label>
                                    <Input 
                                        id="community-name" 
                                        placeholder="Ej: Innovación Sostenible" 
                                        required 
                                        value={communityName}
                                        onChange={(e) => setCommunityName(e.target.value)}
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="community-slug">Identificador Único (URL)</Label>
                                    <Input id="community-slug" placeholder="innovacion-sostenible" disabled value={communityName.toLowerCase().replace(/\s+/g, '-')} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="community-description">Descripción Corta (Lema)</Label>
                                <Input 
                                    id="community-description" 
                                    placeholder="Un colectivo para construir un futuro más verde." 
                                    required
                                    value={communityDescription}
                                    onChange={(e) => setCommunityDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Step 2: Visual Identity */}
                        <div className="space-y-4">
                            <h3 className="font-headline text-xl font-semibold border-b border-primary/20 pb-2">Paso 2: Identidad Visual</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label>Avatar de la Comunidad</Label>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="logo placeholder" />
                                            <AvatarFallback>C</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <Button type="button" variant="outline"><ImageIcon className="mr-2 h-4 w-4" /> Subir Imagen</Button>
                                            <Button type="button" variant="outline"><Wand2 className="mr-2 h-4 w-4" /> Generar con IA</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                     <Label>Banner de la Comunidad</Label>
                                     <div className="aspect-video w-full bg-secondary rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden">
                                         <Image src="https://placehold.co/1200x400.png" layout="fill" objectFit="cover" alt="Banner Placeholder" data-ai-hint="banner placeholder" />
                                     </div>
                                      <div className="flex gap-2">
                                        <Button type="button" variant="outline" className="w-full"><ImageIcon className="mr-2 h-4 w-4" /> Subir Banner</Button>
                                        <Button type="button" variant="outline" className="w-full"><Wand2 className="mr-2 h-4 w-4" /> Generar con IA</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <Separator />

                        {/* Step 3: Detailed Content */}
                        <div className="space-y-4">
                             <h3 className="font-headline text-xl font-semibold border-b border-primary/20 pb-2">Paso 3: Contenido Detallado</h3>
                             <div className="space-y-2">
                                <Label htmlFor="about-section">Sección "Acerca de"</Label>
                                <Textarea id="about-section" placeholder="Describe la misión, visión y objetivos de tu comunidad en detalle." className="min-h-[150px]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rules-section">Reglas y Principios</Label>
                                <Textarea id="rules-section" placeholder="1. Fomentar la colaboración abierta...&#10;2. Respetar la diversidad de opiniones..." className="min-h-[100px]" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" className="shadow-lg shadow-primary/30">
                                <Check className="mr-2 h-5 w-5" />
                                Crear Comunidad
                            </Button>
                        </div>

                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
