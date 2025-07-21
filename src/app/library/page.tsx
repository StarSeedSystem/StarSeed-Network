

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Library as LibraryIcon, Store, Bot, LayoutTemplate, Folder } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ecosystemSections = [
    {
        title: "Mis Archivos y Biblioteca",
        description: "Accede a todos tus archivos, avatares y creaciones de IA en un solo lugar.",
        icon: Folder,
        href: "/library/my-library",
        hrefLabel: "Ir a mi Biblioteca",
        img: "https://placehold.co/600x400.png",
        imgHint: "digital files folders",
    },
    {
        title: "Tienda Virtual",
        description: "Descubre, instala y comparte plantillas, apps, avatares y más desde el repositorio comunitario.",
        icon: Store,
        href: "/library/templates",
        hrefLabel: "Explorar Tienda Virtual",
        img: "https://placehold.co/600x400.png",
        imgHint: "app store marketplace",
    },
    {
        title: "Creador de Apps (IA)",
        description: "Describe la funcionalidad que necesitas y deja que la IA construya una app para ti.",
        icon: Bot,
        href: "#",
        hrefLabel: "Empezar a Crear",
        img: "https://placehold.co/600x400.png",
        imgHint: "ai robot building",
    },
    {
        title: "Explorar Plantillas",
        description: "Personaliza tus perfiles, dashboards y entornos con plantillas pre-diseñadas.",
        icon: LayoutTemplate,
        href: "/library/templates",
        hrefLabel: "Ver Plantillas",
        img: "https://placehold.co/600x400.png",
        imgHint: "interface templates gallery",
    }
]

export default function LibraryPage() {
    return (
        <div className="space-y-8">
            <Card className="glass-card p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Busca en toda la biblioteca: apps, archivos, plantillas..." className="pl-12 h-14 text-lg bg-background/50" />
                    <Button size="lg" className="absolute right-2 top-1/2 -translate-y-1/2">Buscar</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ecosystemSections.map(section => (
                     <Card key={section.title} className="glass-card rounded-2xl overflow-hidden group flex flex-col">
                         <div className="relative h-48 w-full">
                            <Image src={section.img} alt={section.title} layout="fill" objectFit="cover" data-ai-hint={section.imgHint} className="group-hover:scale-105 transition-transform" />
                         </div>
                         <CardHeader>
                             <CardTitle className="font-headline text-2xl flex items-center gap-2">
                                <section.icon className="h-6 w-6 text-primary" />
                                {section.title}
                             </CardTitle>
                             <CardDescription>{section.description}</CardDescription>
                         </CardHeader>
                         <CardContent className="mt-auto">
                             <Button className="w-full" asChild>
                                <Link href={section.href}>{section.hrefLabel}</Link>
                             </Button>
                         </CardContent>
                     </Card>
                ))}
            </div>
        </div>
    );
}
