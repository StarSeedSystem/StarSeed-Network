
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import type { EducationalContent } from "@/types/content-types";

const educationalFeed: EducationalContent[] = [
    {
        id: "edu-001",
        title: "Introducción a las Redes Descentralizadas",
        category: "Tecnología",
        type: "Curso",
        level: "Principiante",
        image: "https://placehold.co/600x400.png",
        imageHint: "network nodes",
        description: "Aprende los fundamentos de las tecnologías P2P, blockchain y cómo potencian la soberanía digital.",
        author: { name: "Red de Educadores", avatar: "https://placehold.co/100x100.png", avatarHint: "open book" }
    },
    {
        id: "edu-002",
        title: "Biomimética y Diseño Sostenible",
        category: "Ciencia",
        type: "Artículo",
        level: "Intermedio",
        image: "https://placehold.co/600x400.png",
        imageHint: "leaf structure",
        description: "Un análisis profundo de cómo la naturaleza puede inspirar soluciones innovadoras a problemas humanos complejos.",
        author: { name: "@GaiaPrime", avatar: "https://placehold.co/100x100.png", avatarHint: "glowing goddess" }
    },
    {
        id: "edu-003",
        title: "Taller de Creación de Entornos VR",
        category: "Arte",
        type: "Curso",
        level: "Avanzado",
        image: "https://placehold.co/600x400.png",
        imageHint: "virtual reality",
        description: "Domina las herramientas para construir tus propios mundos virtuales persistentes en la Red StarSeed.",
        author: { name: "Comunidad VR", avatar: "https://placehold.co/100x100.png", avatarHint: "vr headset" }
    }
];

export default function EducationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Educación</h1>
        <p className="text-lg text-muted-foreground mt-2">
          La base de conocimiento libre y universal de la Red. Aprende, crea y comparte.
        </p>
      </div>

       <Card className="glass-card p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Pide a la IA que te enseñe algo..." className="pl-9 h-12 text-base" />
                </div>
                <Button size="lg" className="shadow-lg shadow-primary/30">
                    Navegador de Conocimiento Inteligente
                </Button>
            </div>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline">Contenido Destacado</h2>
        <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar Contenido
        </Button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educationalFeed.map((item) => (
            <ContentCard key={item.id} content={item} />
        ))}
      </div>
    </div>
  );
}

