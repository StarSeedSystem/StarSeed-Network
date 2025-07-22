
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Landmark, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function CreateFederatedEntityPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [entityName, setEntityName] = useState("");
    const [entityDescription, setEntityDescription] = useState("");
    const [entityLongDescription, setEntityLongDescription] = useState("");
    const [entityScope, setEntityScope] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", description: "You must be logged in.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const entitySlug = slugify(entityName);
        if (!entitySlug || !entityScope) {
            toast({ title: "Invalid Data", description: "Entity name and scope are required.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        
        try {
            const entityRef = doc(db, "federated_entities", entitySlug);
            await setDoc(entityRef, {
                id: entitySlug,
                slug: entitySlug,
                name: entityName,
                description: entityDescription,
                longDescription: entityLongDescription,
                scope: entityScope,
                type: "federation",
                avatar: `https://avatar.vercel.sh/${entitySlug}.png`,
                avatarHint: "entity logo",
                banner: `https://placehold.co/1200x400/6a6a6b/ffffff.png?text=${encodeURIComponent(entityName)}`,
                bannerHint: "entity banner",
                members: [authUser.uid],
                creatorId: authUser.uid,
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Federated Entity Created!",
                description: `The entity "${entityName}" has been established.`,
            });
            router.push(`/federated-entity/${entitySlug}`);
        } catch (error: any) {
            console.error("Error creating federated entity:", error);
            toast({ title: "Error", description: error.message, variant: "destructive"});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <Landmark className="h-8 w-8 text-primary glowing-icon" />
                        Establish a Federated Entity
                    </CardTitle>
                    <CardDescription>
                        Create a formal, structured entity within the network (e.g., a council, institution, or official body).
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="entity-name">Official Name of the Entity</Label>
                            <Input id="entity-name" placeholder="Ej: Consejo de Ética Digital" required value={entityName} onChange={(e) => setEntityName(e.target.value)} disabled={isLoading}/>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label htmlFor="entity-slug">URL Identifier (Automatic)</Label>
                               <Input id="entity-slug" placeholder="consejo-etica-digital" disabled value={slugify(entityName)} />
                           </div>
                             <div className="space-y-2">
                               <Label htmlFor="entity-scope">Scope</Label>
                               <Select required onValueChange={setEntityScope} disabled={isLoading}>
                                 <SelectTrigger id="entity-scope">
                                     <SelectValue placeholder="Select scope..." />
                                 </SelectTrigger>
                                 <SelectContent className="glass-card">
                                     <SelectItem value="Global">Global</SelectItem>
                                     <SelectItem value="Local">Local</SelectItem>
                                 </SelectContent>
                               </Select>
                           </div>
                       </div>
                        <div className="space-y-2">
                            <Label htmlFor="entity-description">Mandate / Public Description</Label>
                            <Input id="entity-description" placeholder="A short summary of the entity's purpose." required value={entityDescription} onChange={(e) => setEntityDescription(e.target.value)} disabled={isLoading} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="entity-long-description">Full Mandate / Charter</Label>
                            <Textarea id="entity-long-description" placeholder="Describe the full mandate, responsibilities, and structure of the entity." required value={entityLongDescription} onChange={(e) => setEntityLongDescription(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Establish Entity
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
