
"use client";

import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Globe, Users, Landmark, Shield, BookOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type PageType = 'profile' | 'community' | 'federation' | 'study_group' | 'political_party';

export interface UserPage {
    id: string;
    name: string;
    type: PageType;
    areas: string[];
}

const typeIcons: Record<PageType, React.ElementType> = {
    profile: User,
    community: Globe,
    study_group: BookOpen,
    federation: Landmark,
    political_party: Shield,
};

const typeLabels: Record<PageType, string> = {
    profile: "Perfil",
    community: "Comunidad",
    study_group: "G. Estudio",
    federation: "E. Federada",
    political_party: "Partido",
}

interface AudienceSelectorProps {
    availablePages: UserPage[];
    selectedArea: 'politics' | 'culture' | 'education';
    selectedDestinations: UserPage[];
    onSelectionChange: (selectedPages: UserPage[]) => void;
}

export function AudienceSelector({ availablePages, selectedArea, selectedDestinations, onSelectionChange }: AudienceSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<PageType | 'all'>('all');
    
    const handleCheckedChange = (checked: boolean, page: UserPage) => {
        const newSelection = checked 
            ? [...selectedDestinations, page] 
            : selectedDestinations.filter(p => p.id !== page.id);
        onSelectionChange(newSelection);
    };

    const filteredPages = useMemo(() => {
        return availablePages.filter(page => {
            const areaMatch = page.areas.includes(selectedArea);
            const typeMatch = typeFilter === 'all' || page.type === typeFilter;
            const searchMatch = page.name.toLowerCase().includes(searchTerm.toLowerCase());
            return areaMatch && typeMatch && searchMatch;
        });
    }, [availablePages, selectedArea, typeFilter, searchTerm]);
    
    const availableFilters = useMemo(() => {
        const types = new Set(availablePages.filter(p => p.areas.includes(selectedArea)).map(p => p.type));
        return Array.from(types);
    }, [availablePages, selectedArea]);

    return (
        <Card className="bg-background/50 border border-border/50">
            <CardContent className="p-4 space-y-4">
                 <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar en mis páginas..." 
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <div className="flex items-center gap-1 p-1 rounded-lg bg-card/50">
                         <Button 
                            variant={typeFilter === 'all' ? 'secondary' : 'ghost'} 
                            size="sm"
                            onClick={() => setTypeFilter('all')}
                            className="flex-1"
                         >
                             Todos
                         </Button>
                        {availableFilters.map(type => (
                             <Button 
                                key={type}
                                variant={typeFilter === type ? 'secondary' : 'ghost'} 
                                size="sm"
                                onClick={() => setTypeFilter(type)}
                                className="flex-1"
                             >
                                 {typeLabels[type]}
                             </Button>
                        ))}
                    </div>
                </div>

                <ScrollArea className="h-64 pr-3">
                    <div className="space-y-2">
                        {filteredPages.map((page) => {
                            const Icon = typeIcons[page.type];
                            const isChecked = selectedDestinations.some(p => p.id === page.id);
                            return (
                                <div key={page.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors border border-transparent has-[:checked]:bg-primary/10 has-[:checked]:border-primary/20">
                                    <Checkbox 
                                        id={`dest-${page.id}`} 
                                        checked={isChecked}
                                        onCheckedChange={(checked) => handleCheckedChange(!!checked, page)}
                                        className="mt-1"
                                    />
                                    <Label htmlFor={`dest-${page.id}`} className="flex items-center gap-2 cursor-pointer text-sm font-normal w-full">
                                         <Icon className="h-5 w-5 text-primary/80" />
                                         <span>{page.name}</span>
                                    </Label>
                                </div>
                            )
                        })}
                        {filteredPages.length === 0 && (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No se encontraron páginas que coincidan.</p>
                                <p className="text-xs">Intenta ajustar tu búsqueda o filtros.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
