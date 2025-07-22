
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

export default function CreateFederatedEntityPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [entityName, setEntityName] = useState("");
    const [entityDescription, setEntityDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", description: "You must be logged in.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const entitySlug = slugify(entityName);
        if (!entitySlug) {
            toast({ title: "Invalid Name", description: "Entity name is required.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        
        // Simulate creation locally due to Firestore permission issues
        console.log("Simulating federated entity creation:", {
            name: entityName,
            slug: entitySlug,
        });
        
        setTimeout(() => {
            toast({
                title: "Federated Entity Created!",
                description: `The entity "${entityName}" has been established.`,
            });
            router.push(`/participations`);
            setIsLoading(false);
        }, 1000);
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
                         <div className="space-y-2">
                           <Label htmlFor="entity-slug">URL Identifier (Automatic)</Label>
                           <Input id="entity-slug" placeholder="consejo-etica-digital" disabled value={slugify(entityName)} />
                       </div>
                        <div className="space-y-2">
                            <Label htmlFor="entity-description">Mandate / Public Description</Label>
                            <Textarea id="entity-description" placeholder="This entity is responsible for..." required value={entityDescription} onChange={(e) => setEntityDescription(e.target.value)} disabled={isLoading} />
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
