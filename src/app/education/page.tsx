
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { FeedPost } from "@/components/dashboard/FeedPost";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedFilter, FilterState } from "@/components/politics/AdvancedFilter";

export default function EducationPage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
   const [filters, setFilters] = useState<FilterState>({
    entity: 'all', status: 'all', tags: '', saved: false, collection: 'all'
  });

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }

    const postsQuery = query(
        collection(db, "posts"),
        where("area", "==", "education")
    );

    const unsubscribePosts = onSnapshot(postsQuery, async (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const collectionsToQuery = ["communities", "study_groups"];
        const userPagesIds: string[] = [user.uid];

        for (const collectionName of collectionsToQuery) {
            const q = query(collection(db, collectionName), where('members', 'array-contains', user.uid));
            const userPagesSnapshot = await getDocs(q);
            userPagesSnapshot.forEach(doc => userPagesIds.push(doc.id));
        }

        const filteredPosts = fetchedPosts.filter(post => 
            post.destinations.some((dest: any) => userPagesIds.includes(dest.id))
        );
        
        // Sort client-side
        const sortedPosts = filteredPosts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setPosts(sortedPosts);
        setIsLoading(false);
    });

    return () => unsubscribePosts();
  }, [user]);

  const renderFeed = () => {
    if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
    if (posts.length === 0) return (
        <Card className="text-center py-16 bg-card/50 rounded-lg">
            <h3 className="text-xl font-semibold">No Hay Contenido Educativo Todavía</h3>
            <p className="text-muted-foreground mt-2">¡Sé el primero en compartir tu conocimiento!</p>
        </Card>
    )
    return (
        <div className="space-y-6">
            {posts.map((post) => (
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
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Educación"
        subtitle="Comparte conocimiento, tutoriales e investigaciones."
        actionType="network"
        currentNetwork="education"
         actionButton={
            <Button asChild><Link href="/publish"><PlusCircle className="mr-2 h-4 w-4" />Añadir Contenido</Link></Button>
        }
      />
      
       <Tabs defaultValue="publications" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="publications">Publicaciones</TabsTrigger>
                <TabsTrigger value="pages">Mis Grupos de Estudio</TabsTrigger>
            </TabsList>
            <TabsContent value="publications" className="mt-6 space-y-6">
                <AdvancedFilter filters={filters} onFilterChange={setFilters} />
                {renderFeed()}
            </TabsContent>
            <TabsContent value="pages" className="mt-6">
                 <Card className="text-center py-16 bg-card/50 rounded-lg">
                    <h3 className="text-xl font-semibold">Función en Construcción</h3>
                    <p className="text-muted-foreground mt-2">Aquí verás los grupos de estudio en los que participas.</p>
                </Card> 
            </TabsContent>
        </Tabs>
    </div>
  );
}
