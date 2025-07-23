
"use client";

import { cn } from "@/lib/utils";
import { GripVertical, Settings, X } from "lucide-react";
import { Button } from "../ui/button";

interface WidgetWrapperProps {
    children: React.ReactNode;
    isEditing: boolean;
    onRemove: () => void;
}

export function WidgetWrapper({ children, isEditing, onRemove }: WidgetWrapperProps) {
    return (
        <div className={cn(
            "h-full w-full transition-all duration-300 relative group",
            isEditing && "ring-2 ring-dashed ring-primary/50 rounded-2xl p-1"
        )}>
            {isEditing && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="ghost" size="icon" className="h-7 w-7 cursor-not-allowed">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <div className={cn(
                "h-full w-full",
                isEditing && "pointer-events-none"
            )}>
                 {children}
            </div>
        </div>
    );
}
