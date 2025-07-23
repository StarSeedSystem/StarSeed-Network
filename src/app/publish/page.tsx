
"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { db } from "@/data/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check, ArrowLeft, PenSquare, Vote, Gavel, GraduationCap, Sparkles } from "lucide-react";
import { AudienceSelector, UserPage } from "@/components/publish/AudienceSelector";
import { PollBlock, PollData } from "@/components/publish/PollBlock";
import { FederatedEntitySettings } from "@/components/publish/FederatedEntitySettings";
import { NewsSettings } from "@/components/publish/NewsSettings";

type Step = "area" | "context" | "canvas";
type Area = "politics" | "education" | "culture";
type Block = PollData; // Will be extended with more block types

// Mock data for user's pages
const mockAvailablePages: UserPage[] = [
    { id: "user123", name: "Mi Perfil Personal", type: "profile", areas: ["education", "culture"] },
    { id: "innovacion-sostenible", name: "Innovación Sostenible", type: "community", areas: ["education", "culture"] },
    { id: "art-ai-collective", name: "Art-AI Collective", type: "community", areas: ["culture"] },
    { id: "consejo-etica-digital", name: "Consejo de Ética Digital", type: "federation", areas: ["politics"] },
    { id: "partido-conciencia-digital", name: "Partido Conciencia Digital", type: "political_party", areas: ["politics"] },
    { id: "exploradores-cuanticos", name: "Exploradores Cuánticos", type: "study_group", areas: ["education"] },
];

export default function PublishPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser, profile } = useUser();

    // Flow State
    const [step, setStep] = useState<Step>("area");
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [federationArea, setFederationArea] = useState<string | null>(null);

    // Content State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [destinations, setDestinations] = useState<UserPage[]>([]);
    const [isNews, setIsNews] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Derived State
    const isFederationSelected = useMemo(() => destinations.some(d => d.type === 'federation'), [destinations]);
    const isLegislative = useMemo(() => isFederationSelected && federationArea === 'legislative', [isFederationSelected, federationArea]);

    // Effect to manage blocks based on legislative status
    // Ensures poll block is added/removed automatically
    React.useEffect(() => {
        if (isLegislative) {
            // If not already present, add a legislative poll block
            if (!blocks.some(b => b.isLegislative)) {
                setBlocks(prev => [...prev, { type: 'poll', question: 'Propuesta Legislativa', options: [{ text: "A favor" }, { text: "En contra" }], isLegislative: true }]);
            }
        } else {
            // Remove any legislative poll blocks if the context is no longer legislative
            setBlocks(prev => prev.filter(b => !b.isLegislative));
        }
    }, [isLegislative, blocks]);

    const handleAreaSelect = (area: Area) => {
        setSelectedArea(area);
        setStep("context");
    };

    const resetState = () => {
        setStep("area");
        setSelectedArea(null);
        setFederationArea(null);
        setTitle("");
        setContent("");
        setBlocks([]);
        setDestinations([]);
        setIsNews(false);
        setIsLoading(false);
    }

    const addBlock = (type: Block['type']) => {
        if (type === 'poll') {
            setBlocks([...blocks, { type: 'poll', question: '', options: [{ text: "" }, { text: "" }] }]);
        }
    };

    const updateBlockData = useCallback((index: number, data: Block) => {
        const newBlocks = [...blocks];
        newBlocks[index] = data;
        setBlocks(newBlocks);
    }, [blocks]);


    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser || !profile) return toast({ variant: "destructive", title: "Necesitas iniciar sesión para publicar." });
        if (destinations.length === 0) return toast({ variant: "destructive", title: "Por favor, selecciona al menos un destino." });
        if (!title.trim() || !content.trim()) return toast({ variant: "destructive", title: "Por favor, completa el título y el contenido." });
        if (isLegislative && !blocks.some(b => b.isLegislative)) return toast({ variant: "destructive", title: "Las propuestas legislativas deben tener un bloque de votación." });

        setIsLoading(true);

        try {
            await addDoc(collection(db, "posts"), {
                authorId: authUser.uid,
                authorName: profile.name,
                handle: profile.handle,
                avatarUrl: profile.avatarUrl,
                title,
                content,
                blocks,
                destinations: destinations.map(({ id, name, type }) => ({ id, name, type })),
                area: selectedArea,
                subArea: federationArea,
                isNews,
                comments: 0,
                reposts: 0,
                likes: 0,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Éxito", description: "Tu publicación ha sido difundida en la red." });
            router.push('/');
        } catch (error) {
            console.error("Error al publicar:", error);
            toast({ title: "Error", description: "No se pudo crear la publicación.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case "area":
                return (
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Paso 1: Elige un Área</CardTitle>
                            <CardDescription>Selecciona el dominio principal de tu publicación. Esto adaptará las herramientas y opciones disponibles.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button onClick={() => handleAreaSelect("politics")} className="p-6 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors text-center space-y-2 border border-primary/20">
                                <Gavel className="h-10 w-10 mx-auto text-primary" />
                                <h3 className="font-headline text-xl font-semibold">Política</h3>
                                <p className="text-sm text-muted-foreground">Propuestas, leyes y debates para la gobernanza de la red.</p>
                            </button>
                            <button onClick={() => handleAreaSelect("education")} className="p-6 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors text-center space-y-2 border border-primary/20">
                                <GraduationCap className="h-10 w-10 mx-auto text-primary" />
                                <h3 className="font-headline text-xl font-semibold">Educación</h3>
                                <p className="text-sm text-muted-foreground">Comparte conocimiento, tutoriales e investigaciones.</p>
                            </button>
                            <button onClick={() => handleAreaSelect("culture")} className="p-6 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors text-center space-y-2 border border-primary/20">
                                <Sparkles className="h-10 w-10 mx-auto text-primary" />
                                <h3 className="font-headline text-xl font-semibold">Cultura</h3>
                                <p className="text-sm text-muted-foreground">Expresión artística, eventos y creaciones sociales.</p>
                            </button>
                        </CardContent>
                    </Card>
                );
            case "context":
                return (
                    <Card className="glass-card">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setStep('area')}><ArrowLeft className="h-4 w-4"/></Button>
                                <div>
                                    <CardTitle>Paso 2: Define el Contexto y el Ámbito</CardTitle>
                                    <CardDescription>Selecciona dónde y cómo se difundirá tu publicación.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold">Destino(s) de la Publicación</Label>
                                <p className="text-sm text-muted-foreground mb-2">Selecciona las páginas donde quieres que aparezca esta publicación.</p>
                                {selectedArea && (
                                    <AudienceSelector
                                        availablePages={mockAvailablePages}
                                        selectedArea={selectedArea}
                                        selectedDestinations={destinations}
                                        onSelectionChange={setDestinations}
                                    />
                                )}
                            </div>
                            {isFederationSelected && (
                                <FederatedEntitySettings onAreaChange={setFederationArea} />
                            )}
                        </CardContent>
                         <div className="p-6 flex justify-end">
                            <Button size="lg" onClick={() => setStep('canvas')} disabled={destinations.length === 0 || (isFederationSelected && !federationArea)}>
                                Ir al Lienzo de Creación
                            </Button>
                         </div>
                    </Card>
                );
            case "canvas":
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-2 mb-6">
                            <Button variant="outline" size="sm" onClick={() => setStep('context')}><ArrowLeft className="mr-2 h-4 w-4" />Volver al Contexto</Button>
                            <h2 className="text-xl font-headline font-semibold">Paso 3: Lienzo de Creación</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Columna Principal (Editor) */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="glass-card">
                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <Label htmlFor="title" className="sr-only">Title</Label>
                                            <Input id="title" placeholder="Título de la publicación..." value={title} onChange={(e) => setTitle(e.target.value)} required className="text-2xl font-bold font-headline h-auto border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"/>
                                        </div>
                                        <div>
                                            <Label htmlFor="content" className="sr-only">Content</Label>
                                            <Textarea id="content" placeholder="Escribe tu mensaje... Usa la barra de herramientas para añadir bloques interactivos." value={content} onChange={(e) => setContent(e.target.value)} required className="min-h-[250px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-base"/>
                                        </div>
                                    </CardContent>
                                </Card>

                                {blocks.map((block, index) => {
                                    if (block.type === 'poll') {
                                        return <PollBlock key={index} data={block} onChange={(data) => updateBlockData(index, data)} onRemove={() => removeBlock(index)} isLegislative={block.isLegislative} />
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Columna Derecha (Herramientas y Configuración) */}
                            <div className="space-y-6">
                                <Card className="glass-card">
                                    <CardHeader><CardTitle>Herramientas</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        {!isLegislative && (
                                            <Button variant="outline" className="w-full justify-start" onClick={() => addBlock('poll')}>
                                                <Vote className="mr-2 h-4 w-4"/> Añadir Votación/Encuesta
                                            </Button>
                                        )}
                                        <Button variant="outline" className="w-full justify-start" disabled>
                                            <PenSquare className="mr-2 h-4 w-4"/> Añadir Tabla (Próximamente)
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="glass-card">
                                     <CardHeader><CardTitle>Configuración</CardTitle></CardHeader>
                                     <CardContent>
                                         <NewsSettings isNews={isNews} onIsNewsChange={setIsNews} />
                                     </CardContent>
                                </Card>
                                
                                <Button size="lg" type="submit" className="w-full shadow-lg shadow-primary/30" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                    Publicar
                                </Button>
                            </div>
                        </div>
                    </form>
                );
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-headline">Crear Publicación</h1>
                <p className="text-muted-foreground mt-2">Comparte tu visión, conocimiento o creatividad con la red a través del Lienzo de Creación.</p>
            </div>
            {renderStepContent()}
        </div>
    );
}
