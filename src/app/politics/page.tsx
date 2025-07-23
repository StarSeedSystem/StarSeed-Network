
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Loader2, Landmark, Shield } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { FeedPost } from "@/components/dashboard/FeedPost";
import { AdvancedFilter, FilterState } from "@/components/politics/AdvancedFilter";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnyEntity } from "@/types/content-types";
import { ConnectionCard } from "@/components/participations/ConnectionCard";

type SubArea = "legislative" | "executive" | "judicial";

export default function PoliticsPage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [myPages, setMyPages] = useState<AnyEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const { user } = useUser();
  const [filters, setFilters] = useState<FilterState>({
    entity: 'all', status: 'all', tags: '', saved: false, collection: 'all'
  });
  const [activeSubArea, setActiveSubArea] = useState<SubArea>("legislative");

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        setIsLoadingPages(false);
        return;
    }

    const postsQuery = query(
        collection(db, "posts"),
        where("area", "==", "politics")
    );

    const unsubscribePosts = onSnapshot(postsQuery, async (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedPosts = fetchedPosts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setPosts(sortedPosts);
        setIsLoading(false);
    });

    const fetchMyPages = async () => {
        setIsLoadingPages(true);
        const pages: AnyEntity[] = [];
        const collectionsToQuery = [
            { name: "federated_entities", type: "federation" },
            { name: "political_parties", type: "political_party" },
        ] as const;

        for (const { name, type } of collectionsToQuery) {
            const q = query(collection(db, name), where('members', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                pages.push({ ...doc.data(), type } as AnyEntity);
            });
        }
        setMyPages(pages);
        setIsLoadingPages(false);
    };

    fetchMyPages();

    return () => unsubscribePosts();
  }, [user]);

  const filteredData = useMemo(() => {
    return posts.filter(post => {
      const subAreaMatch = post.subArea === activeSubArea;
      const entityMatch = filters.entity === 'all' || post.destinations.some((d: any) => d.id === filters.entity);
      const tagsMatch = filters.tags === '' || post.content.toLowerCase().includes(filters.tags.toLowerCase());
      return subAreaMatch && entityMatch && tagsMatch;
    });
  }, [posts, filters, activeSubArea]);

  const renderFeed = () => {
      if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
      if (filteredData.length === 0) return (
          <Card className="text-center py-16 bg-card/50 rounded-lg">
              <h3 className="text-xl font-semibold">No hay publicaciones en esta área.</h3>
              <p className="text-muted-foreground mt-2">Únete a entidades políticas o crea una nueva publicación.</p>
          </Card> 
      )
      return (
           <div className="space-y-6">
              {filteredData.map(post => (
                    <FeedPost key={post.id} post={{
                      id: post.id,
                      authorName: post.authorName,
                      handle: post.handle,
                      avatarUrl: post.avatarUrl,
                      avatarHint: "user avatar",
                      title: post.title,
                      content: post.content,
                      comments: post.comments,
                      reposts: post.reposts,
                      likes: post.likes,
                      destinations: post.destinations,
                      blocks: post.blocks,
                      createdAt: post.createdAt,
                  }}/>
              ))}
          </div>
      )
  }
  
   const renderMyPages = () => {
      if (isLoadingPages) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
      if (myPages.length === 0) return (
          <Card className="text-center py-16 bg-card/50 rounded-lg">
              <h3 className="text-xl font-semibold">No participas en ninguna página política.</h3>
              <p className="text-muted-foreground mt-2">Explora y únete a Entidades Federativas o Partidos Políticos.</p>
          </Card> 
      )
      return (
           <div className="space-y-4">
              {myPages.map(page => <ConnectionCard key={page.id} item={page} />)}
          </div>
      )
  }


  return (
    <div className="space-y-8">
      <PageHeader
        title="Política"
        subtitle="Propuestas, leyes y debates para la gobernanza de la red."
        actionType="network"
        currentNetwork="politics"
        actionButton={
            <Button asChild><Link href="/publish"><PlusCircle className="mr-2 h-4 w-4" />Crear Publicación</Link></Button>
        }
      />

       <Tabs defaultValue="publications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="publications">Publicaciones</TabsTrigger>
                <TabsTrigger value="pages">Mis Páginas Políticas</TabsTrigger>
                <TabsTrigger value="replicated_vote">Voto Replicado</TabsTrigger>
            </TabsList>
            <TabsContent value="publications" className="mt-6 space-y-6">
                <Tabs defaultValue={activeSubArea} onValueChange={(value) => setActiveSubArea(value as SubArea)}>
                    <TabsList className="grid w-full grid-cols-3 bg-card/80 rounded-xl h-auto">
                         <TabsTrigger value="legislative">Legislativo</TabsTrigger>
                         <TabsTrigger value="executive">Ejecutivo</TabsTrigger>
                         <TabsTrigger value="judicial">Judicial</TabsTrigger>
                    </TabsList>
                </Tabs>
                <AdvancedFilter filters={filters} onFilterChange={setFilters} />
                {renderFeed()}
            </TabsContent>
            <TabsContent value="pages" className="mt-6">
                {renderMyPages()}
            </TabsContent>
            <TabsContent value="replicated_vote" className="mt-6">
                 <Card className="text-center py-16 bg-card/50 rounded-lg">
                    <h3 className="text-xl font-semibold">Función en Construcción</h3>
                    <p className="text-muted-foreground mt-2">Aquí podrás configurar y ver tu voto replicado.</p>
                </Card> 
            </TabsContent>
        </Tabs>
    </div>
  );
}
