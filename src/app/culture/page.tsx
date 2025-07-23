
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { FeedPost } from "@/components/dashboard/FeedPost";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CulturePage() {
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
        where("area", "==", "culture")
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

    return () => {
        unsubscribePosts();
    };
  }, [user]);

  return (
    <div className="space-y-8">
        <PageHeader
            title="Cultura"
            subtitle="Expresión artística, eventos y creaciones sociales."
            actionType="network"
            currentNetwork="culture"
            actionButton={
                 <Button asChild><Link href="/publish"><PlusCircle className="mr-2 h-4 w-4" />Publicar Obra</Link></Button>
            }
        />

        {isLoading ? ( <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
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
                <h3 className="text-xl font-semibold">La Galería Está Vacía</h3>
                <p className="text-muted-foreground mt-2">¡Participa en comunidades y comparte tu arte!</p>
            </Card> 
        )}
    </div>
  );
}
