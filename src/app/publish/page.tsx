
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Gavel, BookMarked, Palette, PlusCircle } from "lucide-react";
import Link from "next/link";

// This is the central publication hub where users choose what type of content to create.

export default function PublishPage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('post'); // Default to general post

    // We'll expand this with more options later based on user's memberships
    const [publishDestination, setPublishDestination] = useState('personal'); // 'personal' or 'public'
    const [selectedPublicProfile, setSelectedPublicProfile] = useState<{ id: string, name: string, type: string } | null>(null);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
             <Card className="glass-card">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl flex items-center justify-center gap-3">
                        <PlusCircle className="h-8 w-8 text-primary glowing-icon" />
                        Crear Nuevo Contenido
                    </CardTitle>
                    <CardDescription>
                       Selecciona el tipo de contenido que deseas publicar en la red.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* --- Step 1: Select Content Type --- */}
                    <div className="space-y-4">
                         <h3 className="font-headline text-xl font-semibold border-b border-primary/20 pb-2">Tipo de Contenido</h3>
                        <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value)} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card/60 rounded-xl h-auto">
                                <TabsTrigger value="post" className="rounded-lg py-2 text-base">
                                    <PenSquare className="mr-2 h-5 w-5" />
                                    Publicación General
                                </TabsTrigger>
                                <TabsTrigger value="proposal" className="rounded-lg py-2 text-base">
                                    <Gavel className="mr-2 h-5 w-5" />
                                    Propuesta Legislativa
                                </TabsTrigger>
                                <TabsTrigger value="tutorial" className="rounded-lg py-2 text-base">
                                     <BookMarked className="mr-2 h-5 w-5" />
                                    Tutorial Educativo
                                </TabsTrigger>
                                <TabsTrigger value="cultural-post" className="rounded-lg py-2 text-base">
                                     <Palette className="mr-2 h-5 w-5" />
                                    Obra Cultural
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                     {/* --- Step 2: Select Destination (Personal vs Public) --- */}
                     {/* This section will be added here later, showing a dropdown or list of user's public profiles */}

                    {/* --- Step 3: Link to the specific creation form based on type --- */}
                    <div className="space-y-4 text-center">
                        <h3 className="font-headline text-xl font-semibold border-b border-primary/20 pb-2">Continuar</h3>
                        {selectedType === 'post' && (
                            <Button size="lg" className="w-full" disabled>Create General Post (Coming Soon)</Button>
                        )}
                         {selectedType === 'proposal' && (
                            <Button size="lg" className="w-full" asChild>
                                <Link href="/participations/create/proposal">Ir a Crear Propuesta</Link>
                            </Button>
                        )}
                         {selectedType === 'tutorial' && (
                             <Button size="lg" className="w-full" asChild>
                                 <Link href="/participations/create/tutorial">Ir a Crear Tutorial</Link>
                             </Button>
                         )}
                         {selectedType === 'cultural-post' && (
                             <Button size="lg" className="w-full" asChild>
                                 <Link href="/participations/create/cultural-post">Ir a Crear Obra Cultural</Link>
                             </Button>
                         )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
