
"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, Users, Lock } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";

const privacyOptions = [
    { id: "privacy-profile-pic", label: "Foto de Perfil" },
    { id: "privacy-bio", label: "Descripción / Biografía" },
    { id: "privacy-natal-chart", label: "Carta Natal Astrológica" },
    { id: "privacy-friends-list", label: "Lista de Amigos/Contactos" },
    { id: "privacy-communities", label: "Lista de Comunidades" },
    { id: "privacy-badges", label: "Insignias y Logros" },
];

export function PrivacySettings() {

    const renderOptions = (level: string, icon: React.ReactNode) => (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold">
                {icon}
                {level}
            </div>
            {privacyOptions.map(opt => (
                <div key={`${opt.id}-${level}`} className="flex items-center justify-between ml-6">
                    <Label htmlFor={`${opt.id}-${level}`} className="text-sm font-normal text-muted-foreground">
                        {opt.label}
                    </Label>
                    <Switch id={`${opt.id}-${level}`} />
                </div>
            ))}
        </div>
    );

    return (
        <>
            <CardContent>
                <div className="space-y-4 p-4 rounded-lg border bg-background/50">
                    <p className="text-sm text-muted-foreground">
                        Para cada elemento de tu perfil, elige quién puede verlo. Los ajustes se aplican de la opción más restrictiva a la más abierta.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {renderOptions("Solo Yo", <Lock className="h-4 w-4" />)}
                        {renderOptions("Solo Amigos", <Users className="h-4 w-4" />)}
                        {renderOptions("Público", <Globe className="h-4 w-4" />)}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button>Guardar Ajustes de Privacidad</Button>
            </CardFooter>
        </>
    );
}
