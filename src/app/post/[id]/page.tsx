// src/app/post/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { BackButton } from "@/components/utils/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { EducationData, EducationSettings } from "@/components/publish/EducationSettings";
import { PollData, VotingSystem } from "@/components/politics/VotingSystem";
import { CommentSection } from "@/components/politics/CommentSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, LayoutDashboard, BrainCircuit, Library, Users, Gavel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

function PostSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-32" />
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export default function PostPage() {
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const { user } = useUser();

    const [post, setPost] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const docRef = doc(db, "posts", id);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setPost({ id: doc.id, ...doc.data() });
            } else {
                setPost(null);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching post:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    const handleVote = async (optionIndex: number) => {
        // This function is a placeholder for now, as it's part of VotingSystem
        // A full implementation would require a transaction like in FeedPost
        toast({ title: "Votación no implementada en esta vista detallada todavía." });
    };

    if (isLoading) {
        return <PostSkeleton />;
    }

    if (!post) {
        return notFound();
    }
    
    const timeAgo = post.createdAt?.seconds
        ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true, locale: es })
        : "ahora";

    const educationBlock = post.blocks?.find((b: any) => b.type === 'education') as EducationData | undefined;
    const pollBlock = post.blocks?.find((b: any) => b.type === 'poll') as PollData | undefined;

    return (
        <div className="space-y-6">
            <BackButton />

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-card/60 rounded-xl h-auto">
                    <TabsTrigger value="content"><BookOpen className="mr-2 h-4 w-4" /> Contenido</TabsTrigger>
                    <TabsTrigger value="dashboard" disabled><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</TabsTrigger>
                    <TabsTrigger value="agent" disabled><BrainCircuit className="mr-2 h-4 w-4" /> Agente IA</TabsTrigger>
                    <TabsTrigger value="library" disabled><Library className="mr-2 h-4 w-4" /> Biblioteca</TabsTrigger>
                    <TabsTrigger value="participants" disabled><Users className="mr-2 h-4 w-4" /> Participantes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="mt-6">
                    <Card className="glass-card">
                        <CardHeader>
                             <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={post.avatarUrl} alt={post.authorName} data-ai-hint={post.avatarHint} />
                                    <AvatarFallback>{post.authorName?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{post.authorName}</p>
                                    <p className="text-sm text-muted-foreground">@{post.handle} • {timeAgo}</p>
                                </div>
                            </div>
                            <CardTitle className="font-headline text-3xl pt-4">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="prose dark:prose-invert max-w-none text-foreground/90">
                           <p>{post.content}</p>
                        </CardContent>
                         {post.destinations && post.destinations.length > 0 && (
                            <CardFooter className="flex flex-wrap gap-2">
                                {post.destinations.map((dest: any) => (
                                    <Badge variant="secondary" key={dest.id}>{dest.name}</Badge>
                                ))}
                            </CardFooter>
                        )}
                    </Card>

                    {educationBlock && (
                        <div className="mt-6">
                            <EducationSettings data={educationBlock} onChange={() => {}} />
                        </div>
                    )}
                    
                    {pollBlock && (
                         <div className="mt-6">
                            <VotingSystem poll={pollBlock} postId={post.id} onVote={handleVote} />
                        </div>
                    )}

                     <Card className="glass-card mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Gavel className="h-5 w-5"/>Debate y Comentarios</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <CommentSection postId={post.id} isPoll={!!pollBlock} />
                        </CardContent>
                    </Card>

                </TabsContent>
            </Tabs>
        </div>
    );
}
