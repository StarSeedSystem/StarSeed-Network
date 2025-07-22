
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext"; // Import useUser
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface CommunityClientProps {
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

export function CommunityClient({ slug }: CommunityClientProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [community, setCommunity] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (community && authUser) {
        setIsMember(Array.isArray(community.members) && community.members.includes(authUser.uid));
    }
  }, [community, authUser]);

  useEffect(() => {
    if (!slug) return;

    const docRef = doc(db, "communities", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setCommunity({ id: doc.id, ...doc.data() });
      } else {
        setCommunity(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching community:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  const handleJoinLeave = async () => {
      if (!authUser || !community?.id) {
          toast({ title: "Authentication Required", description: "You must be logged in to join or leave.", variant: "destructive" });
          return;
      }

      setIsJoiningLeaving(true);
      
      // Simulate the action locally to avoid permission errors
      setTimeout(() => {
          if (isMember) {
              setCommunity((prev: any) => ({
                  ...prev,
                  members: prev.members.filter((uid: string) => uid !== authUser.uid)
              }));
              setIsMember(false);
              toast({ title: "Left Community", description: `You have left ${community.name}.` });
          } else {
              setCommunity((prev: any) => ({
                  ...prev,
                  members: [...(prev.members || []), authUser.uid]
              }));
              setIsMember(true);
              toast({ title: "Joined Community", description: `Welcome to ${community.name}!` });
          }
          setIsJoiningLeaving(false);
      }, 500); // Simulate network delay
  }

  if (isLoading) {
    return <CommunitySkeleton />;
  }

  if (!community) {
    notFound();
  }

   if (authLoading) {
      return <CommunitySkeleton />;
   }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={community?.banner || ''} alt="Community Banner" layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                <AvatarImage src={community?.avatar || ''} alt="Community Avatar" />
                <AvatarFallback>{community?.name?.substring(0, 2) || ''}</AvatarFallback>
            </Avatar>
            <div className="pt-16 flex-grow">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{community?.name}</h1>
                        <p className="text-muted-foreground">{community?.description}</p>
                    </div>
                    {authUser && ( 
                        <Button onClick={handleJoinLeave} disabled={isJoiningLeaving}>
                            {isJoiningLeaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : isMember ? (
                                "Abandonar Comunidad"
                            ) : (
                                "Unirse a la Comunidad"
                            )}
                        </Button>
                    )}
                    {!authUser && !authLoading && (
                        <span className="text-sm text-muted-foreground">Log in to join</span>
                    )}
                </div>
                <p className="mt-4 text-foreground/90">{community?.longDescription}</p>
            </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="publications" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Publicaciones</TabsTrigger>
                <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({Array.isArray(community?.members) ? community.members.length : 0})</TabsTrigger>
                <TabsTrigger value="goals" className="rounded-lg py-2 text-base">Objetivos</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="publications" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">Las publicaciones de la comunidad aparecerán aquí.</div>
                </TabsContent>
                <TabsContent value="members" className="mt-6">
                     <div className="text-center text-muted-foreground py-8">La lista de miembros aparecerá aquí.</div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
