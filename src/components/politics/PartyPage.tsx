
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, Vote, Loader2, PlusCircle, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { PartyFeed } from "./PartyFeed";
import { BackButton } from "../utils/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";
import { PublicPageFeed } from "../utils/PublicPageFeed";
import { SaveToCollectionDialog } from "../utils/SaveToCollectionDialog";

interface PartyPageProps {
  slug: string;
}

function PartySkeleton() {
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

export function PartyPage({ slug }: PartyPageProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [party, setParty] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    const docRef = doc(db, "political_parties", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = { id: doc.id, ...doc.data() };
            setParty(data);
            if (authUser && Array.isArray(data.members)) {
                setIsMember(data.members.includes(authUser.uid));
            }
        } else {
            setParty(null);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug, authUser]);

  const handleJoinLeave = async () => {
      if (!authUser || !party?.id) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }
      setIsJoiningLeaving(true);
      const docRef = doc(db, "political_parties", party.id);

      try {
        if (isMember) {
            await updateDoc(docRef, { members: arrayRemove(authUser.uid) });
            toast({ title: "Left Party", description: `You have left ${party.name}.` });
        } else {
            await updateDoc(docRef, { members: arrayUnion(authUser.uid) });
            toast({ title: "Joined Party", description: `You are now a member of ${party.name}.` });
        }
        // No need to setIsMember, onSnapshot will handle the UI update
      } catch (error: any) {
        console.error("Error joining/leaving party:", error);
        toast({ title: "Error", description: error.message, variant: "destructive"});
      } finally {
        setIsJoiningLeaving(false);
      }
  }

  if (isLoading || authLoading) {
    return <PartySkeleton />;
  }

  if (!party) {
    notFound();
  }

  const memberCount = party?.members?.length || 0;

  return (
    <div className="space-y-6">
        <BackButton />
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={party.banner} alt={`${party.name} Banner`} layout="fill" objectFit="cover" data-ai-hint={party.bannerHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={party.avatar} alt={`${party.name} Avatar`} data-ai-hint={party.avatarHint} />
                    <AvatarFallback>{party.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{party.name}</h1>
                            <p className="text-muted-foreground">Ideología: {party.ideology}</p>
                        </div>
                        {authUser && (
                            <div className="flex items-center gap-2">
                                <SaveToCollectionDialog pageId={party.id} pageName={party.name} />
                                <Button onClick={handleJoinLeave} disabled={isJoiningLeaving}>
                                    {isJoiningLeaving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : isMember ? (
                                        "Abandonar Partido"
                                    ) : (
                                        "Unirse a Partido"
                                    )}
                                </Button>
                            </div>
                         )}
                         {!authUser && (<span className="text-sm text-muted-foreground">Log in to join</span>)}
                    </div>
                    <p className="mt-4 text-foreground/90">{party.longDescription}</p>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="publications" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="proposals" className="rounded-lg py-2 text-base"><Vote className="mr-2 h-4 w-4"/>Propuestas</TabsTrigger>
                    <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Publicaciones</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({memberCount})</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="proposals" className="mt-6">
                   {party.id && <PartyFeed partyId={party.id} />}
                </TabsContent>
                <TabsContent value="publications" className="mt-6">
                   <PublicPageFeed pageId={party.id} />
                </TabsContent>
                <TabsContent value="members" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">La lista de miembros aparecerá aquí.</div>
                </TabsContent>
            </Tabs>
            {isMember && (
                <div className="mt-6 text-center">
                     <Button asChild size="lg">
                         <Link href={{
                             pathname: '/participations/create/proposal',
                             query: {
                                 publishedInId: party.id,
                                 publishedInType: 'political_party',
                                 publishedInName: party.name
                             }
                         }}>
                            <PlusCircle className="mr-2 h-5 w-5" /> Publicar Propuesta en {party.name}
                         </Link>
                     </Button>
                </div>
            )}
        </div>
    </div>
  );
}
