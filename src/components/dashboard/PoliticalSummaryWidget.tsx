
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

const proposals = [
    {
        title: "Ley de Soberanía de Datos Personales",
        status: "En Votación",
        isUrgent: true,
        entity: "E.F. Global"
    },
    {
        title: "Actualización del Protocolo de Verificación",
        status: "Debate Activo",
        isUrgent: false,
        entity: "E.F. Global"
    }
];

export function PoliticalSummaryWidget() {
  return (
    <Card className="glass-card rounded-2xl h-full">
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
      <CardContent>
        <div className="space-y-4">
            {proposals.map((prop, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                    <div>
                        <p className="font-semibold">{prop.title}</p>
                        <p className="text-sm text-muted-foreground">{prop.entity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {prop.isUrgent && <AlertTriangle className="h-5 w-5 text-solar-orange" />}
                        <Badge variant={prop.status === "En Votación" ? "default" : "secondary"}>{prop.status}</Badge>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
