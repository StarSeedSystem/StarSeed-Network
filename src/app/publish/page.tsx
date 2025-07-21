
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, PenSquare, Paperclip, X, Gavel, AtSign, Tags, Tag, Users, GraduationCap, Sparkles, Handshake, BookOpen, Shield } from "lucide-react";
import { AudienceSelector } from "@/components/publish/AudienceSelector";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LibraryGrid, LibraryItem } from "@/components/profile/LibraryGrid";
import Image from "next/image";
import { LegislativeSettings } from "@/components/publish/LegislativeSettings";
import { NewsSettings } from "@/components/publish/NewsSettings";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FederatedEntitySettings } from "@/components/publish/FederatedEntitySettings";
import { cn } from "@/lib/utils";

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

const categories = {
    culture: [
        { id: "art", label: "Arte" },
        { id: "music", label: "Música" },
        { id: "social_event", label: "Evento Social" },
        { id: "environment", label: "Medio Ambiente" },
        { id: "philosophy", label: "Filosofía" },
    ],
    education: [
        { id: "science", label: "Ciencia" },
        { id: "technology", label: "Tecnología" },
        { id: "history", label: "Historia" },
        { id: "economics", label: "Economía" },
    ]
}

type MainArea = 'politics' | 'culture' | null;

export default function PublishPage() {
    const [content, setContent] = useState("");
    const [selectedArea, setSelectedArea] = useState<MainArea>(null);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["profile"]);
    const [isCreatingVote, setIsCreatingVote] = useState(false);
    const [isNews, setIsNews] = useState(false);
    const [attachedItem, setAttachedItem] = useState<LibraryItem | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    
    // Politics specific state
    const [federationArea, setFederationArea] = useState<string | null>(null);
    const isFederationSelected = selectedDestinations.some(id => id.startsWith('federation'));

    const { toast } = useToast();

    const handlePublish = () => {
        if (!content.trim() && !attachedItem) {
            toast({ variant: "destructive", title: "Contenido Vacío", description: "No puedes transmitir un mensaje vacío." });
            return;
        }
        if (selectedDestinations.length === 0) {
            toast({ variant: "destructive", title: "Sin Destino", description: "Por favor, selecciona al menos un destino." });
            return;
        }

        console.log("Publicando:", { content, area: selectedArea, destinations: selectedDestinations, attachedItem, isCreatingVote, isNews, federationArea });
        toast({ title: "¡Transmisión Exitosa!", description: `Tu mensaje ha sido difundido a: ${selectedDestinations.join(', ')}.` });
        
        // Reset state
        setContent("");
        setAttachedItem(null);
        setIsNews(false);
        setIsCreatingVote(false);
        setSelectedArea(null);
        setSelectedDestinations([]);
        setFederationArea(null);
    };
    
    const handleItemSelected = (item: LibraryItem) => {
        setAttachedItem(item);
        setIsLibraryOpen(false);
    };

    const handleDestinationChange = (selectedIds: string[]) => {
        setSelectedDestinations(selectedIds);
        if (!selectedIds.some(id => id.startsWith('federation'))) {
             setFederationArea(null);
        }
    };

    const isLegislativeProposal = isFederationSelected && federationArea === 'legislative' && isCreatingVote;
    const currentCategories = selectedArea === 'culture' ? categories.culture : categories.education;

    const renderStep2 = () => (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-in fade-in-50">
            <div className="md:col-span-2 space-y-4">
                <div>
                    <h3 className="text-lg font-headline font-semibold mb-2">Paso 2: Contenido de la Transmisión</h3>
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-card/80">
                            <TabsTrigger value="content"><PenSquare className="h-4 w-4 mr-2" />Editor</TabsTrigger>
                            <TabsTrigger value="tags"><AtSign className="h-4 w-4 mr-2" />Menciones y Hashtags</TabsTrigger>
                        </TabsList>
                        <TabsContent value="content" className="mt-4 p-4 rounded-lg border bg-background/50">
                                <Textarea
                                placeholder="Escribe tu mensaje aquí..."
                                className="min-h-[250px] text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </TabsContent>
                        <TabsContent value="tags" className="mt-4 space-y-4 p-4 rounded-lg border bg-background/50">
                            <div className="space-y-2">
                                <Label htmlFor="mentions" className="flex items-center gap-2"><AtSign className="h-4 w-4 text-primary" />Mencionar Usuarios o Grupos</Label>
                                <Input id="mentions" placeholder="@starlight, @innovacion-sostenible..." />
                            </div>
                                <div className="space-y-2">
                                <Label htmlFor="hashtags" className="flex items-center gap-2"><Tags className="h-4 w-4 text-primary" />Añadir Hashtags</Label>
                                <Input id="hashtags" placeholder="#sostenibilidad, #IA, #democracia..." />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {attachedItem && (
                    <div className="relative group">
                            <CardTitle className="text-sm font-semibold mb-2">Contenido Adjunto</CardTitle>
                            <div className="rounded-lg overflow-hidden relative aspect-video max-h-64 border border-primary/20">
                            <Image src={attachedItem.thumbnail} alt={attachedItem.title} layout="fill" objectFit="cover" data-ai-hint={attachedItem.thumbnailHint} />
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
                    <h3 className="text-lg font-headline font-semibold mb-2">Paso 3: Herramientas y Opciones</h3>
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

                {(selectedArea === 'culture' || selectedArea === 'education') &&
                    <Card className="bg-secondary/20 border-secondary/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="font-headline text-base flex items-center gap-2"><Tag className="h-5 w-5 text-primary"/>Añadir Categorías</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            {currentCategories.map(cat => (
                                <div key={cat.id} className="flex items-center space-x-2">
                                    <Checkbox id={`cat-${cat.id}`} />
                                    <Label htmlFor={`cat-${cat.id}`} className="text-sm font-normal">{cat.label}</Label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                }

                {isFederationSelected && <FederatedEntitySettings onAreaChange={setFederationArea} />}
                    
                <div className="flex items-center space-x-2 rounded-lg border p-3 bg-secondary/40 border-secondary/60">
                    <Checkbox id="add-vote" checked={isCreatingVote} onCheckedChange={(checked) => setIsCreatingVote(!!checked)} />
                    <Label htmlFor="add-vote" className="flex items-center gap-2 font-semibold">
                        <Gavel className="h-4 w-4" />
                        Añadir Votación
                    </Label>
                </div>

                    {isCreatingVote && <LegislativeSettings isLegislativeProposal={isLegislativeProposal} />}
                    {!isCreatingVote && (selectedArea === 'culture' || selectedArea === 'education') && <NewsSettings isNews={isNews} onIsNewsChange={setIsNews} />}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-5xl py-8">
            <Card className="glass-card rounded-2xl">
                <CardHeader>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1 */}
                    {!selectedArea && (
                         <div className="space-y-4 text-center animate-in fade-in-50">
                            <h3 className="text-xl font-headline font-semibold">Paso 1: ¿Cuál es la intención principal de tu publicación?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                <Button variant="outline" className="h-32 flex-col gap-2 text-base" onClick={() => setSelectedArea('culture')}>
                                    <Sparkles className="h-8 w-8 text-primary"/> Cultura
                                </Button>
                                <Button variant="outline" className="h-32 flex-col gap-2 text-base" onClick={() => setSelectedArea('culture')}>
                                    <GraduationCap className="h-8 w-8 text-primary"/> Educación
                                </Button>
                                 <Button variant="outline" className="h-32 flex-col gap-2 text-base" onClick={() => setSelectedArea('politics')}>
                                    <Gavel className="h-8 w-8 text-primary"/> Política
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {selectedArea && (
                        <>
                           <div>
                                <h3 className="text-lg font-headline font-semibold mb-2">Paso 1: Ámbito y Audiencia</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Selecciona dónde resonará tu mensaje.
                                </p>
                                <AudienceSelector 
                                    selectedArea={selectedArea}
                                    selectedDestinations={selectedDestinations} 
                                    onSelectionChange={handleDestinationChange}
                                />
                            </div>
                            {renderStep2()}
                        </>
                    )}
                    
                    {selectedArea && (
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <Button variant="ghost" onClick={() => setSelectedArea(null)}>Volver al Paso 1</Button>
                            <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/30" onClick={handlePublish}>
                                <SendHorizonal className="mr-2 h-5 w-5" />
                                Transmitir al Nexo
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
