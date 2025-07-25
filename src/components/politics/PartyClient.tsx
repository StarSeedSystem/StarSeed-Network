
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, Vote, Loader2, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { PartyFeed } from "./PartyFeed";

interface PartyClientProps {
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

export function PartyClient({ slug }: PartyClientProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [party, setParty] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { toast } = useToast();

  const isCreator = authUser && party?.creatorId === authUser.uid;

  useEffect(() => {
    if (party && authUser) {
        setIsMember(Array.isArray(party.members) && party.members.includes(authUser.uid));
    }
  }, [party, authUser]);

  useEffect(() => {
    if (!slug) return;

    const docRef = doc(db, "political_parties", slug); // Corrected collection name
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setParty({ id: doc.id, ...doc.data() });
      } else {
        setParty(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching party:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

   const handleJoinLeave = async () => {
      if (!authUser || !party?.id) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }

      setIsJoiningLeaving(true);
      
      // Simulate the action locally
      setTimeout(() => {
        if (isMember) {
            setParty((prev: any) => ({ 
                ...prev, 
                members: Array.isArray(prev.members) ? prev.members.filter((uid: string) => uid !== authUser.uid) : (typeof prev.members === 'number' ? prev.members - 1 : 0)
            }));
            setIsMember(false);
            toast({ title: "Left Party", description: `You have left ${party.name}.` });
        } else {
            setParty((prev: any) => ({ 
                ...prev, 
                members: Array.isArray(prev.members) ? [...prev.members, authUser.uid] : (typeof prev.members === 'number' ? prev.members + 1 : 1)
            }));
            setIsMember(true);
            toast({ title: "Joined Party", description: `You have joined ${party.name}.` });
        }
        setIsJoiningLeaving(false);
      }, 500);
  }

  if (isLoading) {
    return <PartySkeleton />;
  }

  if (!party) {
    notFound();
  }

  if (authLoading) {
      return <PartySkeleton />;
  }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={party.banner} alt={`${party.name} Banner`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={party.avatar} alt={`${party.name} Avatar`} />
                    <AvatarFallback>{party.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{party.name}</h1>
                            <p className="text-muted-foreground">Topic: {party.ideology}</p>
                        </div>
                        {authUser && (
                             <Button onClick={handleJoinLeave} disabled={isJoiningLeaving}>
                                {isJoiningLeaving ? (
                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 ) : isMember ? (
                                     "Abandonar Partido"
                                 ) : (
                                     "Unirse a Partido"
                                 )}
                             </Button>
                         )}
                         {!authUser && !authLoading && (<span className="text-sm text-muted-foreground">Log in to join</span>)}
                    </div>
                    <p className="mt-4 text-foreground/90">{party.description}</p>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="proposals" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="proposals" className="rounded-lg py-2 text-base"><Vote className="mr-2 h-4 w-4"/>Propuestas</TabsTrigger>
                    <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Publicaciones</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({Array.isArray(party?.members) ? party.members.length : party?.members || 0})</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="proposals" className="mt-6">
                   {party?.id && <PartyFeed partyId={party.id} />}
                </TabsContent>
                <TabsContent value="publications" className="mt-6">
                   <div className="text-center text-muted-foreground py-8">Las publicaciones del partido aparecerán aquí.</div>
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
                                 publishedInType: 'party',
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
