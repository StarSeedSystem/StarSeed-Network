
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/utils/BackButton";
import { Loader2, Users, MessageSquare } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatGroup } from "@/types/content-types";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";

interface ChatGroupPageProps {
  slug: string;
}

function GroupSkeleton() {
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

export function ChatGroupPage({ slug }: ChatGroupPageProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [group, setGroup] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    const docRef = doc(db, "chat_groups", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = { id: doc.id, ...doc.data() };
            setGroup(data);
            if (authUser) {
                setIsMember(data.members?.includes(authUser.uid));
            }
        } else {
            setGroup(null);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug, authUser]);

  const handleJoinLeave = async () => {
      if (!authUser || !group?.id) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }
      setIsJoiningLeaving(true);
      const docRef = doc(db, "chat_groups", group.id);

      try {
        if (isMember) {
            await updateDoc(docRef, { members: arrayRemove(authUser.uid) });
            toast({ title: "Left Group", description: `You have left ${group.name}.` });
        } else {
            await updateDoc(docRef, { members: arrayUnion(authUser.uid) });
            toast({ title: "Joined Group", description: `You are now a member of ${group.name}.` });
        }
        // No need to setIsMember, onSnapshot will handle the UI update
      } catch (error: any) {
        console.error("Error joining/leaving group:", error);
        toast({ title: "Error", description: error.message, variant: "destructive"});
      } finally {
        setIsJoiningLeaving(false);
      }
  }

  if (isLoading || authLoading) {
    return <GroupSkeleton />;
  }

  if (!group) {
    notFound();
  }
  
  const memberCount = group?.members?.length || 0;

  return (
    <div className="space-y-6">
        <BackButton />
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={group.banner} alt={`${group.name} Banner`} layout="fill" objectFit="cover" data-ai-hint={group.bannerHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={group.avatar} alt={`${group.name} Avatar`} data-ai-hint={group.avatarHint} />
                    <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{group.name}</h1>
                            <p className="text-muted-foreground">{group.description}</p>
                        </div>
                        {authUser && (
                            <Button onClick={handleJoinLeave} disabled={isJoiningLeaving}>
                                {isJoiningLeaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : isMember ? (
                                    "Abandonar Grupo"
                                ) : (
                                    "Unirse al Grupo"
                                )}
                            </Button>
                        )}
                        {!authUser && (<span className="text-sm text-muted-foreground">Log in to join</span>)}
                    </div>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8 text-center text-muted-foreground py-8 glass-card rounded-2xl">
            <MessageSquare className="h-12 w-12 mx-auto text-primary/50 mb-4" />
            <h2 className="text-xl font-headline text-foreground">Zona de Chat</h2>
            <p>La funcionalidad de chat para grupos públicos aparecerá aquí.</p>
        </div>
    </div>
  );
}
