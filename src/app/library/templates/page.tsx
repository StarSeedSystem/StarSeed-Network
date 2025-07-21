
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Palette, Copy } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const templates = {
    profile: [
        {
            title: "Perfil 'Cosmonauta'",
            description: "Un diseño futurista centrado en tus logros y actividad en la red.",
            image: "https://placehold.co/600x400.png",
            imageHint: "futuristic user profile",
        },
        {
            title: "Perfil 'Artista'",
            description: "Una plantilla visual que destaca tu biblioteca de creaciones de IA.",
            image: "https://placehold.co/600x400.png",
            imageHint: "artistic portfolio",
        },
    ],
    community: [
         {
            title: "Comunidad 'Colmena'",
            description: "Diseño para grupos grandes, centrado en propuestas y votaciones.",
            image: "https://placehold.co/600x400.png",
            imageHint: "community hub interface",
        },
    ],
    dashboard: [
        {
            title: "Dashboard 'Analista'",
            description: "Un panel de control lleno de widgets de datos y resúmenes.",
            image: "https://placehold.co/600x400.png",
            imageHint: "data dashboard",
        },
    ],
    environment: [
         {
            title: "Entorno 'Jardín Zen'",
            description: "Un espacio virtual minimalista y relajante para la meditación.",
            image: "https://placehold.co/600x400.png",
            imageHint: "zen garden",
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full">
                            <Copy className="mr-2 h-4 w-4" />
                            Usar Plantilla
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
