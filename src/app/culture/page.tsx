
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Sparkles, Map, Calendar, Newspaper, Headset } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import type { CulturalContent } from "@/types/content-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CulturePage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const culturalPostsCollection = collection(db, "cultural_posts");
    const q = query(culturalPostsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setPosts(postsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching cultural posts: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
       <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="feed" className="rounded-lg py-2 text-base">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Feed Cultural
                </TabsTrigger>
                <TabsTrigger value="map" className="rounded-lg py-2 text-base" disabled><Map className="mr-2 h-5 w-5" />Mapa</TabsTrigger>
                <TabsTrigger value="calendar" className="rounded-lg py-2 text-base" disabled><Calendar className="mr-2 h-5 w-5" />Calendario</TabsTrigger>
                <TabsTrigger value="news" className="rounded-lg py-2 text-base" disabled><Newspaper className="mr-2 h-5 w-5" />Noticias</TabsTrigger>
                <TabsTrigger value="vr" className="rounded-lg py-2 text-base" disabled><Headset className="mr-2 h-5 w-5" />Entornos VR</TabsTrigger>
            </TabsList>
            <TabsContent value="feed" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-headline">Galería Cultural</h2>
                        <p className="text-muted-foreground">El lienzo principal para la expresión de la red.</p>
                    </div>
                    <Button asChild>
                      <Link href="/participations/create/cultural-post">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Publicar Obra
                      </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((item) => {
                            const content: CulturalContent = {
                                id: item.id,
                                title: item.title,
                                type: "Creación Cultural",
                                author: { name: item.authorName, avatar: "", avatarHint: "user avatar" },
                                image: item.imageUrl,
                                imageHint: item.title,
                                description: item.description
                            };
                            return <ContentCard key={item.id} content={content} />;
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card/50 rounded-lg">
                        <h3 className="text-xl font-semibold">La Galería Está Vacía</h3>
                        <p className="text-muted-foreground mt-2">¡Sé el primero en compartir tu arte y cultura!</p>
                    </div>
                )}
            </TabsContent>
      </Tabs>
    </div>
  );
}
