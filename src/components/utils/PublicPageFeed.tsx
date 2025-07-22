
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
        
        // This query requires a composite index on (destinations, createdAt)
        // Since we cannot create it programmatically, we will fetch and sort on the client
        const robustQuery = query(postsCollection, where("destinations", "array-contains", { id: pageId, name: "", type: "" }));
        const q = query(
            collection(db, "posts"),
            where("destinations", "array-contains-any", [
                {id: pageId},
                {id: pageId, name: '', type: ''},
            ])
        );

        // A more robust but less performant query that doesn't need a composite index
        const allPostsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(allPostsQuery, (querySnapshot) => {
            const allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter on the client side
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
                        author: post.authorName,
                        handle: post.handle,
                        avatar: post.avatarUrl,
                        avatarHint: "user avatar",
                        title: post.title,
                        content: post.content,
                        comments: post.comments,
                        reposts: post.reposts,
                        likes: post.likes,
                        destinations: post.destinations.map((d: any) => d.name),
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
