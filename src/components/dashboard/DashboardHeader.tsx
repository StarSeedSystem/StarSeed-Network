
"use client";

import { Button } from "@/components/ui/button";
import { Edit, Save, X, PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
    isEditing: boolean;
    onEditToggle: (isEditing: boolean) => void;
    onAddWidget: () => void;
}

export function DashboardHeader({ isEditing, onEditToggle, onAddWidget }: DashboardHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {isEditing ? (
                <div className="flex flex-wrap gap-2">
                     <Button variant="outline" onClick={onAddWidget}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Widget
                    </Button>
                    <Button variant="outline" onClick={() => onEditToggle(false)}>
                        <X className="mr-2 h-4 w-4" /> Salir del modo edición
                    </Button>
                </div>
            ) : (
                <Button variant="outline" onClick={() => onEditToggle(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar Dashboard
                </Button>
            )}
        </div>
    );
}
