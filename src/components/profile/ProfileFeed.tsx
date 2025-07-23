
"use client";

import { useState, useEffect, FormEvent } from "react";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FeedPost } from "../dashboard/FeedPost";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface ProfileFeedProps {
  profile: DocumentData;
}

function PostCreator({ profile }: { profile: DocumentData }) {
    const [content, setContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const { toast } = useToast();
    const { user: authUser } = useUser();

    // The user can only post on their own profile.
    if (!authUser || !profile || authUser.uid !== profile.id) {
        return null;
    }

    const handlePostSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            await addDoc(collection(db, "posts"), {
                authorId: profile.id,
                authorName: profile.name,
                handle: profile.handle,
                avatarUrl: profile.avatarUrl,
                title: "Publicación de perfil",
                content: content,
                area: 'profile',
                destinations: [{ id: profile.id, name: profile.name, type: 'profile' }],
                comments: 0,
                reposts: 0,
                likes: 0,
                createdAt: serverTimestamp(),
            });
            setContent("");
            toast({ title: "Éxito", description: "Tu mensaje ha sido difundido." });
        } catch (error) {
            console.error("Error creating post:", error);
            toast({ title: "Error", description: "No se pudo crear la publicación.", variant: "destructive" });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="glass-card rounded-2xl p-4 mb-6">
            <form onSubmit={handlePostSubmit}>
                <Textarea
                    placeholder="¿Qué está pasando en tu rincón del Nexo?"
                    className="bg-transparent border-0 focus-visible:ring-0 ring-offset-0 text-base"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <Button type="submit" disabled={isPosting || !content.trim()}>
                        {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publicar
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export function ProfileFeed({ profile }: ProfileFeedProps) {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!profile?.id) {
        setIsLoading(false);
        return;
    }

    const postsCollection = collection(db, "posts");
    
    const q = query(
        postsCollection, 
        where("authorId", "==", profile.id),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching profile feed:", error);
        setPosts([]);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  if (isLoading) {
      return (
          <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary"/>
          </div>
      )
  }

  return (
    <div>
        <PostCreator profile={profile} />
        <div className="space-y-4">
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
                        destinations: post.destinations,
                        blocks: post.blocks,
                        createdAt: post.createdAt,
                    }} />
                ))
            ) : (
                <Card className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">Aún no hay publicaciones.</p>
                </Card>
            )}
        </div>
    </div>
  );
}
