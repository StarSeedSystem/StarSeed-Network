

"use client";

import * as React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { db } from "@/data/firebase";
import { addDoc, collection, serverTimestamp, query, where, getDocs, DocumentData } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check, ArrowLeft, PenSquare, Vote, Gavel, GraduationCap, Sparkles, Book, FileText, Folder, Layers } from "lucide-react";
import { AudienceSelector, UserPage } from "@/components/publish/AudienceSelector";
import { PollBlock, PollData } from "@/components/publish/PollBlock";
import { FederatedEntitySettings } from "@/components/publish/FederatedEntitySettings";
import { NewsSettings } from "@/components/publish/NewsSettings";
import { LegislativeSettings, LegislativeData } from "@/components/publish/LegislativeSettings";
import { PageHeader } from "@/components/layout/PageHeader";
import { EducationSettings, EducationData } from "@/components/publish/EducationSettings";
import { KnowledgeNetwork, ViewMode } from "@/components/education/KnowledgeNetwork";
import { KnowledgeNode } from "@/types/content-types";
import knowledgeData from "@/data/knowledge-network.json";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


type Step = "area" | "context" | "canvas";
type Area = "politics" | "education" | "culture";
type EducationSubArea = 'class' | 'article';
type Block = PollData | EducationData;

export default function PublishPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser, profile } = useUser();

    // Flow State
    const [step, setStep] = useState<Step>("area");
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [federationArea, setFederationArea] = useState<string | null>(null);
    const [educationSubArea, setEducationSubArea] = useState<EducationSubArea | null>(null);
    const [availablePages, setAvailablePages] = useState<UserPage[]>([]);
    
    // Knowledge Network State
    const [allNodes, setAllNodes] = useState<KnowledgeNode[]>([]);
    const [categoryNodes, setCategoryNodes] = useState<KnowledgeNode[]>([]);
    const [topicNodes, setTopicNodes] = useState<KnowledgeNode[]>([]);
    const [knowledgeViewMode, setKnowledgeViewMode] = useState<ViewMode>('list');

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

    useEffect(() => {
        const allNodesData = knowledgeData.nodes as KnowledgeNode[];
        setAllNodes(allNodesData);
        setCategoryNodes(allNodesData.filter(node => node.type === 'category'));
        
        // Use a Map to ensure unique nodes when flattening for the topics network
        const topicsAndConceptsMap = new Map<string, KnowledgeNode>();
        const findTopicsRecursive = (nodes: KnowledgeNode[]) => {
            for (const node of nodes) {
                if (node.type === 'topic' || node.type === 'concept') {
                    if (!topicsAndConceptsMap.has(node.id)) {
                        topicsAndConceptsMap.set(node.id, node);
                    }
                }
                if (node.children) {
                    findTopicsRecursive(node.children);
                }
            }
        }
        findTopicsRecursive(allNodesData);
        const topicsAndConcepts = Array.from(topicsAndConceptsMap.values());
        setTopicNodes(topicsAndConcepts);


        const fetchUserPages = async () => {
            if (!authUser || !profile) return;

            setIsLoading(true);
            const userPages: UserPage[] = [];

            userPages.push({
                id: authUser.uid,
                name: "Mi Perfil Personal",
                type: "profile",
                areas: ["education", "culture", "politics"]
            });

            const collectionsToQuery = [
                { name: "communities", type: 'community', areas: ["education", "culture"] },
                { name: "federated_entities", type: 'federation', areas: ["politics"] },
                { name: "political_parties", type: 'political_party', areas: ["politics"] },
                { name: "study_groups", type: 'study_group', areas: ["education"] },
            ] as const;

            for (const { name, type, areas } of collectionsToQuery) {
                const q = query(collection(db, name), where('members', 'array-contains', authUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    userPages.push({
                        id: doc.id,
                        name: data.name,
                        type: type,
                        areas: areas
                    });
                });
            }
            
            setAvailablePages(userPages);
            setIsLoading(false);
        };

        fetchUserPages();

    }, [authUser, profile]);

    const handleFederationAreaChange = useCallback((area: string | null) => {
        setFederationArea(area);
        
        const isNowLegislative = destinations.some(d => d.type === 'federation') && area === 'legislative';

        setBlocks(prevBlocks => {
            const hasLegislativeBlock = prevBlocks.some(b => b.type === 'poll' && b.isLegislative);
            if (isNowLegislative && !hasLegislativeBlock) {
                return [...prevBlocks, { type: 'poll', question: '', options: [{ text: "A favor" }, { text: "En contra" }], isLegislative: true, legislativeData: {} }];
            } else if (!isNowLegislative && hasLegislativeBlock) {
                return prevBlocks.filter(b => b.type !== 'poll' || !b.isLegislative);
            }
            return prevBlocks;
        });

    }, [destinations]);

    const handleAreaSelect = (area: Area) => {
        setSelectedArea(area);
        if (area === 'education') {
            const educationBlock: EducationData = { type: 'education', subArea: 'article', categories: '', prerequisites: '', missions: [] };
            setBlocks([educationBlock]);
        }
        setStep("context");
    };
    
    const handleNextToCanvas = () => {
        if (selectedArea === 'education' && destinations.length === 0) {
            return toast({ variant: "destructive", title: "Por favor, selecciona al menos una categoría o tema."});
        }
        if (selectedArea !== 'education' && destinations.length === 0) {
            return toast({ variant: "destructive", title: "Por favor, selecciona al menos un destino para la publicación." });
        }
        setStep("canvas");
    };

    const addBlock = useCallback((type: 'poll') => {
        if (type === 'poll') {
            setBlocks(prev => [...prev, { type: 'poll', question: '', options: [{ text: "" }, { text: "" }] }]);
        }
    }, []);

    const updateBlockData = useCallback((index: number, data: Block) => {
        setBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks[index] = data;
            if (data.type === 'education') {
                setEducationSubArea(data.subArea);
            }
            return newBlocks;
        });
    }, []);

    const removeBlock = useCallback((index: number) => {
        setBlocks(prev => prev.filter((_, i) => i !== index));
    }, []);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser || !profile) return toast({ variant: "destructive", title: "Necesitas iniciar sesión para publicar." });
        if (destinations.length === 0) return toast({ variant: "destructive", title: "Por favor, selecciona al menos un destino o categoría." });
        if (!title.trim() || !content.trim()) return toast({ variant: "destructive", title: "Por favor, completa el título y el contenido." });
        if (isLegislative && !blocks.some(b => b.type === 'poll' && b.isLegislative)) return toast({ variant: "destructive", title: "Las propuestas legislativas deben tener un bloque de votación." });
        
        setIsLoading(true);

        const subArea = selectedArea === 'education' ? educationSubArea : federationArea;

        try {
            await addDoc(collection(db, "posts"), {
                authorId: authUser.uid,
                authorName: profile.name,
                handle: profile.handle,
                avatarUrl: profile.avatarUrl,
                title,
                content,
                blocks: blocks,
                destinations: destinations.map(({ id, name, type }) => ({ id, name, type })),
                area: selectedArea,
                subArea: subArea,
                isNews,
                comments: 0,
                reposts: 0,
                likes: 0,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Éxito", description: "Tu publicación ha sido difundida en la red." });
            router.push(`/${selectedArea}`);
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
                           {selectedArea === 'education' ? (
                                <div>
                                    <Label className="text-base font-semibold">Conectar a la Red de Conocimiento</Label>
                                    <p className="text-sm text-muted-foreground mb-2">Selecciona las categorías y temas con los que se relaciona tu contenido.</p>
                                    <Tabs defaultValue="categories">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="categories"><Folder className="mr-2 h-4 w-4"/>Categorías</TabsTrigger>
                                            <TabsTrigger value="topics"><FileText className="mr-2 h-4 w-4"/>Temas</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="categories" className="mt-4">
                                            <KnowledgeNetwork 
                                                nodes={categoryNodes}
                                                allNodes={allNodes}
                                                posts={[]}
                                                viewMode={knowledgeViewMode} 
                                                networkType="category"
                                                selectionMode={true}
                                                selectedDestinations={destinations}
                                                onSelectionChange={setDestinations}
                                            />
                                        </TabsContent>
                                        <TabsContent value="topics" className="mt-4">
                                            <KnowledgeNetwork 
                                                nodes={topicNodes}
                                                allNodes={allNodes}
                                                posts={[]}
                                                viewMode={knowledgeViewMode} 
                                                networkType="topic"
                                                selectionMode={true}
                                                selectedDestinations={destinations}
                                                onSelectionChange={setDestinations}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </div>
                           ) : (
                                <div>
                                    <Label className="text-base font-semibold">Destino(s) de la Publicación</Label>
                                    <p className="text-sm text-muted-foreground mb-2">Selecciona las páginas donde quieres que aparezca esta publicación.</p>
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin"/></div>
                                    ) : selectedArea && (
                                        <AudienceSelector
                                            availablePages={availablePages}
                                            selectedArea={selectedArea}
                                            selectedDestinations={destinations}
                                            onSelectionChange={setDestinations}
                                        />
                                    )}
                                </div>
                           )}
                            {selectedArea === 'politics' && isFederationSelected && (
                                <FederatedEntitySettings onAreaChange={handleFederationAreaChange} />
                            )}
                        </CardContent>
                         <div className="p-6 flex justify-end">
                            <Button size="lg" onClick={handleNextToCanvas}>
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
                                        return <PollBlock key={index} data={block} onChange={(data) => updateBlockData(index, data as PollData)} onRemove={() => removeBlock(index)} isLegislative={block.isLegislative} />
                                    }
                                    if (block.type === 'education') {
                                        return <EducationSettings key={index} data={block} onChange={(data) => updateBlockData(index, data as EducationData)} />
                                    }
                                    return null;
                                })}
                            </div>

                            <div className="space-y-6">
                                <Card className="glass-card">
                                    <CardHeader><CardTitle>Herramientas</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        {selectedArea !== 'education' && !isLegislative && (
                                            <Button variant="outline" className="w-full justify-start" onClick={() => addBlock('poll')}>
                                                <Vote className="mr-2 h-4 w-4"/> Añadir Votación/Encuesta
                                            </Button>
                                        )}
                                        <Button variant="outline" className="w-full justify-start" disabled>
                                            <PenSquare className="mr-2 h-4 w-4"/> Añadir Tabla (Próximamente)
                                        </Button>
                                    </CardContent>
                                </Card>
                                
                                {selectedArea === 'politics' && (
                                    <Card className="glass-card">
                                        <CardHeader><CardTitle>Configuración Política</CardTitle></CardHeader>
                                        <CardContent>
                                            <NewsSettings isNews={isNews} onIsNewsChange={setIsNews} />
                                        </CardContent>
                                    </Card>
                                )}
                                
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
        <div className="space-y-6">
            <PageHeader 
                title="Crear Publicación"
                subtitle="Comparte tu visión, conocimiento o creatividad con la red."
            />
            {renderStepContent()}
        </div>
    );
}
