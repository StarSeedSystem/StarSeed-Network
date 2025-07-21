"use client";

import { useState, useTransition } from "react";
import { generateVideo } from "@/ai/flows/generate-video";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Clapperboard, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function VideoGeneratorPage() {
    const [prompt, setPrompt] = useState("");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleGenerateVideo = () => {
        if (!prompt.trim()) {
            toast({
                variant: "destructive",
                title: "El prompt está vacío",
                description: "Por favor, introduce un prompt para generar un video.",
            });
            return;
        }

        startTransition(async () => {
            setVideoUrl(null);
            try {
                const result = await generateVideo({ prompt });
                if (result.videoDataUri) {
                    setVideoUrl(result.videoDataUri);
                    toast({
                        title: "¡Video Generado!",
                        description: "Tu nuevo video está listo.",
                    });
                } else {
                     throw new Error("El flujo de IA no devolvió un video.");
                }
            } catch (error) {
                console.error("Error en la generación de video:", error);
                const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
                toast({
                    variant: "destructive",
                    title: "Falló la Generación de Video",
                    description: errorMessage,
                });
            }
        });
    };

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card className="glass-card rounded-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-2">
                        <Clapperboard className="text-primary h-8 w-8 glowing-icon" />
                        Generador de Videos con IA
                    </CardTitle>
                    <CardDescription>
                       Crea impresionantes videos cortos a partir de tus prompts de texto usando el poder de la IA generativa.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                         <Textarea
                            id="video-prompt"
                            placeholder="Ej: Un majestuoso dragón sobrevolando un bosque místico al amanecer."
                            className="min-h-[100px] text-base"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                    <Button onClick={handleGenerateVideo} disabled={isPending} size="lg" className="w-full shadow-lg shadow-primary/30">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generando... (esto puede tardar un minuto)
                            </>
                        ) : (
                             <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generar Video
                            </>
                        )}
                    </Button>

                     {isPending && !videoUrl && (
                        <Alert className="bg-primary/10 border-primary/20 text-center">
                            <Loader2 className="h-5 w-5 text-primary animate-spin mx-auto mb-2" />
                            <AlertTitle className="font-headline text-primary">Tu video se está creando...</AlertTitle>
                            <AlertDescription className="text-foreground/80">
                                La IA está haciendo su magia. Este proceso puede tardar hasta un minuto. Por favor, sé paciente.
                            </AlertDescription>
                        </Alert>
                    )}

                    {videoUrl && (
                         <div className="space-y-4">
                            <h3 className="text-xl font-headline font-semibold text-center">Tu Video Generado</h3>
                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border-2 border-primary">
                                <video
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    loop
                                    className="w-full h-full object-contain"
                                >
                                    Tu navegador no soporta la etiqueta de video.
                                </video>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
