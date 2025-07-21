
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Headset, BotMessageSquare, Sparkles, Map, Calendar, Newspaper } from "lucide-react";
import Link from "next/link";
import { ContentCard } from "@/components/content/ContentCard";
import type { CulturalContent } from "@/types/content-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const culturalFeed: CulturalContent[] = [
    {
        id: "art-001",
        title: "Galería de Arte Ciberdélico 'Sueños de Neón'",
        type: "Entorno Virtual",
        author: { name: "@Art-AI.dao", avatar: "https://placehold.co/100x100.png", avatarHint: "abstract art" },
        image: "https://placehold.co/600x400.png",
        imageHint: "neon art",
        description: "Sumérgete en una exposición de arte generado por la consciencia colectiva."
    },
    {
        id: "env-002",
        title: "Bosque Primordial: Meditación en VR",
        type: "Entorno Virtual",
        author: { name: "@GaiaPrime", avatar: "https://placehold.co/100x100.png", avatarHint: "glowing goddess" },
        image: "https://placehold.co/600x400.png",
        imageHint: "enchanted forest",
        description: "Un espacio de sanación y conexión con la naturaleza digital, reactivo a tus datos biométricos."
    },
    {
        id: "avatar-003",
        title: "Mi Nuevo Avatar Solarpunk",
        type: "Avatar 3D",
        author: { name: "@Helios", avatar: "https://placehold.co/100x100.png", avatarHint: "sun god" },
        image: "https://placehold.co/400x400.png",
        imageHint: "solarpunk character",
        description: "Comparto mi última creación de avatar para que la usen libremente."
    },
    {
        id: "event-001",
        title: "Festival de Música Algorítmica",
        type: "Evento",
        author: { name: "@SynthWeavers", avatar: "https://placehold.co/100x100.png", avatarHint: "sound waves" },
        image: "https://placehold.co/600x400.png",
        imageHint: "music festival",
        description: "Tres días de actuaciones en vivo de los mejores músicos algorítmicos y artistas de IA."
    }
];

export default function CulturePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Cultura</h1>
        <p className="text-lg text-muted-foreground mt-2">
          El espacio para la expresión social, artística y la creación de nuevos mundos.
        </p>
      </div>

       <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="feed" className="rounded-lg py-2 text-base">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Feed Cultural
                </TabsTrigger>
                <TabsTrigger value="map" className="rounded-lg py-2 text-base">
                    <Map className="mr-2 h-5 w-5" />
                    Mapa Interactivo
                </TabsTrigger>
                <TabsTrigger value="calendar" className="rounded-lg py-2 text-base">
                    <Calendar className="mr-2 h-5 w-5" />
                    Calendario
                </TabsTrigger>
                <TabsTrigger value="news" className="rounded-lg py-2 text-base">
                    <Newspaper className="mr-2 h-5 w-5" />
                    Noticias
                </TabsTrigger>
                 <TabsTrigger value="vr" className="rounded-lg py-2 text-base">
                    <Headset className="mr-2 h-5 w-5" />
                    Entornos Virtuales
                </TabsTrigger>
            </TabsList>
            <TabsContent value="feed" className="mt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="glass-card flex flex-col items-center justify-center text-center p-6">
                        <Headset className="h-12 w-12 text-primary glowing-icon mb-4" />
                        <CardTitle className="font-headline text-2xl">Crear Entorno Virtual</CardTitle>
                        <CardDescription className="mt-2">Describe tu visión y deja que la IA genere un nuevo mundo para ti y tu comunidad.</CardDescription>
                        <Button size="lg" className="mt-4 shadow-lg shadow-primary/30">Empezar Creación</Button>
                    </Card>
                    <Card className="glass-card flex flex-col items-center justify-center text-center p-6">
                        <BotMessageSquare className="h-12 w-12 text-accent glowing-icon mb-4" />
                        <CardTitle className="font-headline text-2xl">Crear Avatar con IA</CardTitle>
                        <CardDescription className="mt-2">Genera una nueva identidad virtual a través del Agente de IA.</CardDescription>
                        <Button size="lg" variant="outline" className="mt-4" asChild>
                            <Link href="/agent">Ir al Agente de IA</Link>
                        </Button>
                    </Card>
                </div>
                
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-headline">Feed Cultural</h2>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrar Contenido
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {culturalFeed.map((item) => (
                    <ContentCard key={item.id} content={item} />
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="map" className="mt-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Mapa Interactivo</CardTitle>
                        <CardDescription>Una vista geoespacial que fusiona el mundo físico y digital.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="aspect-video bg-background/50 rounded-lg flex items-center justify-center border-2 border-dashed relative">
                            <Image src="https://placehold.co/1200x600.png" layout="fill" objectFit="cover" alt="Mapa del mundo" className="opacity-20" data-ai-hint="world map" />
                            <p className="text-muted-foreground z-10">[Aquí se renderizará un mapa interactivo]</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="calendar" className="mt-6">
                 <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Calendario de Eventos</CardTitle>
                        <CardDescription>Todos los eventos culturales de la red, en un solo lugar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="aspect-video bg-background/50 rounded-lg flex items-center justify-center border-2 border-dashed">
                            <p className="text-muted-foreground">[Aquí se renderizará una vista de calendario]</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="news" className="mt-6">
                 <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Noticias de la Red</CardTitle>
                        <CardDescription>Un portal de periodismo ciudadano, verificado por la comunidad.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="bg-background/50 rounded-lg p-8 flex items-center justify-center border-2 border-dashed">
                            <p className="text-muted-foreground">[Aquí se mostrará el feed de noticias verificadas]</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="vr" className="mt-6">
                 <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Entornos Virtuales (EVP)</CardTitle>
                        <CardDescription>Explora, crea e interactúa en mundos virtuales persistentes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="bg-background/50 rounded-lg p-8 flex items-center justify-center border-2 border-dashed">
                            <p className="text-muted-foreground">[Aquí se mostrará la galería de Entornos Virtuales]</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
      </Tabs>
    </div>
  );
}
