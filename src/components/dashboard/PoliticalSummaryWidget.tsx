
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

const proposals = [
    {
        id: "prop-001",
        title: "Ley de Soberanía de Datos Personales",
        status: "En Votación",
        isUrgent: true,
        entity: "E.F. Global"
    },
    {
        id: "prop-002",
        title: "Actualización del Protocolo de Verificación",
        status: "Debate Activo",
        isUrgent: false,
        entity: "Consejo de Ética Digital"
    },
    {
        id: "prop-003",
        title: "Fondo Universal para Creadores de Contenido",
        status: "En Votación",
        isUrgent: false,
        entity: "Partido de la Conciencia Digital"
    },
    {
        id: "prop-004",
        title: "Ratificación de Estándares de Interoperabilidad VR",
        status: "En Votación",
        isUrgent: false,
        entity: "E.F. Global"
    },
    {
        id: "prop-005",
        title: "Regulación de Mercados Predictivos Descentralizados",
        status: "Debate Activo",
        isUrgent: true,
        entity: "Consejo de Ética Digital"
    }
];

export function PoliticalSummaryWidget() {
  return (
    <Card className="glass-card rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Gavel className="text-primary" />
                Resumen Político
            </div>
            <Button variant="ghost" size="sm" asChild>
                <Link href="/politics">Ver todo</Link>
            </Button>
        </CardTitle>
        <CardDescription>Vistazo rápido a las propuestas legislativas más relevantes.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex-col min-h-0">
        <ScrollArea className="flex-grow -mx-4">
            <div className="space-y-4 px-4">
                {proposals.map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                        <div>
                            <p className="font-semibold truncate">{prop.title}</p>
                            <p className="text-sm text-muted-foreground">{prop.entity}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                            {prop.isUrgent && <AlertTriangle className="h-5 w-5 text-solar-orange" />}
                            <Badge variant={prop.status === "En Votación" ? "default" : "secondary"}>{prop.status}</Badge>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
