
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FolderKanban, History, PlusCircle, Search } from "lucide-react";
import type { ActiveContext } from "@/app/agent/page";

const projects = [
    { 
        id: 'proj-1',
        title: "Escribir artículo sobre Permacultura",
        description: "Proyecto para investigar y redactar un artículo completo sobre los principios y la historia de la permacultura."
    },
    { 
        id: 'proj-2',
        title: "Crear Entorno VR 'Bosque de Cristal'",
        description: "Espacio de trabajo para la co-creación de un nuevo entorno virtual con el agente."
     },
];

const history = [
    { 
        id: 'hist-1',
        title: "Análisis de imagen: Planta de interior",
        description: "Conversación sobre la identificación y cuidado de una planta."
     },
    { 
        id: 'hist-2',
        title: "Generación de avatar: 'Ciber-Druida'",
        description: "Proceso de creación de un nuevo avatar."
    },
];

interface AgentSidebarProps {
    activeContextId: string;
    onContextChange: (context: ActiveContext) => void;
}

export function AgentSidebar({ activeContextId, onContextChange }: AgentSidebarProps) {
    
    const handleNewProject = () => {
        onContextChange({
            id: `proj-${Date.now()}`,
            type: 'project',
            title: 'Nuevo Proyecto sin Título',
            description: 'Define el objetivo de este nuevo proyecto de colaboración con tu agente.'
        });
    }

    const handleNewChat = () => {
         onContextChange({
            id: 'new-chat',
            type: 'new',
            title: 'Exocórtex Digital',
            description: 'Tu compañero de IA proactivo para la co-creación, automatización y exploración.'
        });
    }

    const renderListItem = (item: {id: string, title: string, description: string}, type: 'project' | 'history') => (
        <button
            key={item.id}
            onClick={() => onContextChange({ ...item, type })}
            className={cn(
                "w-full text-left p-2 rounded-lg hover:bg-primary/10 transition-colors",
                activeContextId === item.id && "bg-primary/20"
            )}
        >
            <p className="font-semibold text-sm truncate">{item.title}</p>
            <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        </button>
    );
    
    return (
        <div className="h-full flex flex-col glass-card rounded-2xl p-4 space-y-4">
             <Button onClick={handleNewProject} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Iniciar Nuevo Proyecto
            </Button>
            
            <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Buscar proyectos o historial..." className="pl-9 bg-background/50" />
            </div>

            <ScrollArea className="flex-1 -mx-2">
                <div className="px-2 space-y-4">
                    <div>
                        <h3 className="text-base font-headline font-semibold flex items-center gap-2 text-primary mb-2">
                            <FolderKanban className="h-5 w-5" />
                            Proyectos
                        </h3>
                        <div className="space-y-1">
                            {projects.map(p => renderListItem(p, 'project'))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-headline font-semibold flex items-center gap-2 text-primary mb-2">
                            <History className="h-5 w-5" />
                            Historial
                        </h3>
                         <div className="space-y-1">
                            {history.map(h => renderListItem(h, 'history'))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
