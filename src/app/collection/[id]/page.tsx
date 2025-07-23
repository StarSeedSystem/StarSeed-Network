
"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { collection, collectionGroup, query, where, getDocs, doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Loader2, Folder, Globe, Lock, ArrowLeft } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/utils/BackButton";
import { AnyRecommendedPage } from "@/types/content-types";
import { ConnectionCard } from "@/components/participations/ConnectionCard";
import { LibraryGrid, LibraryItem } from "@/components/profile/LibraryGrid";

// Hardcoded library items for now
const allLibraryItems: LibraryItem[] = [
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
    {
        id: "img_002",
        type: "Avatar",
        title: "Ciber-Druida",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "cyber druid",
        source: "/avatar-generator",
        folderId: "folder_avatars"
    },
    {
        id: "img_003",
        type: "Image",
        title: "Logo para 'Innovación Sostenible'",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "green logo",
        source: "/agent",
        folderId: "folder_proyectos"
    }
];


export default function CollectionPage() {
    const params = useParams();
    const collectionId = params.id as string;
    
    const [collectionData, setCollectionData] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [pages, setPages] = useState<AnyRecommendedPage[]>([]);
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!collectionId) return;

        const findCollection = async () => {
            setIsLoading(true);
            const usersQuery = query(collectionGroup(db, 'users'));
            const usersSnapshot = await getDocs(usersQuery);
            
            let foundCollection = null;
            let collectionOwner = null;

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                if (userData.collections) {
                    const matchedCollection = userData.collections.find((c: any) => c.id === collectionId);
                    if (matchedCollection) {
                        foundCollection = matchedCollection;
                        collectionOwner = userData;
                        break;
                    }
                }
            }

            if (foundCollection) {
                setCollectionData(foundCollection);
                setOwner(collectionOwner);

                // Fetch pages
                if (foundCollection.pageIds && foundCollection.pageIds.length > 0) {
                     const collectionsToFetch = ["communities", "federated_entities", "political_parties", "study_groups", "chat_groups", "events"];
                     const pagesData: AnyRecommendedPage[] = [];

                     for (const collectionName of collectionsToFetch) {
                         const q = query(collection(db, collectionName), where('id', 'in', foundCollection.pageIds));
                         const querySnapshot = await getDocs(q);
                         querySnapshot.forEach(doc => {
                             pagesData.push({ ...doc.data(), type: doc.data().type || collectionName.slice(0, -1) } as AnyRecommendedPage);
                         });
                     }
                    setPages(pagesData);
                }

                // Filter library items
                if (foundCollection.itemIds && foundCollection.itemIds.length > 0) {
                    const itemData = allLibraryItems.filter(item => foundCollection.itemIds.includes(item.id));
                    setItems(itemData);
                }

            } else {
                notFound();
            }
             setIsLoading(false);
        };

        findCollection();
    }, [collectionId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    if (!collectionData) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            <BackButton />
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <Folder className="h-8 w-8 text-primary"/>
                        {collectionData.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                       <span>Colección de <span className="font-semibold text-foreground">{owner?.name || '...'}</span></span>
                        {collectionData.privacy === 'public' ? (
                            <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> Pública</span>
                        ) : (
                            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Privada</span>
                        )}
                    </CardDescription>
                </CardHeader>
            </Card>

            {pages.length > 0 && (
                <div>
                    <h2 className="text-2xl font-headline font-semibold mb-4">Páginas en esta colección ({pages.length})</h2>
                    <div className="space-y-4">
                        {pages.map((page) => (
                           <ConnectionCard key={`${page.type}-${page.id}`} item={page} />
                        ))}
                    </div>
                </div>
            )}
            
            {items.length > 0 && (
                <div>
                     <h2 className="text-2xl font-headline font-semibold mb-4 mt-8">Archivos en esta colección ({items.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map(item => (
                            <LibraryGrid items={[item]} folders={[]} key={item.id} />
                        ))}
                    </div>
                </div>
            )}

            {pages.length === 0 && items.length === 0 && (
                 <Card className="glass-card text-center p-12">
                    <p className="text-muted-foreground">Esta colección está vacía.</p>
                </Card>
            )}
        </div>
    );
}
