
"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { collection, collectionGroup, query, where, getDocs, doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Loader2, Folder, Globe, Lock, ArrowLeft, Users, Calendar, File } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BackButton } from "@/components/utils/BackButton";
import { AnyRecommendedPage, AnyEntity, Event } from "@/types/content-types";
import { ConnectionCard } from "@/components/participations/ConnectionCard";
import { LibraryItem } from "@/components/profile/LibraryGrid";
import Image from "next/image";
import { FeedPost } from "@/components/dashboard/FeedPost";

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
];

const collectionsToFetch = [
    { name: "communities", type: 'community' },
    { name: "federated_entities", type: 'federation' },
    { name: "political_parties", type: 'political_party' },
    { name: "study_groups", type: 'study_group' },
    { name: "chat_groups", type: 'chat_group' },
    { name: "events", type: 'event' },
] as const;


export default function CollectionPage() {
    const params = useParams();
    const collectionId = params.id as string;
    
    const [collectionData, setCollectionData] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [pages, setPages] = useState<AnyRecommendedPage[]>([]);
    const [posts, setPosts] = useState<DocumentData[]>([]);
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!collectionId) return;

        const findCollection = async () => {
            setIsLoading(true);
            try {
                // Find the collection and its owner
                const usersQuery = query(collection(db, 'users'));
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

                if (!foundCollection) {
                    console.log("Collection not found");
                    setCollectionData(null);
                    setIsLoading(false);
                    return;
                }
                
                setCollectionData(foundCollection);
                setOwner(collectionOwner);

                // Fetch Pages
                if (foundCollection.pageIds && foundCollection.pageIds.length > 0) {
                    const pagesData: AnyRecommendedPage[] = [];
                    for (const collectionName of collectionsToFetch) {
                        const q = query(collection(db, collectionName.name), where('id', 'in', foundCollection.pageIds));
                        const querySnapshot = await getDocs(q);
                        querySnapshot.forEach(doc => {
                            pagesData.push({ ...doc.data(), type: doc.data().type || collectionName.type } as AnyRecommendedPage);
                        });
                    }
                    setPages(pagesData);
                }

                // Fetch Items (Posts, Library Items etc.)
                const itemIds = foundCollection.itemIds || [];
                if (itemIds.length > 0) {
                    // Fetch Posts
                    const postsQuery = query(collection(db, "posts"), where('id', 'in', itemIds));
                    const postsSnapshot = await getDocs(postsQuery);
                    const postsData = postsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    setPosts(postsData);
                    
                    // Filter hardcoded library items
                    const libraryItemsData = allLibraryItems.filter(item => itemIds.includes(item.id));
                    setItems(libraryItemsData);
                }

            } catch (error) {
                console.error("Error fetching collection:", error);
                setCollectionData(null);
            } finally {
                setIsLoading(false);
            }
        };

        findCollection();
    }, [collectionId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    if (!collectionData) {
        return notFound();
    }
    
    const savedPages = pages.filter(p => p.type !== 'event');
    const savedEvents = pages.filter(p => p.type === 'event');

    return (
        <div className="space-y-6">
            <BackButton />
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <Folder className="h-8 w-8 text-primary"/>
                        {collectionData.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 pt-1">
                       <span>Colección de <span className="font-semibold text-foreground">{owner?.name || '...'}</span></span>
                        {collectionData.privacy === 'public' ? (
                            <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> Pública</span>
                        ) : (
                            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Privada</span>
                        )}
                    </CardDescription>
                </CardHeader>
            </Card>

            {savedPages.length > 0 && (
                <div>
                    <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5"/>Páginas ({savedPages.length})</h2>
                    <div className="space-y-4">
                        {savedPages.map((page) => (
                           <ConnectionCard key={`${page.type}-${page.id}`} item={page} />
                        ))}
                    </div>
                </div>
            )}

            {savedEvents.length > 0 && (
                <div>
                    <h2 className="text-2xl font-headline font-semibold mb-4 mt-8 flex items-center gap-2"><Calendar className="h-5 w-5"/>Eventos ({savedEvents.length})</h2>
                    <div className="space-y-4">
                        {savedEvents.map((page) => (
                           <ConnectionCard key={`${page.type}-${page.id}`} item={page} />
                        ))}
                    </div>
                </div>
            )}
            
            {posts.length > 0 && (
                 <div>
                     <h2 className="text-2xl font-headline font-semibold mb-4 mt-8">Publicaciones Guardadas ({posts.length})</h2>
                    <div className="space-y-6">
                        {posts.map(post => (
                           <FeedPost key={post.id} post={{...post}} />
                        ))}
                    </div>
                </div>
            )}
            
            {items.length > 0 && (
                <div>
                     <h2 className="text-2xl font-headline font-semibold mb-4 mt-8 flex items-center gap-2"><File className="h-5 w-5"/>Archivos ({items.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map(item => (
                            <Card key={item.id} className="glass-card rounded-xl overflow-hidden group h-full flex flex-col">
                                <div className="aspect-square relative">
                                    <Image src={item.thumbnail} alt={item.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={item.thumbnailHint} />
                                </div>
                                <div className="p-3 flex flex-col flex-grow">
                                    <p className="font-semibold truncate">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.type}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {pages.length === 0 && posts.length === 0 && items.length === 0 && (
                 <Card className="glass-card text-center p-12">
                    <p className="text-muted-foreground">Esta colección está vacía.</p>
                 </Card>
            )}
        </div>
    );
}

