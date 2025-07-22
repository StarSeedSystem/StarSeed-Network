
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

interface FederatedEntityClientProps {
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

export function FederatedEntityClient({ slug }: FederatedEntityClientProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [entity, setEntity] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const { toast } = useToast();

  const isMember = authUser && entity?.members?.includes(authUser.uid);

  useEffect(() => {
    if (!slug) return;

    const docRef = doc(db, "federated_entities", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setEntity({ id: doc.id, ...doc.data() });
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

   const handleJoinLeave = async () => {
      if (!authUser || !entity?.id) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }

      setIsJoiningLeaving(true);
      try {
          const entityRef = doc(db, "federated_entities", entity.id);
          if (isMember) {
              await updateDoc(entityRef, {
                  members: arrayRemove(authUser.uid)
              });
               toast({ title: "Left Entity", description: `You have left ${entity.name}.` });
          } else {
              await updateDoc(entityRef, {
                  members: arrayUnion(authUser.uid)
              });
               toast({ title: "Joined Entity", description: `You have joined ${entity.name}.` });
          }
      } catch (error) {
          console.error("Error joining/leaving entity:", error);
          toast({ title: "Action Failed", variant: "destructive" });
      } finally {
          setIsJoiningLeaving(false);
      }
  }

  if (isLoading) {
    return <EntitySkeleton />;
  }

  if (!entity) {
    notFound();
  }

  if (authLoading) {
      return <EntitySkeleton />;
  }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={entity.bannerUrl} alt={`${entity.name} Banner`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={entity.avatarUrl} alt={`${entity.name} Avatar`} />
                    <AvatarFallback>{entity.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{entity.name}</h1>
                            <p className="text-muted-foreground">Type: {entity.type}</p>
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
                        {!authUser && !authLoading && (<span className="text-sm text-muted-foreground">Log in to join</span>)}
                    </div>
                    <p className="mt-4 text-foreground/90">{entity.description}</p>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="directives" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="directives" className="rounded-lg py-2 text-base"><Gavel className="mr-2 h-4 w-4"/>Directives</TabsTrigger>
                    <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Publications</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Members ({entity?.members ? entity.members.length : 0})</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="directives" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">Official directives and resolutions will appear here.</div>
                </TabsContent>
                {/* Other Tabs Content */}
            </Tabs>
        </div>
    </div>
  );
}
