
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, Gavel, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "../utils/BackButton";

interface FederatedEntityPageProps {
  slug: string;
}

function EntitySkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="relative px-4 sm:px-8 pb-8 -mt-24">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
                    <div className="pt-16 flex-grow space-y-2">
                        <Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-32" /><Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FederatedEntityPage({ slug }: FederatedEntityPageProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [entity, setEntity] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    const docRef = doc(db, "federated_entities", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
        const data = { id: doc.id, ...doc.data() };
        setEntity(data);
        } else {
        setEntity(null);
        }
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching entity:", error);
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [slug]);

  useEffect(() => {
    if (entity && authUser) {
        setIsMember(Array.isArray(entity.members) && entity.members.includes(authUser.uid));
    }
  }, [entity, authUser]);

   const handleJoinLeave = async () => {
      if (!authUser || !entity?.id) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }
      setIsJoiningLeaving(true);
      const entityRef = doc(db, "federated_entities", entity.id);
      
      try {
        if (isMember) {
            await updateDoc(entityRef, { members: arrayRemove(authUser.uid) });
            toast({ title: "Left Entity", description: `You have left ${entity.name}.` });
        } else {
            await updateDoc(entityRef, { members: arrayUnion(authUser.uid) });
            toast({ title: "Joined Entity", description: `You have joined ${entity.name}.` });
        }
      } catch (error) {
        console.error("Error updating membership", error);
        toast({title: "Error", description: "Failed to update membership.", variant: "destructive"});
      } finally {
        setIsJoiningLeaving(false);
      }
  }

  if (isLoading || authLoading) {
    return <EntitySkeleton />;
  }

  if (!entity) {
    notFound();
  }
  
  const memberCount = Array.isArray(entity.members) ? entity.members.length : 0;

  return (
    <div className="space-y-6">
        <BackButton />
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={entity.banner || `https://placehold.co/1200x400.png?text=${entity.name}`} alt={`${entity.name} Banner`} layout="fill" objectFit="cover" data-ai-hint={entity.bannerHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={entity.avatar || `https://avatar.vercel.sh/${entity.slug}.png`} alt={`${entity.name} Avatar`} data-ai-hint={entity.avatarHint} />
                    <AvatarFallback>{entity.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{entity.name}</h1>
                            <p className="text-muted-foreground">Tipo: {entity.scope} {entity.type}</p>
                        </div>
                        {authUser && (
                             <Button onClick={handleJoinLeave} disabled={isJoiningLeaving}>
                                {isJoiningLeaving ? (
                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 ) : isMember ? (
                                     "Abandonar Entidad"
                                 ) : (
                                     "Unirse a la Entidad"
                                 )}
                             </Button>
                         )}
                        {!authUser && (<span className="text-sm text-muted-foreground">Log in to join</span>)}
                    </div>
                    <p className="mt-4 text-foreground/90">{entity.longDescription}</p>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="directives" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="directives" className="rounded-lg py-2 text-base"><Gavel className="mr-2 h-4 w-4"/>Directives</TabsTrigger>
                    <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Publications</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({memberCount})</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="directives" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">Official directives and resolutions will appear here.</div>
                </TabsContent>
                <TabsContent value="publications" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">Las publicaciones de la entidad aparecerán aquí.</div>
                </TabsContent>
                <TabsContent value="members" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">La lista de miembros aparecerá aquí.</div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
