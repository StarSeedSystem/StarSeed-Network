
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, Loader2, Bookmark, Library, Folder, LayoutDashboard, BrainCircuit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext"; 
import { useToast } from "@/hooks/use-toast"; 
import { BackButton } from "../utils/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import type { Community } from "@/types/content-types";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";
import { PublicPageFeed } from "../utils/PublicPageFeed";
import { SaveToCollectionDialog } from "../utils/SaveToCollectionDialog";
import { PublicPageDashboard } from "../utils/PublicPageDashboard";
import { PublicPageAgent } from "../utils/PublicPageAgent";

interface CommunityPageProps {
  slug: string;
}

function CommunitySkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="relative px-4 sm:px-8 pb-8 -mt-24">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Skeleton className="w-32 h-32 rounded-full border-4 border-background ring-4 ring-primary" />
                    <div className="pt-16 flex-grow space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CommunityPage({ slug }: CommunityPageProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [community, setCommunity] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    const docRef = doc(db, "communities", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = { id: doc.id, ...doc.data() };
        setCommunity(data);
        if (authUser && Array.isArray(data.members)) {
            setIsMember(data.members.includes(authUser.uid));
        }
      } else {
        setCommunity(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching community:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug, authUser]);

  const handleJoinLeave = async () => {
      if (!authUser || !community?.id) {
          toast({ title: "Authentication Required", description: "You must be logged in to join or leave.", variant: "destructive" });
          return;
      }

      setIsJoiningLeaving(true);
      const docRef = doc(db, "communities", community.id);

      try {
        if (isMember) {
            await updateDoc(docRef, { members: arrayRemove(authUser.uid) });
            toast({ title: "Left Community", description: `You have left ${community.name}.` });
        } else {
            await updateDoc(docRef, { members: arrayUnion(authUser.uid) });
            toast({ title: "Joined Community", description: `Welcome to ${community.name}!` });
        }
        // No need to setIsMember, onSnapshot will handle the UI update
      } catch (error: any) {
        console.error("Error joining/leaving community:", error);
        toast({ title: "Error", description: error.message, variant: "destructive"});
      } finally {
        setIsJoiningLeaving(false);
      }
  }

  if (isLoading || authLoading) {
    return <CommunitySkeleton />;
  }

  if (!community) {
    notFound();
  }

  const memberCount = Array.isArray(community?.members) ? community.members.length : 0;

  return (
    <div className="space-y-6">
        <BackButton />
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={community.banner} alt="Community Banner" layout="fill" objectFit="cover" data-ai-hint={community.bannerHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                <AvatarImage src={community.avatar} alt="Community Avatar" data-ai-hint={community.avatarHint} />
                <AvatarFallback>{community.name.substring(0, 2) || ''}</AvatarFallback>
            </Avatar>
            <div className="pt-16 flex-grow">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{community.name}</h1>
                        <p className="text-muted-foreground">{community.description}</p>
                    </div>
                    {authUser && ( 
                        <div className="flex items-center gap-2">
                            <SaveToCollectionDialog pageId={community.id} pageName={community.name} />
                            <Button onClick={handleJoinLeave} disabled={isJoiningLeaving}>
                                {isJoiningLeaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : isMember ? (
                                    "Abandonar Comunidad"
                                ) : (
                                    "Unirse a la Comunidad"
                                )}
                            </Button>
                        </div>
                    )}
                    {!authUser && (
                        <span className="text-sm text-muted-foreground">Log in to join</span>
                    )}
                </div>
                <p className="mt-4 text-foreground/90">{community.longDescription}</p>
            </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-card/60 rounded-xl h-auto">
                    <TabsTrigger value="dashboard" className="rounded-lg py-2 text-base"><LayoutDashboard className="mr-2 h-4 w-4"/>Dashboard</TabsTrigger>
                    <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Publicaciones</TabsTrigger>
                    <TabsTrigger value="agent" className="rounded-lg py-2 text-base"><BrainCircuit className="mr-2 h-4 w-4"/>Agente IA</TabsTrigger>
                    <TabsTrigger value="library" className="rounded-lg py-2 text-base"><Library className="mr-2 h-4 w-4"/>Biblioteca</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({memberCount})</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="mt-6">
                    <PublicPageDashboard pageType="community" />
                </TabsContent>
                <TabsContent value="publications" className="mt-6">
                    <PublicPageFeed pageId={community.id} />
                </TabsContent>
                <TabsContent value="agent" className="mt-6">
                    <PublicPageAgent pageName={community.name} />
                </TabsContent>
                <TabsContent value="library" className="mt-6">
                     <div className="text-center text-muted-foreground py-8">La biblioteca pública de la comunidad aparecerá aquí.</div>
                </TabsContent>
                <TabsContent value="members" className="mt-6">
                     <div className="text-center text-muted-foreground py-8">La lista de miembros aparecerá aquí.</div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
