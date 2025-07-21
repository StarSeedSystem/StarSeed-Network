
"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";

const notificationOptions = [
    { id: "mentions", label: "Menciones y Respuestas" },
    { id: "messages", label: "Nuevos Mensajes Directos" },
    { id: "proposals", label: "Nuevas Propuestas en tus Entidades" },
    { id: "votes", label: "Resultados de Votaciones Importantes" },
    { id: "community", label: "Actividad en tus Comunidades" },
];

export function NotificationSettings() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Preferencias Guardadas",
            description: "Tus ajustes de notificación han sido actualizados.",
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold">Canales</h3>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications" className="font-normal">Notificaciones por Email</Label>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="push-notifications" className="font-normal">Notificaciones Push</Label>
                        <Switch id="push-notifications" defaultChecked />
                    </div>
                </div>

                <Separator />
                
                <div className="space-y-4">
                     <h3 className="font-semibold">Notificarme sobre...</h3>
                     {notificationOptions.map(option => (
                        <div key={option.id} className="flex items-center justify-between">
                            <Label htmlFor={`notif-${option.id}`} className="font-normal">{option.label}</Label>
                            <Switch id={`notif-${option.id}`} defaultChecked />
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Guardar Cambios</Button>
            </CardFooter>
        </form>
    );
}
