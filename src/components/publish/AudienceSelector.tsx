"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Globe, Users, Landmark, Shield } from "lucide-react";

const destinations = [
    { id: "profile", label: "Mi Perfil Personal", icon: User },
    { id: "community_innovation", label: "Comunidad: Innovación Sostenible", icon: Globe },
    { id: "community_art", label: "Comunidad: Arte Ciberdélico", icon: Users },
    { id: "federation_local", label: "E.F. Localidad Central", icon: Landmark },
    { id: "party_transhumanist", label: "Partido: Futuro Transhumanista", icon: Shield },
];

interface AudienceSelectorProps {
    selectedDestinations: string[];
    onSelectionChange: (selected: string[]) => void;
}

export function AudienceSelector({ selectedDestinations, onSelectionChange }: AudienceSelectorProps) {

    const handleCheckedChange = (checked: boolean, id: string) => {
        if (checked) {
            onSelectionChange([...selectedDestinations, id]);
        } else {
            onSelectionChange(selectedDestinations.filter(destId => destId !== id));
        }
    };

    return (
        <Card className="bg-background/50">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {destinations.map((dest) => (
                    <div key={dest.id} className="flex items-start space-x-3">
                        <Checkbox 
                            id={`dest-${dest.id}`} 
                            checked={selectedDestinations.includes(dest.id)}
                            onCheckedChange={(checked) => handleCheckedChange(!!checked, dest.id)}
                            className="mt-1"
                        />
                        <Label htmlFor={`dest-${dest.id}`} className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                             <dest.icon className="h-5 w-5 text-primary/80" />
                             <span>{dest.label}</span>
                        </Label>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
