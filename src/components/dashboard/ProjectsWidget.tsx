
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaySquare, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Progress } from "../ui/progress";

const projects = [
    {
        title: "Implementación de la Red de Energía Comunitaria",
        status: "En Progreso",
        progress: 65,
        entity: "E.F. Localidad Central"
    },
     {
        title: "Archivo Histórico Digital",
        status: "Completado",
        progress: 100,
        entity: "E.F. Global"
    },
];

export function ProjectsWidget() {
  return (
    <Card className="glass-card rounded-2xl h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            <div className="flex items-center gap-2">
                <PlaySquare className="text-primary" />
                Proyectos Ejecutivos
            </div>
             <Button variant="ghost" size="sm" asChild>
                <Link href="/politics">Ver todo</Link>
            </Button>
        </CardTitle>
        <CardDescription>Seguimiento de los proyectos aprobados por la comunidad.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            {projects.map((proj, index) => (
                <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold">{proj.title}</p>
                        <div className="flex items-center gap-2 text-sm">
                           {proj.status === "Completado" && <CheckCircle className="h-4 w-4 text-sea-green"/>}
                           <span className={proj.status === "Completado" ? "text-sea-green" : "text-electric-lime"}>
                            {proj.status}
                           </span>
                        </div>
                    </div>
                    <Progress value={proj.progress} />
                     <p className="text-xs text-muted-foreground mt-1">{proj.entity}</p>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
