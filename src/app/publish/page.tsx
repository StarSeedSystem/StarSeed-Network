
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenSquare, Gavel, GraduationCap, Palette, Send, ArrowRight, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

// --- Sub-components for a cleaner structure ---
import { AudienceSelector } from "@/components/publish/AudienceSelector";
import { LegislativeSettings } from "@/components/publish/LegislativeSettings";
import { NewsSettings } from "@/components/publish/NewsSettings";
import { FederatedEntitySettings } from "@/components/publish/FederatedEntitySettings";

type Area = "politics" | "culture" | "education";
type Step = "area" | "details" | "canvas";

export default function PublishPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    // --- State Management ---
    const [step, setStep] = useState<Step>("area");
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // -- Form Data State ---
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    
    // -- Contextual Settings State --
    const [federationArea, setFederationArea] = useState<string | null>(null);
    const [isLegislative, setIsLegislative] = useState(false);
    const [isNews, setIsNews] = useState(false);
    

    const handleAreaSelect = (area: Area) => {
        setSelectedArea(area);
        setStep("details");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // --- Validation ---
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
         if (selectedDestinations.some(d => d.includes('federation')) && !federationArea) {
            toast({ title: "Falta área de la E.F.", description: "Debes seleccionar un área de destino dentro de la Entidad Federativa.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        // --- Logic to determine creation path ---
        // For now, this is simplified. We navigate to the corresponding creation page.
        // A more complex system would handle this with a single server action.
        let targetPath = "/";
        let message = "Publicación creada con éxito.";
        
        if (isLegislative) {
            targetPath = "/politics"; // Redirect to political center
            message = "Propuesta legislativa enviada para su debate y votación.";
        } else if (selectedArea === 'culture') {
            targetPath = "/culture";
            message = "Tu obra ha sido publicada en la Galería Cultural.";
        } else if (selectedArea === 'education') {
            targetPath = "/education";
             message = "Tu aporte ha sido publicado en la sección de Educación.";
        }
        
        console.log("Submitting with data:", { title, content, selectedDestinations, federationArea, isLegislative, isNews });
        
        // --- Simulate Submission & Redirect ---
        setTimeout(() => {
            toast({
                title: "Publicación Enviada",
                description: message,
            });
            router.push(targetPath);
            setIsSubmitting(false);
        }, 1500);

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
    }
    
    // Check if any federated entity is selected
    const isFederationSelected = selectedDestinations.some(d => d.includes('federation'));

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
                        {step === 'canvas' && `Estás listo para escribir. Destino: ${selectedDestinations.join(', ')}.`}
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
                                <AudienceSelector 
                                    selectedArea={selectedArea}
                                    selectedDestinations={selectedDestinations}
                                    onSelectionChange={setSelectedDestinations}
                                />
                            </div>
                           
                            {isFederationSelected && (
                                 <FederatedEntitySettings onAreaChange={setFederationArea} />
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
                                </div>
                                <div className="space-y-4">
                                     <h3 className="font-headline text-xl font-semibold">Ajustes de Publicación</h3>
                                     {(selectedArea === 'culture' || selectedArea === 'education') && (
                                         <NewsSettings isNews={isNews} onIsNewsChange={setIsNews} />
                                     )}

                                    {/* Show voting options only if a federation is selected and the federation area is legislative */}
                                     {isFederationSelected && federationArea === 'legislative' && (
                                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-primary/20 bg-primary/10">
                                            <Info className="h-5 w-5 text-primary"/>
                                            <Label htmlFor="add-voting" className="flex-grow">Convertir esta publicación en una Propuesta Legislativa formal (con votación)</Label>
                                            <Switch id="add-voting" checked={isLegislative} onCheckedChange={setIsLegislative} />
                                        </div>
                                     )}
                                     
                                     {isLegislative && (
                                         <LegislativeSettings isLegislativeProposal={isLegislative} />
                                     )}
                                     
                                     <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                             <Send className="mr-2 h-5 w-5" />
                                        )}
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


// --- Helper Component for Area Selection ---
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

    

    