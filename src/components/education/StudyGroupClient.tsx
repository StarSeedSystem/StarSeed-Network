
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, BookOpen, Loader2, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { StudyGroupFeed } from "./StudyGroupFeed";

interface StudyGroupClientProps {
  slug: string;
}

function StudyGroupSkeleton() {
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

export function StudyGroupClient({ slug }: StudyGroupClientProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [group, setGroup] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { toast } = useToast();

  const isCreator = authUser && group?.creatorId === authUser.uid;

  useEffect(() => {
    if (group && authUser) {
        setIsMember(Array.isArray(group.members) && group.members.includes(authUser.uid));
    }
  }, [group, authUser]);

  useEffect(() => {
    if (!slug) return;

    const docRef = doc(db, "study_groups", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setGroup({ id: doc.id, ...doc.data() });
      } else {
        setGroup(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching group:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  const handleJoinLeave = async () => {
      if (!authUser || !group?.id) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }

      setIsJoiningLeaving(true);
      
      // Simulate the action locally
      setTimeout(() => {
        if (isMember) {
            setGroup((prev: any) => ({ 
                ...prev, 
                members: Array.isArray(prev.members) ? prev.members.filter((uid: string) => uid !== authUser.uid) : (typeof prev.members === 'number' ? prev.members - 1 : 0)
            }));
            setIsMember(false);
            toast({ title: "Left Group", description: `You have left ${group.name}.` });
        } else {
            setGroup((prev: any) => ({ 
                ...prev, 
                members: Array.isArray(prev.members) ? [...prev.members, authUser.uid] : (typeof prev.members === 'number' ? prev.members + 1 : 1)
            }));
            setIsMember(true);
            toast({ title: "Joined Group", description: `You have joined ${group.name}.` });
        }
        setIsJoiningLeaving(false);
      }, 500);
  }

  if (isLoading) {
    return <StudyGroupSkeleton />;
  }

  if (!group) {
    notFound();
  }

   if (authLoading) {
      return <StudyGroupSkeleton />;
   }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={group.bannerUrl || `https://placehold.co/1200x400.png?text=${group.name}`} alt={`${group.name} Banner`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={group.avatarUrl || `https://avatar.vercel.sh/${group.slug}.png`} alt={`${group.name} Avatar`} />
                    <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{group.name}</h1>
                            <p className="text-muted-foreground">Topic: {group.topic}</p>
                        </div>
                        {authUser && (
                            <Button onClick={handleJoinLeave} disabled={isJoiningLeaving}>
                                {isJoiningLeaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : isMember ? (
                                    "Abandonar Grupo"
                                ) : (
                                    "Unirse a Grupo"
                                )}
                            </Button>
                        )}
                        {!authUser && !authLoading && (<span className="text-sm text-muted-foreground">Log in to join</span>)}
                    </div>
                     <div className="mt-4 text-foreground/90">
                         <p>{group.description || "No detailed description provided."}</p>
                     </div>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="discussions" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="discussions" className="rounded-lg py-2 text-base"><BookOpen className="mr-2 h-4 w-4"/>Discussions</TabsTrigger>
                     <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Resources</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({Array.isArray(group?.members) ? group.members.length : group?.members || 0})</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="publications" className="mt-6">
                    {group?.id && <StudyGroupFeed groupId={group.id} />}
                </TabsContent>
                <TabsContent value="discussions" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">La zona de debate aparecerá aquí.</div>
                </TabsContent>
                <TabsContent value="members" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">La lista de miembros aparecerá aquí.</div>
                </TabsContent>
            </Tabs>
            {isMember && (
                <div className="mt-6 text-center">
                     <Button asChild size="lg">
                         <Link href={{
                             pathname: '/participations/create/tutorial',
                             query: {
                                 publishedInId: group.id,
                                 publishedInType: 'study-group',
                                 publishedInName: group.name
                             }
                         }}>
                            <PlusCircle className="mr-2 h-5 w-5" /> Publicar Tutorial en {group.name}
                         </Link>
                     </Button>
                </div>
            )}
        </div>
    </div>
  );
}
