
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, PlusCircle, User, Palette, LayoutDashboard as DashboardIcon, Cpu, VrHeadset, Diamond, Files, Bot } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const templates = {
    profile: [
        { title: "Perfil 'Cosmonauta'", description: "Un diseño futurista centrado en tus logros y actividad en la red.", image: "https://placehold.co/600x400.png", imageHint: "futuristic user profile", type: "2D", author: "NexusBuilders" },
        { title: "Perfil 'Artista'", description: "Una plantilla visual que destaca tu biblioteca de creaciones de IA.", image: "https://placehold.co/600x400.png", imageHint: "artistic portfolio", type: "AR", author: "Art-AI.dao" },
    ],
    ui: [
         { title: "Interfaz 'Glass Morph'", description: "Un tema visual que aplica efectos de vidrio a todos los componentes de la UI.", image: "https://placehold.co/600x400.png", imageHint: "glassmorphism ui", type: "2D", author: "UIDesigners" },
         { title: "Interfaz 'Holográfica'", description: "Proyecciones holográficas para menús y notificaciones en tu vista AR.", image: "https://placehold.co/600x400.png", imageHint: "holographic interface", type: "AR", author: "UIDesigners" },
    ],
    dashboard: [
        { title: "Dashboard 'Analista'", description: "Un panel de control lleno de widgets de datos y resúmenes.", image: "https://placehold.co/600x400.png", imageHint: "data dashboard", type: "2D", author: "DataWeavers" },
        { title: "Dashboard 'Entorno VR'", description: "Gestiona tu mundo virtual desde un panel de control inmersivo.", image: "https://placehold.co/600x400.png", imageHint: "vr dashboard", type: "VR", author: "DataWeavers" },
    ]
};

const apps = [
    { title: "Sintetizador de Biomas", description: "Genera ecosistemas procedurales para tus Entornos Virtuales.", image: "https://placehold.co/600x400.png", imageHint: "ecosystem generator", type: "Generativa", author: "BioCoders" },
    { title: "Traductor Universal", description: "Traducción en tiempo real para texto y voz, compatible con AR.", image: "https://placehold.co/600x400.png", imageHint: "language translation", type: "Utilidad", author: "Lingua-DAO" },
];

const environments = [
    { title: "Anfiteatro Griego", description: "Un espacio para debates filosóficos y asambleas comunitarias.", image: "https://placehold.co/600x400.png", imageHint: "greek amphitheater", type: "Social", author: "Philos-Collective" },
    { title: "Laboratorio de Alquimia", description: "Un entorno interactivo para la experimentación creativa.", image: "https://placehold.co/600x400.png", imageHint: "alchemist laboratory", type: "Creativo", author: "Art-AI.dao" },
];

const avatars = [
    { title: "Avatar 'Solarpunk'", description: "Un avatar que fusiona tecnología y naturaleza.", image: "https://placehold.co/600x400.png", imageHint: "solarpunk character", type: "Humanoide", author: "Helios" },
    { title: "Avatar 'Entidad de Datos'", description: "Una forma de avatar no-corpórea hecha de pura información.", image: "https://placehold.co/600x400.png", imageHint: "data entity", type: "Abstracto", author: "DataWeavers" },
]

type TemplateCategory = 'profile' | 'ui' | 'dashboard';
type AssetCategory = 'apps' | 'environments' | 'avatars' | 'templates';

const allAssets = {
    apps,
    environments,
    avatars,
    templates,
}

type AssetItem = {
    title: string;
    description: string;
    image: string;
    imageHint: string;
    type: string;
    author: string;
};

export default function TemplatesPage() {
    const { toast } = useToast();

    const handleAddToLibrary = (assetTitle: string) => {
        toast({
            title: "¡Activo Guardado!",
            description: `"${assetTitle}" ha sido añadido a tu biblioteca.`,
        });
    };

    const renderAssetGrid = (items: AssetItem[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <Card key={item.title} className="glass-card rounded-2xl overflow-hidden group flex flex-col">
                    <div className="aspect-video relative">
                        <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" data-ai-hint={item.imageHint} className="group-hover:scale-105 transition-transform" />
                        <div className="absolute top-2 right-2">
                            <Badge className="bg-black/50 backdrop-blur-sm text-white">{item.type}</Badge>
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Creado por {item.author}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" onClick={() => handleAddToLibrary(item.title)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir a mi Biblioteca
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                 <div className="flex items-center gap-3">
                    <Diamond className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-4xl font-bold font-headline">Tienda Virtual</h1>
                        <p className="text-lg text-muted-foreground mt-1">
                           Descubre, instala y comparte activos creados por la comunidad del Nexo.
                        </p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="apps" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card/60 rounded-xl h-auto">
                    <TabsTrigger value="apps" className="rounded-lg py-2 text-base">
                        <Cpu className="mr-2 h-4 w-4"/>
                        Apps
                    </TabsTrigger>
                    <TabsTrigger value="environments" className="rounded-lg py-2 text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
                        Entornos
                    </TabsTrigger>
                     <TabsTrigger value="avatars" className="rounded-lg py-2 text-base">
                        <Bot className="mr-2 h-4 w-4"/>
                        Avatares
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="rounded-lg py-2 text-base">
                        <LayoutTemplate className="mr-2 h-4 w-4"/>
                        Plantillas
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="apps" className="mt-6">{renderAssetGrid(apps)}</TabsContent>
                <TabsContent value="environments" className="mt-6">{renderAssetGrid(environments)}</TabsContent>
                <TabsContent value="avatars" className="mt-6">{renderAssetGrid(avatars)}</TabsContent>
                <TabsContent value="templates" className="mt-6">
                     <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-card/80 rounded-xl h-auto">
                            <TabsTrigger value="profile" className="rounded-lg py-1.5">
                                <User className="mr-2 h-4 w-4"/>Perfiles
                            </TabsTrigger>
                            <TabsTrigger value="ui" className="rounded-lg py-1.5">
                                <Palette className="mr-2 h-4 w-4"/>Interfaz
                            </TabsTrigger>
                            <TabsTrigger value="dashboard" className="rounded-lg py-1.5">
                                <DashboardIcon className="mr-2 h-4 w-4"/>Dashboards
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="mt-6">{renderAssetGrid(templates.profile)}</TabsContent>
                        <TabsContent value="ui" className="mt-6">{renderAssetGrid(templates.ui)}</TabsContent>
                        <TabsContent value="dashboard" className="mt-6">{renderAssetGrid(templates.dashboard)}</TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}
