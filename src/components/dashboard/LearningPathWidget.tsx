
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

const learningItems = [
    {
        title: "Introducción a las Redes Descentralizadas",
        type: "Curso",
        image: "https://placehold.co/600x400.png",
        imageHint: "network nodes",
    },
    {
        title: "Biomimética y Diseño Sostenible",
        type: "Artículo",
        image: "https://placehold.co/600x400.png",
        imageHint: "leaf structure",
    },
    {
        title: "Filosofía del Posthumanismo",
        type: "Debate",
        image: "https://placehold.co/600x400.png",
        imageHint: "philosophy statue",
    },
    {
        title: "Taller de Prompt-Craft Avanzado",
        type: "Taller",
        image: "https://placehold.co/600x400.png",
        imageHint: "ai art generation",
    },
    {
        title: "Fundamentos de la Gobernanza Ontocrática",
        type: "Lectura",
        image: "https://placehold.co/600x400.png",
        imageHint: "ancient scroll",
    },
    {
        title: "Simulación de Economías Circulares",
        type: "Simulación",
        image: "https://placehold.co/600x400.png",
        imageHint: "circular economy diagram",
    }
];

export function LearningPathWidget() {
  return (
    <Card className="glass-card rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            <div className="flex items-center gap-2">
                <GraduationCap className="text-primary" />
                Ruta de Aprendizaje
            </div>
             <Button variant="ghost" size="sm" asChild>
                <Link href="/education">Ver todo</Link>
            </Button>
        </CardTitle>
        <CardDescription>Continúa tu viaje de conocimiento.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <ScrollArea className="flex-grow -mx-2">
          <div className="space-y-4 px-2">
              {learningItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-primary/10">
                      <div className="w-20 h-16 rounded-lg overflow-hidden relative shrink-0">
                          <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="group-hover:scale-110 transition-transform" data-ai-hint={item.imageHint}/>
                      </div>
                      <div className="flex-grow">
                          <p className="text-xs text-muted-foreground">{item.type}</p>
                          <p className="font-semibold leading-tight">{item.title}</p>
                      </div>
                  </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
