
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, PenSquare, Paperclip, X } from "lucide-react";
import { AudienceSelector } from "@/components/publish/AudienceSelector";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LibraryGrid, LibraryItem } from "@/components/profile/LibraryGrid";
import Image from "next/image";
import { LegislativeSettings } from "@/components/publish/LegislativeSettings";
import { NewsSettings } from "@/components/publish/NewsSettings";

// Mock data for library items, in a real app this would be fetched
const libraryItems: LibraryItem[] = [
    {
        id: "vid_001",
        type: "Video",
        title: "Dragon over forest",
        thumbnail: "https://placehold.co/600x400.png",
        thumbnailHint: "dragon forest",
        source: "/video-generator",
    },
    {
        id: "img_001",
        type: "Avatar",
        title: "AI Symbiote",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "glowing astronaut",
        source: "/avatar-generator",
    }
];

export default function PublishPage() {
    const [content, setContent] = useState("");
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["profile"]);
    const [isLegislative, setIsLegislative] = useState(false);
    const [isNews, setIsNews] = useState(false);
    const [attachedItem, setAttachedItem] = useState<LibraryItem | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const { toast } = useToast();

    const handlePublish = () => {
        if (!content.trim() && !attachedItem) {
            toast({
                variant: "destructive",
                title: "Contenido Vacío",
                description: "No puedes transmitir un mensaje vacío. Escribe algo o adjunta un archivo.",
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

        console.log("Publicando:", { content, destinations: selectedDestinations, attachedItem, isLegislative, isNews });

        toast({
            title: "¡Transmisión Exitosa!",
            description: `Tu mensaje ha sido difundido a: ${selectedDestinations.join(', ')}.`,
        });

        setContent("");
        setAttachedItem(null);
        setIsNews(false);
    };
    
    const handleItemSelected = (item: LibraryItem) => {
        setAttachedItem(item);
        setIsLibraryOpen(false);
    };

    const handleDestinationChange = (selectedIds: string[], isLegislative: boolean) => {
        setSelectedDestinations(selectedIds);
        setIsLegislative(isLegislative);
    };

    return (
        <div className="container mx-auto max-w-5xl py-8">
            <Card className="glass-card rounded-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-2">
                        <PenSquare className="text-primary h-8 w-8 glowing-icon" />
                        Crear Publicación
                    </CardTitle>
                    <CardDescription>
                        Forja tu mensaje en el Lienzo de Creación y difúndelo a través del Nexo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-headline font-semibold mb-2">Paso 1: Intención y Ámbito</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Selecciona dónde resonará tu mensaje. Publicar en una Entidad Federativa activará las opciones de propuesta legislativa.
                        </p>
                        <AudienceSelector 
                            selectedDestinations={selectedDestinations} 
                            onSelectionChange={handleDestinationChange}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-lg font-headline font-semibold mb-2">Paso 2: Contenido de la Transmisión</h3>
                                <div className="p-4 rounded-lg border bg-background/50">
                                    {/* This will eventually become a block editor */}
                                     <Textarea
                                        placeholder="Escribe tu mensaje aquí usando bloques de contenido..."
                                        className="min-h-[250px] text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            </div>
                            {attachedItem && (
                                <div className="relative group">
                                     <CardTitle className="text-sm font-semibold mb-2">Contenido Adjunto</CardTitle>
                                     <div className="rounded-lg overflow-hidden relative aspect-video max-h-64 border border-primary/20">
                                        <Image src={attachedItem.thumbnail} alt={attachedItem.title} layout="fill" objectFit="cover" />
                                     </div>
                                     <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute top-8 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setAttachedItem(null)}
                                    >
                                        <X className="h-4 w-4" />
                                     </Button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4 md:col-span-1">
                             <h3 className="text-lg font-headline font-semibold mb-2">Herramientas</h3>
                             <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                                <DialogTrigger asChild>
                                     <Button variant="outline" disabled={!!attachedItem} className="w-full justify-start">
                                        <Paperclip className="mr-2 h-4 w-4" />
                                        Adjuntar de Biblioteca
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card max-w-4xl h-[80vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Selecciona un Archivo de tu Biblioteca</DialogTitle>
                                        <DialogDescription>
                                            Elige un elemento generado por IA para adjuntarlo a tu publicación.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-grow overflow-auto -mx-6 px-6">
                                         <LibraryGrid items={libraryItems} selectionMode onItemSelected={handleItemSelected} />
                                    </div>
                                </DialogContent>
                            </Dialog>

                             {isLegislative && <LegislativeSettings />}
                             {!isLegislative && <NewsSettings isNews={isNews} onIsNewsChange={setIsNews} />}
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
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

    