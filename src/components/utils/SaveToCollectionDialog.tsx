
"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, Folder, FolderPlus, Globe, Loader2, Lock } from "lucide-react";
import type { UserCollection } from "@/types/content-types";

interface SaveToCollectionDialogProps {
    pageId: string;
    pageName: string;
}

export function SaveToCollectionDialog({ pageId, pageName }: SaveToCollectionDialogProps) {
    const { user, profile } = useUser();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<string>("");
    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionPrivacy, setNewCollectionPrivacy] = useState<"public" | "private">("private");
    const [isCreating, setIsCreating] = useState(false);

    if (!user) return null;

    const collections: UserCollection[] = profile?.collections || [];
    const isPageInAnyCollection = collections.some(c => c.pageIds.includes(pageId));

    const handleSave = async () => {
        if (!selectedCollection || !user) return;
        setIsCreating(true);

        const collection = collections.find(c => c.id === selectedCollection);
        if (!collection) return;
        
        const isAlreadyInCollection = collection.pageIds.includes(pageId);
        const newCollections = collections.map(c => {
            if (c.id === selectedCollection) {
                return {
                    ...c,
                    pageIds: isAlreadyInCollection ? c.pageIds.filter(id => id !== pageId) : [...c.pageIds, pageId]
                };
            }
            return c;
        });

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { collections: newCollections });
            toast({ title: isAlreadyInCollection ? "Página eliminada de la colección" : "Página guardada en la colección" });
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error al guardar" });
        } finally {
            setIsCreating(false);
        }
    };
    
    const handleCreateAndSave = async () => {
        if (!newCollectionName.trim() || !user) return;
        setIsCreating(true);

        const newCollection: UserCollection = {
            id: `coll_${Date.now()}`,
            name: newCollectionName.trim(),
            pageIds: [pageId],
            privacy: newCollectionPrivacy,
        };
        const newCollections = [...collections, newCollection];

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { collections: newCollections });
            toast({ title: "Colección creada y página guardada" });
            setIsOpen(false);
            setNewCollectionName("");
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error al crear la colección" });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant={isPageInAnyCollection ? "secondary" : "outline"} size="icon">
                    <Bookmark className={isPageInAnyCollection ? "fill-current" : ""} />
                    <span className="sr-only">Guardar Página</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
                <DialogHeader>
                    <DialogTitle>Guardar "{pageName}" en una Colección</DialogTitle>
                    <DialogDescription>Organiza tus páginas favoritas en colecciones públicas o privadas.</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="collection-select" className="flex items-center gap-2"><Folder className="h-4 w-4"/>Añadir a Colección Existente</Label>
                         <div className="flex gap-2 mt-2">
                             <Select onValueChange={setSelectedCollection}>
                                <SelectTrigger id="collection-select">
                                    <SelectValue placeholder="Seleccionar colección..." />
                                </SelectTrigger>
                                <SelectContent className="glass-card">
                                    {collections.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSave} disabled={!selectedCollection || isCreating}>
                                {isCreating && <Loader2 className="animate-spin mr-2"/>}
                                Guardar
                            </Button>
                         </div>
                    </div>

                    <div className="text-center text-muted-foreground text-sm">o</div>

                    <div className="space-y-3">
                         <Label className="flex items-center gap-2"><FolderPlus className="h-4 w-4"/>Crear Nueva Colección</Label>
                         <Input 
                            placeholder="Nombre de la nueva colección..."
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                         />
                        <div className="flex gap-2">
                             <Select onValueChange={(v: "public" | "private") => setNewCollectionPrivacy(v)} defaultValue="private">
                                <SelectTrigger>
                                    <SelectValue placeholder="Privacidad..."/>
                                </SelectTrigger>
                                <SelectContent className="glass-card">
                                    <SelectItem value="private"><div className="flex items-center gap-2"><Lock className="h-4 w-4"/>Privada</div></SelectItem>
                                    <SelectItem value="public"><div className="flex items-center gap-2"><Globe className="h-4 w-4"/>Pública</div></SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleCreateAndSave} disabled={!newCollectionName.trim() || isCreating}>
                                 {isCreating && <Loader2 className="animate-spin mr-2"/>}
                                Crear y Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
