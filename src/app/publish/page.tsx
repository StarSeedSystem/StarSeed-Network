
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "@/data/firebase";

// --- UI Imports ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenSquare, Gavel, GraduationCap, Palette, Send, ArrowRight, Loader2, Info, ListPlus, BarChart2, Table, Link, Vote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// --- Sub-components for a cleaner structure ---
import { AudienceSelector, UserPage } from "@/components/publish/AudienceSelector";
import { LegislativeSettings } from "@/components/publish/LegislativeSettings";
import { NewsSettings } from "@/components/publish/NewsSettings";
import { FederatedEntitySettings } from "@/components/publish/FederatedEntitySettings";
import { PollBlock, PollData } from "@/components/publish/PollBlock";


type Area = "politics" | "culture" | "education";
type Step = "area" | "details" | "canvas";

export default function PublishPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser, profile } = useUser();
    
    // --- State Management ---
    const [step, setStep] = useState<Step>("area");
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myPages, setMyPages] = useState<UserPage[]>([]);
    const [isLoadingPages, setIsLoadingPages] = useState(true);

    // -- Form Data State ---
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedDestinations, setSelectedDestinations] = useState<UserPage[]>([]);
    
    // -- Block Data State --
    const [blocks, setBlocks] = useState<any[]>([]);

    // -- Contextual Settings State --
    const [federationArea, setFederationArea] = useState<string | null>(null);
    const [isLegislative, setIsLegislative] = useState(false);
    const [isNews, setIsNews] = useState(false);
    
    useEffect(() => {
        if (!authUser || !profile) return;

        const fetchUserPages = async () => {
            setIsLoadingPages(true);
            const collectionsToFetch = [
                { name: "communities", type: 'community', areas: ['culture', 'education'] },
                { name: "federated_entities", type: 'federation', areas: ['politics'] },
                { name: "political_parties", type: 'political_party', areas: ['politics'] },
                { name: "study_groups", type: 'study_group', areas: ['education'] },
            ] as const;

            const userAffiliatedPages: UserPage[] = [];

            for (const c of collectionsToFetch) {
                const q = collection(db, c.name);
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.creatorId === authUser.uid || (Array.isArray(data.members) && data.members.includes(authUser.uid))) {
                       userAffiliatedPages.push({ id: doc.id, name: data.name, type: c.type, areas: c.areas });
                    }
                });
            }
            
            const profilePage: UserPage = { id: authUser.uid, name: "Mi Perfil Personal", type: 'profile', areas: ['culture', 'education'] };
            setMyPages([profilePage, ...userAffiliatedPages]);
            setIsLoadingPages(false);
        };
        
        fetchUserPages();

    }, [profile, authUser]);

    useEffect(() => {
        // Automatically add legislative block when conditions are met
        if (isFederationSelected && federationArea === 'legislative' && isLegislative) {
             const hasPollBlock = blocks.some(b => b.type === 'poll');
             if (!hasPollBlock) {
                 handleAddPoll();
             }
        } else {
            // Clean up legislative poll block if conditions are no longer met
             setBlocks(blocks.filter(b => !b.isLegislative));
        }
    }, [isFederationSelected, federationArea, isLegislative]);


    const handleAreaSelect = (area: Area) => {
        setSelectedArea(area);
        setStep("details");
    };

    const handleAddPoll = (isLegislativePoll = false) => {
        const newPoll: PollData = {
            type: 'poll',
            question: '',
            options: [{ text: '' }, { text: '' }],
            isLegislative: isLegislativePoll,
        };
        setBlocks([...blocks, newPoll]);
    };
    
    const updateBlockData = (index: number, data: any) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], ...data };
        setBlocks(newBlocks);
    };

    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!authUser || !profile) {
            toast({ title: "Error de autenticación", description: "Debes estar conectado para publicar.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }
        if (!title.trim() || !content.trim()) {
            toast({ title: "Faltan datos", description: "El título y el contenido son obligatorios.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }
        if (selectedDestinations.length === 0) {
            toast({ title: "Falta destino", description: "Debes seleccionar al menos un destino para tu publicación.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }
         const isFederationSelected = selectedDestinations.some(d => d.type === 'federation');
         if (isFederationSelected && !federationArea) {
            toast({ title: "Falta área de la E.F.", description: "Debes seleccionar un área de destino dentro de la Entidad Federativa.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare blocks for saving, adding initial votes count
            const blocksToSave = blocks.map(block => {
                if (block.type === 'poll') {
                    return {
                        ...block,
                        options: block.options.map((opt: {text: string}) => ({ text: opt.text, votes: 0 })),
                    };
                }
                return block;
            });


            const postData: any = {
                authorId: authUser.uid,
                authorName: profile.name,
                handle: profile.handle,
                avatarUrl: profile.avatarUrl,
                title,
                content,
                area: selectedArea,
                isNews,
                destinations: selectedDestinations.map(d => ({ id: d.id, type: d.type, name: d.name })),
                blocks: blocksToSave,
                comments: 0,
                likes: 0,
                reposts: 0,
                createdAt: serverTimestamp(),
            };
            
            if (isLegislative && isFederationSelected) {
                postData.isLegislative = true;
                // Add legislative settings to the post data from the form if needed
            }


            await addDoc(collection(db, "posts"), postData);
            
            toast({
                title: "Publicación Creada",
                description: "Tu contenido ha sido publicado en los destinos seleccionados.",
            });
            
            const targetPath = selectedArea === 'culture' ? '/culture' : selectedArea === 'education' ? '/education' : '/';
            router.push(targetPath);

        } catch (error) {
            console.error("Error creating post:", error);
            toast({ title: "Error al publicar", description: "Hubo un problema al crear tu publicación.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetFlow = () => {
        setStep("area");
        setSelectedArea(null);
        setTitle("");
        setContent("");
        setSelectedDestinations([]);
        setFederationArea(null);
        setIsLegislative(false);
        setIsNews(false);
        setBlocks([]);
    }
    
    const isFederationSelected = selectedDestinations.some(d => d.type === 'federation');

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-headline text-3xl flex items-center gap-3">
                            <PenSquare className="h-8 w-8 text-primary glowing-icon" />
                            El Lienzo de Creación
                        </CardTitle>
                        {step !== 'area' && <Button variant="link" onClick={resetFlow}>Empezar de nuevo</Button>}
                    </div>
                     <CardDescription>
                        {step === 'area' && "Elige el área principal de tu publicación para empezar."}
                        {step === 'details' && `Publicando en el área de ${selectedArea}. Elige los detalles y el destino.`}
                        {step === 'canvas' && `Estás listo para escribir. Destino: ${selectedDestinations.map(d => d.name).join(', ')}.`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'area' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in-50">
                            <AreaCard icon={Gavel} title="Política" description="Propón leyes, inicia debates y participa en la gobernanza de la red." onClick={() => handleAreaSelect('politics')} />
                            <AreaCard icon={Palette} title="Cultura" description="Comparte tu arte, música, escritos y expresiones creativas." onClick={() => handleAreaSelect('culture')} />
                            <AreaCard icon={GraduationCap} title="Educación" description="Publica tutoriales, artículos de investigación y comparte conocimiento." onClick={() => handleAreaSelect('education')} />
                        </div>
                    )}

                    {step === 'details' && selectedArea && (
                        <div className="space-y-6 animate-in fade-in-50">
                            <div>
                                <h3 className="font-headline text-xl font-semibold mb-2">Paso 2: Elige el Destino</h3>
                                {isLoadingPages ? <Loader2 className="animate-spin" /> :
                                <AudienceSelector 
                                    availablePages={myPages}
                                    selectedArea={selectedArea}
                                    selectedDestinations={selectedDestinations}
                                    onSelectionChange={setSelectedDestinations}
                                />
                                }
                            </div>
                           
                            {isFederationSelected && (
                                 <FederatedEntitySettings onAreaChange={setFederationArea} />
                            )}
                            
                            {isFederationSelected && federationArea === 'legislative' && (
                                <div className="flex items-center space-x-2 p-3 rounded-lg border border-primary/20 bg-primary/10">
                                    <Info className="h-5 w-5 text-primary"/>
                                    <Label htmlFor="add-voting" className="flex-grow">Convertir esta publicación en una Propuesta Legislativa formal (con votación)</Label>
                                    <Switch id="add-voting" checked={isLegislative} onCheckedChange={setIsLegislative} />
                                </div>
                             )}

                            <div className="flex justify-end">
                                <Button size="lg" onClick={() => setStep('canvas')} disabled={selectedDestinations.length === 0 || (isFederationSelected && !federationArea)}>
                                    Siguiente: Escribir Contenido <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'canvas' && selectedArea && (
                         <form onSubmit={handleSubmit} className="animate-in fade-in-50">
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-4">
                                     <div>
                                        <Label htmlFor="title" className="text-lg font-semibold">Título</Label>
                                        <Input id="title" placeholder="El título de tu publicación..." value={title} onChange={(e) => setTitle(e.target.value)} required className="text-xl h-12 mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="content" className="text-lg font-semibold">Contenido Principal</Label>
                                        <Textarea 
                                            id="content"
                                            placeholder="Escribe aquí tu obra maestra..."
                                            className="min-h-[300px] text-base mt-1"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Render blocks */}
                                    <div className="space-y-4">
                                        {blocks.map((block, index) => {
                                            if (block.type === 'poll') {
                                                return <PollBlock 
                                                            key={index} 
                                                            data={block} 
                                                            onChange={(data) => updateBlockData(index, data)} 
                                                            onRemove={() => removeBlock(index)}
                                                            isLegislative={block.isLegislative}
                                                        />
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                     <h3 className="font-headline text-xl font-semibold">Ajustes y Herramientas</h3>
                                     {(selectedArea === 'culture' || selectedArea === 'education') && (
                                         <NewsSettings isNews={isNews} onIsNewsChange={setIsNews} />
                                     )}
                                    
                                     {isLegislative && (
                                         <LegislativeSettings isLegislativeProposal={isLegislative} />
                                     )}
                                    
                                    {/* Tool Palette */}
                                    <Card className="glass-card">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-headline">Añadir Bloques</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-2">
                                            <ToolButton icon={Vote} label="Encuesta" onClick={() => handleAddPoll(false)} disabled={blocks.some(b => b.type === 'poll')}/>
                                            <ToolButton icon={BarChart2} label="Gráfico" disabled/>
                                            <ToolButton icon={Table} label="Tabla" disabled/>
                                            <ToolButton icon={Link} label="Enlace" disabled/>
                                        </CardContent>
                                    </Card>

                                     <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                                        Publicar en la Red
                                     </Button>
                                </div>
                             </div>
                         </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


// --- Helper Components ---
function AreaCard({ icon: Icon, title, description, onClick }: { icon: React.ElementType, title: string, description: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="text-left">
            <Card className="glass-card rounded-2xl h-full p-6 transition-all hover:border-primary/80 hover:shadow-primary/20 hover:scale-105">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-headline text-2xl font-bold">{title}</h3>
                <p className="text-muted-foreground mt-2">{description}</p>
            </Card>
        </button>
    );
}

function ToolButton({ icon: Icon, label, onClick, disabled = false }: { icon: React.ElementType, label: string, onClick?: () => void, disabled?: boolean}) {
    return (
        <Button variant="outline" className="h-auto flex-col p-3 gap-1" onClick={onClick} disabled={disabled}>
            <Icon className="h-5 w-5 text-primary/80" />
            <span className="text-xs">{label}</span>
        </Button>
    )
}
