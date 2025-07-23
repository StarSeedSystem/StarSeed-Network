
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { FeedPost } from "@/components/dashboard/FeedPost";
import { AdvancedFilter, FilterState } from "@/components/politics/AdvancedFilter";

export default function PoliticsPage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [filters, setFilters] = useState<FilterState>({
    entity: 'all', status: 'all', tags: '', saved: false
  });

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }

    const postsQuery = query(
        collection(db, "posts"),
        where("area", "==", "politics")
    );

    const unsubscribePosts = onSnapshot(postsQuery, async (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const collectionsToQuery = ["federated_entities", "political_parties"];
        const userPagesIds: string[] = [user.uid];

        for (const collectionName of collectionsToQuery) {
            const q = query(collection(db, collectionName), where('members', 'array-contains', user.uid));
            const userPagesSnapshot = await getDocs(q);
            userPagesSnapshot.forEach(doc => userPagesIds.push(doc.id));
        }

        const filteredByMembership = fetchedPosts.filter(post => 
            post.destinations.some((dest: any) => userPagesIds.includes(dest.id))
        );
        
        // Sort client-side
        const sortedPosts = filteredByMembership.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setPosts(sortedPosts);
        setIsLoading(false);
    });

    return () => unsubscribePosts();
  }, [user]);

  const filteredData = useMemo(() => {
    return posts.filter(post => {
      const pollBlock = post.blocks?.find((b: any) => b.type === 'poll' && b.isLegislative);
      const legislativeData = pollBlock?.legislativeData;

      const entityMatch = filters.entity === 'all' || post.destinations.some((d: any) => d.id === filters.entity);
      const tagsMatch = filters.tags === '' || post.content.toLowerCase().includes(filters.tags.toLowerCase()); // Simple tag search for now
      
      const statusMatch = () => {
        if (!pollBlock || filters.status === 'all') return true;
        if (filters.status === 'urgent') return legislativeData?.isUrgent === true;
        // This is a placeholder; more complex status logic would be needed
        if (filters.status === 'active') return true; 
        return true;
      }
      
      return entityMatch && tagsMatch && statusMatch();
    });
  }, [posts, filters]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Centro Político</h1>
         <Button asChild><Link href="/publish"><PlusCircle className="mr-2 h-4 w-4" />Crear Publicación</Link></Button>
      </div>

      <AdvancedFilter filters={filters} onFilterChange={setFilters} />
      
      <div className="space-y-6">
        {isLoading ? ( <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
        ) : filteredData.length > 0 ? (
            filteredData.map(post => (
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
            ))
        ) : ( 
            <Card className="text-center py-16 bg-card/50 rounded-lg">
                <h3 className="text-xl font-semibold">No hay actividad política que mostrar.</h3>
                <p className="text-muted-foreground mt-2">Únete a entidades políticas o crea una nueva propuesta.</p>
            </Card> 
        )}
      </div>
    </div>
  );
}
