
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";

export default function CreateEventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser, profile } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventLongDescription, setEventLongDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser || !profile) {
            toast({ title: "Error", description: "You must be logged in to create an event.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const eventSlug = slugify(eventName);
        if (!eventSlug) {
            toast({ title: "Error", description: "Event name is required.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            const eventRef = doc(db, "events", eventSlug);
            await setDoc(eventRef, {
                id: eventSlug,
                slug: eventSlug,
                name: eventName,
                description: eventDescription,
                longDescription: eventLongDescription,
                date: eventDate,
                location: eventLocation,
                image: `https://placehold.co/1200x400/3a3a3b/ffffff.png?text=${encodeURIComponent(eventName)}`,
                imageHint: "event banner",
                organizer: {
                    name: profile.name,
                    avatar: profile.avatarUrl,
                    avatarHint: "user avatar"
                },
                attendees: [authUser.uid],
                creatorId: authUser.uid,
                createdAt: serverTimestamp(),
            });
            
             toast({
                title: "¡Evento Creado!",
                description: `Tu evento "${eventName}" ha sido publicado.`,
            });
            router.push(`/event/${eventSlug}`);
        } catch (error: any) {
            console.error("Error creating event:", error);
            toast({ title: "Error", description: error.message, variant: "destructive"});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-primary glowing-icon" />
                        Crear un Nuevo Evento
                    </CardTitle>
                    <CardDescription>
                        Organiza un encuentro, taller, o cualquier tipo de actividad para la comunidad.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="event-name">Nombre del Evento</Label>
                            <Input id="event-name" placeholder="Ej: Festival de Música Algorítmica" required value={eventName} onChange={(e) => setEventName(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="event-date">Fecha y Hora</Label>
                                <Input id="event-date" placeholder="Ej: Próximo Sábado, 18:00 UTC" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} disabled={isLoading}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-location">Ubicación</Label>
                                <Input id="event-location" placeholder="Ej: Anfiteatro Virtual 'El Eco'" required value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} disabled={isLoading}/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event-description">Descripción Corta</Label>
                             <Input id="event-description" placeholder="Una breve descripción para la tarjeta del evento." required value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event-long-description">Descripción Larga del Evento</Label>
                            <Textarea id="event-long-description" placeholder="Describe de qué trata el evento, quiénes pueden participar, qué se necesita, etc." required value={eventLongDescription} onChange={(e) => setEventLongDescription(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Publicar Evento
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
