
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FeedPost } from "@/components/dashboard/FeedPost";

interface PublicPageFeedProps {
    pageId: string;
}

export function PublicPageFeed({ pageId }: PublicPageFeedProps) {
    const [posts, setPosts] = useState<DocumentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!pageId) {
            setIsLoading(false);
            return;
        }

        const postsCollection = collection(db, "posts");
        
        // OPTIMIZED QUERY: Use 'array-contains' to filter on the server-side.
        // This is highly efficient and scalable.
        // Firebase requires an index for this query, which it will prompt you to create
        // in the console logs the first time it runs if one doesn't exist.
        const q = query(
            postsCollection,
            where("destinations", "array-contains", { id: pageId, name: "", type: "" }), // NOTE: Firestore only matches on the full object. We will need to save the full object.
            orderBy("createdAt", "desc")
        );
        
        // A more robust query that doesn't need a composite index, but is less performant on large datasets.
        // We will switch to this one to avoid requiring index creation from the user.
        const allPostsQuery = query(
            postsCollection,
            where("destinations", "array-contains-any", [{id: pageId}]),
             orderBy("createdAt", "desc")
        );

        const robustQuery = query(
            postsCollection,
            where("destinations", "array-contains-any", [
                {id: pageId, name: "Mi Perfil Personal", type: "profile"},
                // This is still not perfect, as we need all possible combinations.
                // The best approach for production is a dedicated index.
                // For this app, we will filter client-side to ensure it works out of the box.
            ])
        )

        // The most robust client-side approach that requires no special indexes
        const finalQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
            const allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter on the client side to ensure it works without complex index configuration
            const pagePosts = allPosts.filter(post => 
                Array.isArray(post.destinations) && post.destinations.some(dest => dest.id === pageId)
            );

            setPosts(pagePosts);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching page feed:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [pageId]);

    if (isLoading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin"/></div>;
    }

    return (
        <div className="space-y-6">
            {posts.length > 0 ? (
                posts.map((post) => (
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
                        createdAt: post.createdAt
                    }} />
                ))
            ) : (
                <Card className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">Aún no hay publicaciones en esta página.</p>
                </Card>
            )}
        </div>
    );
}
