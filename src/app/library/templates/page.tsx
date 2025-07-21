

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, PlusCircle, User } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const templates = {
    profile: [
        {
            title: "Perfil 'Cosmonauta'",
            description: "Un diseño futurista centrado en tus logros y actividad en la red.",
            image: "https://placehold.co/600x400.png",
            imageHint: "futuristic user profile",
            type: "2D",
            author: "NexusBuilders"
        },
        {
            title: "Perfil 'Artista'",
            description: "Una plantilla visual que destaca tu biblioteca de creaciones de IA.",
            image: "https://placehold.co/600x400.png",
            imageHint: "artistic portfolio",
            type: "AR",
            author: "Art-AI.dao"
        },
    ],
    community: [
         {
            title: "Comunidad 'Colmena'",
            description: "Diseño para grupos grandes, centrado en propuestas y votaciones.",
            image: "https://placehold.co/600x400.png",
            imageHint: "community hub interface",
            type: "2D",
            author: "GovArchs"
        },
    ],
    dashboard: [
        {
            title: "Dashboard 'Analista'",
            description: "Un panel de control lleno de widgets de datos y resúmenes.",
            image: "https://placehold.co/600x400.png",
            imageHint: "data dashboard",
            type: "2D",
            author: "DataWeavers"
        },
    ],
    environment: [
         {
            title: "Entorno 'Jardín Zen'",
            description: "Un espacio virtual minimalista y relajante para la meditación.",
            image: "https://placehold.co/600x400.png",
            imageHint: "zen garden",
            type: "VR",
            author: "GaiaPrime"
        },
    ]
};

type TemplateCategory = keyof typeof templates;

export default function TemplatesPage() {

    const renderTemplateGrid = (category: TemplateCategory) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates[category].map((template) => (
                <Card key={template.title} className="glass-card rounded-2xl overflow-hidden group flex flex-col">
                    <div className="aspect-video relative">
                        <Image src={template.image} alt={template.title} layout="fill" objectFit="cover" data-ai-hint={template.imageHint} className="group-hover:scale-105 transition-transform" />
                        <div className="absolute top-2 right-2">
                            <Badge className="bg-black/50 backdrop-blur-sm text-white">{template.type}</Badge>
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Creado por {template.author}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full">
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
                    <LayoutTemplate className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-4xl font-bold font-headline">Galería de Plantillas</h1>
                        <p className="text-lg text-muted-foreground mt-1">
                           Personaliza la apariencia de tus espacios en la Red.
                        </p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card/60 rounded-xl h-auto">
                    <TabsTrigger value="profile" className="rounded-lg py-2 text-base">Perfiles</TabsTrigger>
                    <TabsTrigger value="community" className="rounded-lg py-2 text-base">Comunidades</TabsTrigger>
                    <TabsTrigger value="dashboard" className="rounded-lg py-2 text-base">Dashboards</TabsTrigger>
                    <TabsTrigger value="environment" className="rounded-lg py-2 text-base">Entornos VR</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6">{renderTemplateGrid("profile")}</TabsContent>
                <TabsContent value="community" className="mt-6">{renderTemplateGrid("community")}</TabsContent>
                <TabsContent value="dashboard" className="mt-6">{renderTemplateGrid("dashboard")}</TabsContent>
                <TabsContent value="environment" className="mt-6">{renderTemplateGrid("environment")}</TabsContent>
            </Tabs>
        </div>
    );
}
