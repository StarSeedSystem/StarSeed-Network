
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
                <CardTitle className="flex items-center gap-2 text-secondary-foreground font-headline text-base">
                    <Landmark className="h-5 w-5 text-primary" />
                    Ajustes de Entidad Federativa
                </CardTitle>
                <CardDescription>Especifica el área de destino dentro de la E.F. seleccionada.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="federation-area">Área de Destino</Label>
                    <Select onValueChange={onAreaChange} required>
                        <SelectTrigger id="federation-area">
                            <SelectValue placeholder="Seleccionar área..." />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                            <SelectItem value="legislative">Legislativo (Leyes y Votaciones)</SelectItem>
                            <SelectItem value="executive">Ejecutivo (Proyectos y Comunicados)</SelectItem>
                            <SelectItem value="judicial">Judicial (Casos y Disputas)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}

    