
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { QuickAccessWidget } from "./QuickAccessWidget";
import { MyPagesWidget } from "./MyPagesWidget";
import { AchievementsWidget } from "./AchievementsWidget";
import { ProjectsWidget } from "./ProjectsWidget";
import { LearningPathWidget } from "./LearningPathWidget";
import { PoliticalSummaryWidget } from "./PoliticalSummaryWidget";
import { PlusCircle } from "lucide-react";

export interface Widget {
    id: string;
    name: string;
    description: string;
    component: React.ComponentType;
}

export const allWidgets: Widget[] = [
    { id: 'quickAccess', name: "Accesos Rápidos", description: "Navegación principal de la red.", component: QuickAccessWidget },
    { id: 'myPages', name: "Mis Páginas", description: "Tus comunidades y proyectos.", component: MyPagesWidget },
    { id: 'achievements', name: "Logros", description: "Tus insignias y reconocimientos.", component: AchievementsWidget },
    { id: 'projects', name: "Proyectos Ejecutivos", description: "Seguimiento de proyectos aprobados.", component: ProjectsWidget },
    { id: 'learningPath', name: "Ruta de Aprendizaje", description: "Tus cursos y artículos recomendados.", component: LearningPathWidget },
    { id: 'politicalSummary', name: "Resumen Político", description: "Vistazo a propuestas legislativas.", component: PoliticalSummaryWidget },
];

interface WidgetLibraryProps {
    onSelectWidget: (widget: Widget) => void;
}

export function WidgetLibrary({ onSelectWidget }: WidgetLibraryProps) {
    return (
        <div className="space-y-4">
             <CardHeader className="px-1 pt-0">
                <CardTitle>Biblioteca de Widgets</CardTitle>
                <CardDescription>
                    Añade nuevos componentes a tu dashboard para personalizar tu experiencia.
                </CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allWidgets.map(widget => (
                    <Card key={widget.id} className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-lg">{widget.name}</CardTitle>
                            <CardDescription>{widget.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button className="w-full" onClick={() => onSelectWidget(widget)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Añadir al Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
