
"use client";

import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface DashboardHeaderProps {
    isEditing: boolean;
    onEditToggle: (isEditing: boolean) => void;
}

export function DashboardHeader({ isEditing, onEditToggle }: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-end">
            <div>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onEditToggle(false)}>
                            <X className="mr-2 h-4 w-4" /> Cancelar
                        </Button>
                        <Button onClick={() => onEditToggle(false)}>
                            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={() => onEditToggle(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar Dashboard
                    </Button>
                )}
            </div>
        </div>
    );
}
