
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Perfil Guardado",
            description: "Tu información pública ha sido actualizada.",
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Nombre de Usuario</Label>
                    <Input id="displayName" defaultValue="Starlight" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="handle">Handle</Label>
                    <Input id="handle" defaultValue="@starlight.eth" disabled />
                     <p className="text-xs text-muted-foreground">
                        Tu handle es un identificador único y no puede ser cambiado.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea 
                        id="bio" 
                        defaultValue="Digital nomad exploring the intersections of consciousness and technology. Co-creating the future in the StarSeed Nexus."
                        className="min-h-[120px]"
                    />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Guardar Cambios</Button>
            </CardFooter>
        </form>
    );
}
