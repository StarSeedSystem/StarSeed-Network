
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy, DocumentData, limit } from "firebase/firestore"; // Import limit
import { db } from "@/data/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Sparkles, Map, Calendar, Newspaper, Headset, Users } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import type { CulturalContent } from "@/types/content-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// New component for Community Card
function CommunityCard({ community }: { community: DocumentData }) {
    return (
        <Link href={`/community/${community.slug}`} passHref>
            <Card className="glass-card hover:bg-primary/10 transition-colors h-full flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                    <Avatar>
                        <AvatarImage src={community.avatar} />
                        <AvatarFallback>{community.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-lg">{community.name}</CardTitle>
                        <CardDescription>{community.members?.length || 0} Members</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}


export default function CulturePage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [communities, setCommunities] = useState<DocumentData[]>([]); // State for communities
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener for cultural_posts
    const postsQuery = query(collection(db, "cultural_posts"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
    });
    
    // Listener for communities
    const communitiesQuery = query(collection(db, "communities"), limit(6)); // Get a few featured communities
    const unsubscribeCommunities = onSnapshot(communitiesQuery, (snapshot) => {
        setCommunities(snapshot.docs.map(doc => doc.data()));
    });

    return () => {
        unsubscribePosts();
        unsubscribeCommunities();
    };
  }, []);

  return (
    <div className="space-y-8">
       <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="feed" className="rounded-lg py-2 text-base"><Sparkles className="mr-2 h-5 w-5" />Feed Cultural</TabsTrigger>
                <TabsTrigger value="communities" className="rounded-lg py-2 text-base"><Users className="mr-2 h-5 w-5" />Comunidades</TabsTrigger>
                <TabsTrigger value="map" className="rounded-lg py-2 text-base" disabled><Map className="mr-2 h-5 w-5" />Mapa</TabsTrigger>
                <TabsTrigger value="calendar" className="rounded-lg py-2 text-base" disabled><Calendar className="mr-2 h-5 w-5" />Calendario</TabsTrigger>
                <TabsTrigger value="news" className="rounded-lg py-2 text-base" disabled><Newspaper className="mr-2 h-5 w-5" />Noticias</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-headline">Galería Cultural</h2>
                        <p className="text-muted-foreground">El lienzo principal para la expresión de la red.</p>
                    </div>
                    <Button asChild><Link href="/participations/create/cultural-post"><PlusCircle className="mr-2 h-4 w-4" />Publicar Obra</Link></Button>
                </div>

                {isLoading ? ( <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((item) => {
                            const content: CulturalContent = {
                                id: item.id, title: item.title, type: "Creación Cultural",
                                author: { name: item.authorName, avatar: "", avatarHint: "user avatar" },
                                image: item.imageUrl, imageHint: item.title, description: item.description
                            };
                            return <ContentCard key={item.id} content={content} />;
                        })}
                    </div>
                ) : ( <div className="text-center py-16 bg-card/50 rounded-lg"><h3 className="text-xl font-semibold">La Galería Está Vacía</h3><p className="text-muted-foreground mt-2">¡Sé el primero en compartir tu arte y cultura!</p></div> )}
            </TabsContent>

            <TabsContent value="communities" className="mt-6">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-headline">Comunidades de la Red</h2>
                        <p className="text-muted-foreground">Encuentra grupos de interés y colaboración.</p>
                    </div>
                    <Button asChild><Link href="/participations/create/community"><PlusCircle className="mr-2 h-4 w-4" />Crear Comunidad</Link></Button>
                </div>
                {isLoading ? ( <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
                ) : communities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communities.map((community) => <CommunityCard key={community.slug} community={community} />)}
                    </div>
                ) : ( <div className="text-center py-16 bg-card/50 rounded-lg"><h3 className="text-xl font-semibold">No Hay Comunidades</h3><p className="text-muted-foreground mt-2">¡Sé el primero en crear una!</p></div> )}
            </TabsContent>
      </Tabs>
    </div>
  );
}
