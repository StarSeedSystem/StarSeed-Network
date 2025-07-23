

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Award, Book, FileText, GraduationCap, PlusCircle, Tag, Tags, Link as LinkIcon, X } from "lucide-react";
import { Mission, Badge } from "@/types/content-types";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export interface EducationData {
  type: 'education';
  subArea: 'class' | 'article';
  categories: string; // Comma-separated
  prerequisites: string; // Comma-separated links/titles
  missions: Mission[];
}

interface EducationSettingsProps {
  data: EducationData;
  onChange: (data: EducationData) => void;
}

export function EducationSettings({ data, onChange }: EducationSettingsProps) {
  const [newMission, setNewMission] = useState<Partial<Mission>>({});
  const [newBadge, setNewBadge] = useState<Partial<Badge>>({});

  const handleFieldChange = (field: keyof EducationData, value: any) => {
    onChange({ ...data, [field]: value });
  };
  
  const handleSubAreaChange = (value: 'class' | 'article') => {
      onChange({ ...data, subArea: value });
  }

  const handleAddMission = () => {
    if (newMission.title && newMission.description) {
      const missionToAdd: Mission = {
        id: `mission_${Date.now()}`,
        title: newMission.title,
        description: newMission.description,
        type: newMission.type || 'practice',
        badge: newBadge.name ? {
            id: `badge_${Date.now()}`,
            name: newBadge.name,
            icon: newBadge.icon || 'Award',
            description: newBadge.description || `Completaste la misión: ${newMission.title}`
        } : undefined,
      };
      onChange({ ...data, missions: [...data.missions, missionToAdd] });
      setNewMission({});
      setNewBadge({});
    }
  };

  const handleRemoveMission = (index: number) => {
    const newMissions = data.missions.filter((_, i) => i !== index);
    onChange({ ...data, missions: newMissions });
  };

  return (
    <Card className="bg-primary/5 border-primary/20 animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline text-base">
          <GraduationCap className="h-5 w-5" />
          Configuración de Contenido Educativo
        </CardTitle>
        <CardDescription>Añade metadatos para conectar tu conocimiento en la red.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div>
            <Label>Tipo de Contenido</Label>
            <Tabs value={data.subArea} onValueChange={(v) => handleSubAreaChange(v as any)} className="w-full mt-1">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="article"><FileText className="mr-2 h-4 w-4"/>Artículo</TabsTrigger>
                    <TabsTrigger value="class"><Book className="mr-2 h-4 w-4"/>Clase</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categories" className="flex items-center gap-2"><Tags className="h-4 w-4"/>Categorías y Temas</Label>
          <Input id="categories" placeholder="IA, Filosofía, Permacultura..." value={data.categories} onChange={(e) => handleFieldChange("categories", e.target.value)} />
          <p className="text-xs text-muted-foreground">Separa las categorías con comas.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prerequisites" className="flex items-center gap-2"><LinkIcon className="h-4 w-4"/>Requisitos Previos</Label>
          <Input id="prerequisites" placeholder="Introducción a la IA, Ética 101..." value={data.prerequisites} onChange={(e) => handleFieldChange("prerequisites", e.target.value)} />
           <p className="text-xs text-muted-foreground">Nombres de otras clases o artículos, separados por comas.</p>
        </div>

        <div className="space-y-2">
            <Label className="flex items-center gap-2"><Award className="h-4 w-4"/>Misiones e Insignias</Label>
            <p className="text-xs text-muted-foreground">Define tareas y las insignias que se obtienen al completarlas.</p>
            
            <div className="space-y-2">
                {data.missions.map((mission, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-background/50">
                        <div className="flex-grow">
                            <p className="font-semibold">{mission.title}</p>
                            <p className="text-sm text-muted-foreground">{mission.description}</p>
                            {mission.badge && <p className="text-xs text-primary font-medium">Recompensa: Insignia "{mission.badge.name}"</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMission(index)}><X className="h-4 w-4"/></Button>
                    </div>
                ))}
            </div>

            <div className="p-3 rounded-lg border-2 border-dashed space-y-3">
                 <Input placeholder="Título de la nueva misión..." value={newMission.title || ""} onChange={(e) => setNewMission({...newMission, title: e.target.value})} />
                 <Textarea placeholder="Descripción de la misión..." value={newMission.description || ""} onChange={(e) => setNewMission({...newMission, description: e.target.value})} rows={2}/>
                 <Input placeholder="Nombre de la insignia de recompensa (opcional)" value={newBadge.name || ""} onChange={(e) => setNewBadge({...newBadge, name: e.target.value})} />
                 <Button size="sm" variant="outline" onClick={handleAddMission} className="w-full"><PlusCircle className="mr-2 h-4 w-4"/>Añadir Misión</Button>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}

    

    