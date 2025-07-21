
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Globe, Users, Landmark, Shield } from "lucide-react";

const destinations = [
    { id: "profile", label: "Mi Perfil Personal", icon: User, type: "personal" },
    { id: "community_innovation", label: "Comunidad: Innovación Sostenible", icon: Globe, type: "community" },
    { id: "community_art", label: "Comunidad: Arte Ciberdélico", icon: Users, type: "community" },
    { id: "federation_local", label: "E.F. Localidad Central", icon: Landmark, type: "federation" },
    { id: "party_transhumanist", label: "Partido: Futuro Transhumanista", icon: Shield, type: "party" },
];

interface AudienceSelectorProps {
    selectedDestinations: string[];
    onSelectionChange: (selectedIds: string[], isFederationSelected: boolean) => void;
}

export function AudienceSelector({ selectedDestinations, onSelectionChange }: AudienceSelectorProps) {
    
    const handleCheckedChange = (checked: boolean, id: string) => {
        const newSelection = checked 
            ? [...selectedDestinations, id] 
            : selectedDestinations.filter(destId => destId !== id);
        
        const isFederationSelected = newSelection.some(destId => {
            const dest = destinations.find(d => d.id === destId);
            return dest?.type === 'federation';
        });

        onSelectionChange(newSelection, isFederationSelected);
    };

    return (
        <Card className="bg-background/50">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((dest) => (
                    <div key={dest.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors">
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
