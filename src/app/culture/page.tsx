import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, VrHeadset, BotMessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const culturalContent = [
    {
        title: "Galería de Arte Ciberdélico 'Sueños de Neón'",
        type: "Entorno Virtual",
        author: "@Art-AI.dao",
        image: "https://placehold.co/600x400.png",
        imageHint: "neon art",
        description: "Sumérgete en una exposición de arte generado por la consciencia colectiva."
    },
    {
        title: "Bosque Primordial: Meditación en VR",
        type: "Entorno Virtual",
        author: "@GaiaPrime",
        image: "https://placehold.co/600x400.png",
        imageHint: "enchanted forest",
        description: "Un espacio de sanación y conexión con la naturaleza digital, reactivo a tus datos biométricos."
    },
    {
        title: "Mi Nuevo Avatar Solarpunk",
        type: "Avatar 3D",
        author: "@Helios",
        image: "https://placehold.co/400x400.png",
        imageHint: "solarpunk character",
        description: "Comparto mi última creación de avatar para que la usen libremente."
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

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card flex flex-col items-center justify-center text-center p-6">
                 <VrHeadset className="h-12 w-12 text-primary glowing-icon mb-4" />
                <CardTitle className="font-headline text-2xl">Crear Entorno Virtual</CardTitle>
                <CardDescription className="mt-2">Describe tu visión y deja que la IA genere un nuevo mundo para ti y tu comunidad.</CardDescription>
                 <Button size="lg" className="mt-4 shadow-lg shadow-primary/30">Empezar Creación</Button>
            </Card>
            <Card className="glass-card flex flex-col items-center justify-center text-center p-6">
                <BotMessageSquare className="h-12 w-12 text-accent glowing-icon mb-4" />
                <CardTitle className="font-headline text-2xl">Crear Avatar con IA</CardTitle>
                <CardDescription className="mt-2">Genera una nueva identidad virtual a partir de una descripción en lenguaje natural.</CardDescription>
                <Button size="lg" variant="outline" className="mt-4" asChild>
                    <Link href="/avatar-generator">Ir al Generador de Avatares</Link>
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

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {culturalContent.map((item, index) => (
          <Card key={index} className="glass-card rounded-2xl overflow-hidden group">
            <div className="aspect-video relative">
                 <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={item.imageHint} />
            </div>
            <CardHeader>
              <CardDescription>{item.type} por {item.author}</CardDescription>
              <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
