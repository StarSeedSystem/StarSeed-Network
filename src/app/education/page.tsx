
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

export default function EducationPage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

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
  
  return (
    <div className="space-y-8">
       <Card className="glass-card p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar tutoriales y recursos..." className="pl-9 h-12 text-base" />
                </div>
                <Button size="lg" disabled> 
                    Búsqueda Inteligente (Próximamente)
                </Button>
            </div>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline">Recursos Educativos</h2>
        <Button asChild>
          <Link href="/publish">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Contenido
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length > 0 ? (
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
      ) : (
        <Card className="text-center py-16 bg-card/50 rounded-lg">
            <h3 className="text-xl font-semibold">No Hay Contenido Educativo Todavía</h3>
            <p className="text-muted-foreground mt-2">¡Sé el primero en compartir tu conocimiento!</p>
        </Card>
      )}
    </div>
  );
}
