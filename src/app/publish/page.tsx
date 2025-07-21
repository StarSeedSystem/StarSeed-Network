"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, PenSquare, Paperclip } from "lucide-react";
import { AudienceSelector } from "@/components/publish/AudienceSelector";
import { useToast } from "@/hooks/use-toast";

export default function PublishPage() {
    const [content, setContent] = useState("");
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["profile"]);
    const { toast } = useToast();

    const handlePublish = () => {
        if (!content.trim()) {
            toast({
                variant: "destructive",
                title: "Contenido Vacío",
                description: "No puedes transmitir un mensaje vacío.",
            });
            return;
        }
        if (selectedDestinations.length === 0) {
            toast({
                variant: "destructive",
                title: "Sin Destino",
                description: "Por favor, selecciona al menos un destino para tu publicación.",
            });
            return;
        }

        console.log("Publicando:", { content, destinations: selectedDestinations });

        toast({
            title: "¡Transmisión Exitosa!",
            description: "Tu mensaje ha sido difundido en el Nexo.",
        });

        setContent("");
        // Reset destinations in a real app might be more complex
    };

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card className="glass-card rounded-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-2">
                        <PenSquare className="text-primary h-8 w-8 glowing-icon" />
                        Crear Publicación
                    </CardTitle>
                    <CardDescription>
                        Forja tu mensaje y difúndelo a través del Nexo. ¿Qué quieres compartir con el universo hoy?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-headline font-semibold mb-2">Paso 1: Intención y Ámbito</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Selecciona dónde resonará tu mensaje. Puedes elegir múltiples destinos para una máxima difusión.
                        </p>
                        <AudienceSelector 
                            selectedDestinations={selectedDestinations} 
                            onSelectionChange={setSelectedDestinations}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-headline font-semibold mb-2">Paso 2: Contenido de la Transmisión</h3>
                         <Textarea
                            placeholder="Escribe tu mensaje aquí. Puedes usar un editor avanzado para añadir imágenes, videos, y más..."
                            className="min-h-[200px] text-base"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button variant="outline">
                            <Paperclip className="mr-2 h-4 w-4" />
                            Adjuntar Archivo de Biblioteca
                        </Button>
                        <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/30" onClick={handlePublish}>
                            <SendHorizonal className="mr-2 h-5 w-5" />
                            Transmitir al Nexo
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
