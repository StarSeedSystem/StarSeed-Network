
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

interface PublicPageAgentProps {
    pageName: string;
}

export function PublicPageAgent({ pageName }: PublicPageAgentProps) {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-primary"/>
                    Agente de IA para "{pageName}"
                </CardTitle>
                <CardDescription>
                    Este agente está contextualizado para esta página. Puedes hacerle preguntas sobre su propósito, miembros o contenido.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 bg-card/50 rounded-lg">
                    <h3 className="text-xl font-semibold">Interfaz del Agente en Construcción</h3>
                    <p className="text-muted-foreground mt-2">La funcionalidad completa del agente de IA para páginas públicas estará disponible pronto.</p>
                </div>
            </CardContent>
        </Card>
    );
}
