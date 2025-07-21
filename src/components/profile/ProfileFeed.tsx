
"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FeedPost } from "../dashboard/FeedPost";
import { Loader2 } from "lucide-react";

interface ProfileFeedProps {
  // We pass the entire profile object of the user whose feed we are viewing.
  // This is needed to know who the author is when creating a new post.
  profile: DocumentData;
}

function PostCreator({ profile }: { profile: DocumentData }) {
    const [content, setContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const { toast } = useToast();

    const handlePostSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            await addDoc(collection(db, "posts"), {
                authorId: profile.id,
                authorName: profile.name,
                authorHandle: profile.handle,
                authorAvatar: profile.avatarUrl,
                content: content,
                createdAt: serverTimestamp(),
                likes: 0,
                comments: 0,
                destinations: ["Profile"] // Default destination
            });
            setContent("");
            toast({ title: "Success", description: "Your message has been broadcasted." });
        } catch (error) {
            console.error("Error creating post:", error);
            toast({ title: "Error", description: "Could not create post.", variant: "destructive" });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="glass-card rounded-2xl p-4 mb-6">
            <form onSubmit={handlePostSubmit}>
                <Textarea
                    placeholder="What's happening in your slice of the Nexus?"
                    className="bg-transparent border-0 focus-visible:ring-0 ring-offset-0 text-base"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <Button type="submit" disabled={isPosting || !content.trim()}>
                        {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export function ProfileFeed({ profile }: ProfileFeedProps) {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'profile' | 'communities'>('all');
  
  useEffect(() => {
    if (!profile?.id) return;

    const postsCollection = collection(db, "posts");
    // Query for posts created by the profile user, ordered by newest first
    const q = query(postsCollection, where("authorId", "==", profile.id), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [profile]);

  const currentFeed = useMemo(() => {
    // This filtering logic can be expanded later
    return posts;
  }, [posts]);

  return (
    <div>
        {/* We will need to add a check here to only show PostCreator if the logged-in user is viewing their own profile */}
        <PostCreator profile={profile} />

        <div className="space-y-4">
            {currentFeed.length > 0 ? (
                currentFeed.map((post) => (
                    <FeedPost key={post.id} post={post} />
                ))
            ) : (
                <Card className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">No publications yet.</p>
                </Card>
            )}
        </div>
    </div>
  );
}
