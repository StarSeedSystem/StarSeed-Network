
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Bookmark, Landmark, ListFilter, Tag, Folder } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";
import type { UserCollection } from "@/types/content-types";


export interface FilterState {
    entity: string;
    status: string;
    tags: string;
    saved: boolean;
    collection: string;
}

interface AdvancedFilterProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}


export function AdvancedFilter({ filters, onFilterChange }: AdvancedFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { profile } = useUser();

    const handleFieldChange = (field: keyof FilterState, value: string | boolean) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div>
            <Button onClick={() => setIsOpen(!isOpen)} variant="outline" size="lg" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filtro Avanzado
            </Button>

            {isOpen && (
                 <Card className="glass-card mt-4 animate-in fade-in-50">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                           
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm"><Landmark className="h-4 w-4" />Filtrar por Entidad Federativa</Label>
                                <Select 
                                    value={filters.entity} 
                                    onValueChange={(value) => handleFieldChange("entity", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar entidad..." />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card">
                                        <SelectItem value="all">Todas mis entidades</SelectItem>
                                        <SelectItem value="consejo-etica-digital" disabled>Consejo de Ética Digital</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                           
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm"><ListFilter className="h-4 w-4" />Filtrar por Estado (Legislativo)</Label>
                                 <Select 
                                    value={filters.status}
                                    onValueChange={(value) => handleFieldChange("status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar estado..." />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card">
                                        <SelectItem value="all">Todas</SelectItem>
                                        <SelectItem value="active">Activas (debate/votación)</SelectItem>
                                        <SelectItem value="expired">Cerradas (aprobadas/rechazadas)</SelectItem>
                                        <SelectItem value="urgent">Urgentes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                           
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm"><Tag className="h-4 w-4" />Filtrar por Etiquetas</Label>
                                <Input 
                                    placeholder="#soberania, #seguridad..."
                                    value={filters.tags}
                                    onChange={(e) => handleFieldChange("tags", e.target.value)}
                                />
                            </div>

                             <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm"><Folder className="h-4 w-4" />Filtrar por Colección</Label>
                                <Select 
                                    value={filters.collection} 
                                    onValueChange={(value) => handleFieldChange("collection", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar colección..." />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card">
                                        <SelectItem value="all">Todas</SelectItem>
                                        {profile?.collections?.map((c: UserCollection) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 flex flex-col justify-end">
                                 <div className="flex items-center space-x-2 pt-4">
                                    <Switch 
                                        id="saved-filter"
                                        checked={filters.saved}
                                        onCheckedChange={(checked) => handleFieldChange("saved", checked)}
                                    />
                                    <Label htmlFor="saved-filter" className="flex items-center gap-2 cursor-pointer"><Bookmark className="h-4 w-4" />Mostrar solo contenido guardado</Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
