
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark } from "lucide-react";

interface FederatedEntitySettingsProps {
    onAreaChange: (area: string | null) => void;
}

export function FederatedEntitySettings({ onAreaChange }: FederatedEntitySettingsProps) {
    return (
        <Card className="bg-secondary/20 border-secondary/40 animate-in fade-in-50">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-secondary-foreground font-headline">
                    <Landmark className="h-5 w-5 text-primary" />
                    Ajustes de E.F.
                </CardTitle>
                <CardDescription>Especifica el área de destino dentro de la Entidad Federativa.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="federation-area">Área de Destino</Label>
                    <Select onValueChange={onAreaChange}>
                        <SelectTrigger id="federation-area">
                            <SelectValue placeholder="Seleccionar área..." />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                            <SelectItem value="legislative">Legislativo (Propuestas)</SelectItem>
                            <SelectItem value="executive">Ejecutivo (Proyectos, Anuncios)</SelectItem>
                            <SelectItem value="judicial">Judicial (Casos, Disputas)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
