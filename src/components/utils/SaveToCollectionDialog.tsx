

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
    pageId?: string;
    itemId?: string;
    pageName: string; // Used for the title, can be page name or item name
}

export function SaveToCollectionDialog({ pageId, itemId, pageName }: SaveToCollectionDialogProps) {
    const { user, profile } = useUser();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<string>("");
    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionPrivacy, setNewCollectionPrivacy] = useState<"public" | "private">("private");
    const [isCreating, setIsCreating] = useState(false);

    if (!user) return null;

    const collections: UserCollection[] = profile?.collections || [];
    const isPageInAnyCollection = pageId ? collections.some(c => c.pageIds.includes(pageId)) : false;
    const isItemInAnyCollection = itemId ? collections.some(c => c.itemIds?.includes(itemId)) : false;
    const isSaved = isPageInAnyCollection || isItemInAnyCollection;


    const handleSave = async () => {
        if (!selectedCollection || !user || (!pageId && !itemId)) return;
        
        setIsCreating(true);

        const collection = collections.find(c => c.id === selectedCollection);
        if (!collection) return;
        
        const isPageInCollection = pageId ? collection.pageIds.includes(pageId) : false;
        const isItemInCollection = itemId ? collection.itemIds?.includes(itemId) : false;
        const isAlreadyInCollection = isPageInCollection || isItemInCollection;

        const newCollections = collections.map(c => {
            if (c.id === selectedCollection) {
                const newPageIds = pageId 
                    ? (isPageInCollection ? c.pageIds.filter(id => id !== pageId) : [...c.pageIds, pageId])
                    : c.pageIds;
                
                const newItemIds = itemId
                    ? (isItemInCollection ? (c.itemIds || []).filter(id => id !== itemId) : [...(c.itemIds || []), itemId])
                    : (c.itemIds || []);

                return { ...c, pageIds: newPageIds, itemIds: newItemIds };
            }
            return c;
        });

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { collections: newCollections });
            toast({ title: isAlreadyInCollection ? "Eliminado de la colección" : "Guardado en la colección" });
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error al guardar" });
        } finally {
            setIsCreating(false);
        }
    };
    
    const handleCreateAndSave = async () => {
        if (!newCollectionName.trim() || !user || (!pageId && !itemId)) return;
        setIsCreating(true);

        const newCollection: UserCollection = {
            id: `coll_${Date.now()}`,
            name: newCollectionName.trim(),
            pageIds: pageId ? [pageId] : [],
            itemIds: itemId ? [itemId] : [],
            privacy: newCollectionPrivacy,
        };
        const newCollections = [...collections, newCollection];

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { collections: newCollections });
            toast({ title: "Colección creada y elemento guardado" });
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
                 <Button variant={isSaved ? "secondary" : "outline"} size="icon" className="h-8 w-8">
                    <Bookmark className={isSaved ? "fill-current" : ""} />
                    <span className="sr-only">Guardar</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
                <DialogHeader>
                    <DialogTitle>Guardar "{pageName}" en una Colección</DialogTitle>
                    <DialogDescription>Organiza tus páginas y archivos favoritos en colecciones.</DialogDescription>
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
