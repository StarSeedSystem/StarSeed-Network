
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Globe, Users, Landmark, Shield, BookOpen } from "lucide-react";

// Mock data simulating pages the user is a member of.
// In a real app, this would be fetched based on the logged-in user.
const userPages = [
    { id: "profile", label: "Mi Perfil Personal", icon: User, areas: ['culture', 'education'] },
    { id: "community_innovation", label: "Comunidad: Innovación Sostenible", icon: Globe, areas: ['culture', 'education', 'politics'] },
    { id: "community_art", label: "Comunidad: Art-AI Collective", icon: Users, areas: ['culture'] },
    { id: "group_philosophy", label: "Grupo Estudio: Exploradores Cuánticos", icon: BookOpen, areas: ['education'] },
    { id: "federation_local", label: "E.F. Localidad Central", icon: Landmark, areas: ['politics'] },
    { id: "federation_global", label: "E.F. Global", icon: Landmark, areas: ['politics'] },
    { id: "party_transhumanist", label: "Partido: Conciencia Digital", icon: Shield, areas: ['politics'] },
];

interface AudienceSelectorProps {
    selectedArea: 'politics' | 'culture' | 'education';
    selectedDestinations: string[];
    onSelectionChange: (selectedIds: string[]) => void;
}

export function AudienceSelector({ selectedArea, selectedDestinations, onSelectionChange }: AudienceSelectorProps) {
    
    const handleCheckedChange = (checked: boolean, id: string) => {
        // For politics, only allow single selection. For others, allow multiple.
        if (selectedArea === 'politics') {
            onSelectionChange(checked ? [id] : []);
        } else {
            const newSelection = checked 
                ? [...selectedDestinations, id] 
                : selectedDestinations.filter(destId => destId !== id);
            onSelectionChange(newSelection);
        }
    };

    const availableDestinations = userPages.filter(dest => {
        return dest.areas && dest.areas.includes(selectedArea);
    });

    return (
        <Card className="bg-background/50">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDestinations.map((dest) => (
                    <div key={dest.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors border border-transparent has-[:checked]:bg-primary/10 has-[:checked]:border-primary/20">
                        <Checkbox 
                            id={`dest-${dest.id}`} 
                            checked={selectedDestinations.includes(dest.id)}
                            onCheckedChange={(checked) => handleCheckedChange(!!checked, dest.id)}
                            className="mt-1"
                        />
                        <Label htmlFor={`dest-${dest.id}`} className="flex items-center gap-2 cursor-pointer text-sm font-normal w-full">
                             <dest.icon className="h-5 w-5 text-primary/80" />
                             <span>{dest.label}</span>
                        </Label>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
