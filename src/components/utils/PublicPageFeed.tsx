
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
        // Query for posts where the destinations array contains the current page's ID
        const q = query(
            postsCollection, 
            where("destinations", "array-contains", { id: pageId, name: "", type: "" }), // Structure needs to match what's stored
            orderBy("createdAt", "desc")
        );
        
        // A more flexible but less performant query might be needed if the name/type aren't known or consistent
        // For now, we assume we know the ID.
        // Let's make it more robust by querying for all posts and filtering client side. This avoids complex index needs.
        
        const robustQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(robustQuery, (querySnapshot) => {
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
                        author: post.authorName,
                        handle: post.handle,
                        avatar: post.avatarUrl,
                        avatarHint: "user avatar",
                        content: post.content,
                        comments: post.comments,
                        reposts: post.reposts,
                        likes: post.likes,
                        destinations: post.destinations.map((d: any) => d.name),
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
