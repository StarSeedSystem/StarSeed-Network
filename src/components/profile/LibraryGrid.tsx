

"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Video, Image as ImageIcon, PlusCircle, CheckCircle, Folder, LayoutGrid, X, File, FolderPlus, Bookmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { SaveToCollectionDialog } from "../utils/SaveToCollectionDialog";
import { useUser } from "@/context/UserContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/data/firebase";

export interface LibraryItem {
    id: string;
    type: "Video" | "Avatar" | "Image" | string;
    title: string;
    thumbnail: string;
    thumbnailHint: string;
    source: string;
    folderId?: string;
}

export interface LibraryFolder {
    id: string;
    name: string;
}

interface LibraryGridProps {
    selectionMode?: boolean;
    onItemSelected?: (item: LibraryItem) => void;
}

const typeIcons = {
    Video: <Video className="h-4 w-4" />,
    Avatar: <ImageIcon className="h-4 w-4" />,
    Image: <ImageIcon className="h-4 w-4" />,
}

// Placeholder data for generated content. In a real app, this would come from a database.
const initialLibraryItems: LibraryItem[] = [
    {
        id: "vid_001",
        type: "Video",
        title: "Dragon over forest",
        thumbnail: "https://placehold.co/600x400.png",
        thumbnailHint: "dragon forest",
        source: "/video-generator",
        folderId: "folder_videos"
    },
    {
        id: "img_001",
        type: "Avatar",
        title: "AI Symbiote",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "glowing astronaut",
        source: "/avatar-generator",
        folderId: "folder_avatars"
    },
];

const initialFolders: LibraryFolder[] = [
    { id: "folder_proyectos", name: "Proyectos en Curso" },
    { id: "folder_avatars", name: "Mis Avatares" },
    { id: "folder_videos", name: "Videos Generados" },
];


export function LibraryGrid({ selectionMode = false, onItemSelected }: LibraryGridProps) {
    const { user, profile } = useUser();
    const [items, setItems] = useState<LibraryItem[]>(initialLibraryItems); // Placeholder for now
    const [folders, setFolders] = useState<LibraryFolder[]>(profile?.libraryFolders || initialFolders);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [isAddingFolder, setIsAddingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    
    // In a real app, we would fetch items from Firestore
    useEffect(() => {
        // const q = query(collection(db, `users/${user.uid}/library`));
        // const unsubscribe = onSnapshot(q, (snapshot) => ...);
        // For now, we'll just use the placeholder data.
        setIsLoading(false);
    }, [user]);


    const handleItemClick = (item: LibraryItem) => {
        if (selectionMode && onItemSelected) {
            setSelectedId(item.id);
            onItemSelected(item);
        }
    };

    const handleAddNewFolder = () => {
        if(newFolderName.trim() !== "") {
            const newFolder: LibraryFolder = {
                id: `folder_${Date.now()}`,
                name: newFolderName,
            };
            setFolders([...folders, newFolder]);
            // Here you would also update the user's profile in Firestore
            setNewFolderName("");
            setIsAddingFolder(false);
        }
    };
    
    const filteredItems = useMemo(() => {
        if (!activeFolderId) return items;
        return items.filter(item => item.folderId === activeFolderId);
    }, [activeFolderId, items]);

    const renderItemCard = (item: LibraryItem) => {
        const isSelected = selectedId === item.id;
        const cardContent = (
             <Card className={cn(
                "glass-card rounded-xl overflow-hidden group h-full flex flex-col",
                selectionMode && "cursor-pointer",
                isSelected && "ring-2 ring-primary border-primary"
            )}>
                <div className="aspect-square relative">
                    <Image src={item.thumbnail} alt={item.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={item.thumbnailHint} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                        {!selectionMode && <SaveToCollectionDialog itemId={item.id} pageName={item.title}/>}
                    </div>
                    <div className="absolute bottom-2 left-2 text-white">
                        <div className="flex items-center gap-1.5 text-xs bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                            {typeIcons[item.type as keyof typeof typeIcons] || <File className="h-4 w-4" />}
                            <span>{item.type}</span>
                        </div>
                    </div>
                    {isSelected && (
                         <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                    )}
                </div>
                <div className="p-3 flex flex-col flex-grow">
                    <p className="font-semibold truncate">{item.title}</p>
                    {!selectionMode && (
                        <Link href={item.source} passHref>
                             <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary mt-auto pt-1">
                                Creado con {item.source.split('-')[0].replace('/', '')}
                            </Button>
                        </Link>
                    )}
                </div>
            </Card>
        );

        if (selectionMode) {
             return (
                <div onClick={() => handleItemClick(item)} key={item.id}>
                    {cardContent}
                </div>
            );
        }

        return <div key={item.id}>{cardContent}</div>;
    }


    return (
        <Card className="glass-card bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="font-headline">Mi Biblioteca</CardTitle>
                <CardDescription>Tu ecosistema personal de apps, archivos y creaciones de IA.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar de Carpetas */}
                    <aside className="md:col-span-1 space-y-4">
                        <h3 className="font-headline text-lg font-semibold px-2">Carpetas</h3>
                        <div className="space-y-1">
                           <Button 
                                variant={!activeFolderId ? 'secondary' : 'ghost'} 
                                className="w-full justify-start"
                                onClick={() => setActiveFolderId(null)}
                            >
                                <LayoutGrid className="mr-2 h-4 w-4"/> Todos los Archivos
                            </Button>
                           {folders.map(folder => (
                                <Button 
                                    key={folder.id}
                                    variant={activeFolderId === folder.id ? 'secondary' : 'ghost'} 
                                    className="w-full justify-start"
                                    onClick={() => setActiveFolderId(folder.id)}
                                >
                                    <Folder className="mr-2 h-4 w-4" /> {folder.name}
                                </Button>
                           ))}
                           {isAddingFolder ? (
                                <div className="p-2 space-y-2">
                                    <Input 
                                        placeholder="Nombre de la carpeta..."
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddNewFolder()}
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" size="sm" onClick={() => setIsAddingFolder(false)}>Cancelar</Button>
                                        <Button size="sm" onClick={handleAddNewFolder}>Crear</Button>
                                    </div>
                                </div>
                           ) : (
                                <Button variant="outline" className="w-full justify-start" onClick={() => setIsAddingFolder(true)}>
                                    <FolderPlus className="mr-2 h-4 w-4" /> Nueva Carpeta
                                </Button>
                           )}
                        </div>
                    </aside>

                    {/* Grilla de Contenido */}
                    <main className="md:col-span-3">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
                        ) : filteredItems.length > 0 ? (
                            <div className={cn(
                                "grid gap-4",
                                selectionMode 
                                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                                )}>
                                {filteredItems.map(renderItemCard)}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg h-full flex flex-col justify-center items-center">
                                <p className="font-semibold text-lg">Esta carpeta está vacía.</p>
                                <p className="text-sm">Añade archivos o crea contenido para verlo aquí.</p>
                            </div>
                        )}
                    </main>
                </div>
            </CardContent>
        </Card>
    );
}
