
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, BookOpen, Loader2, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { StudyGroupFeed } from "./StudyGroupFeed";
import { BackButton } from "../utils/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudyGroup } from "@/types/content-types";

// --- Import local data ---
import studyGroupData from "@/data/study-groups.json";


interface StudyGroupPageProps {
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

export function StudyGroupPage({ slug }: StudyGroupPageProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const { toast } = useToast();

  const isCreator = authUser && group?.creatorId === authUser.uid;

  useEffect(() => {
    const localData = (studyGroupData.groups as any)[slug];
    if (localData) {
        setGroup(localData);
        setMemberCount(localData.members || 0);
        if(authUser) {
            const joinedPages = JSON.parse(localStorage.getItem('joined_pages') || '{}');
            if (joinedPages[localData.id]) {
                setIsMember(true);
            }
        }
    }
    setIsLoading(false);
  }, [slug, authUser]);

  const handleJoinLeave = () => {
      if (!authUser || !group) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }

      setIsJoiningLeaving(true);
      
      // Simulate the action locally using localStorage
      setTimeout(() => {
        const joinedPages = JSON.parse(localStorage.getItem('joined_pages') || '{}');
        const newIsMember = !isMember;

        if (newIsMember) {
            joinedPages[group.id] = true;
            setMemberCount(prev => prev + 1);
            toast({ title: "Joined Group", description: `You have joined ${group.name}.` });
        } else {
            delete joinedPages[group.id];
            setMemberCount(prev => prev - 1);
            toast({ title: "Left Group", description: `You have left ${group.name}.` });
        }
        
        localStorage.setItem('joined_pages', JSON.stringify(joinedPages));
        setIsMember(newIsMember);
        setIsJoiningLeaving(false);
      }, 300);
  }

  if (isLoading || authLoading) {
    return <StudyGroupSkeleton />;
  }
  
  if (!group) {
    notFound();
  }

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
                            <p className="text-muted-foreground">Tema: {group.topic}</p>
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
                        {!authUser && (<span className="text-sm text-muted-foreground">Log in to join</span>)}
                    </div>
                     <div className="mt-4 text-foreground/90">
                         <p>{group.longDescription || "No detailed description provided."}</p>
                     </div>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="discussions" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="discussions" className="rounded-lg py-2 text-base"><BookOpen className="mr-2 h-4 w-4"/>Debates</TabsTrigger>
                     <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Recursos</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({memberCount})</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Ajustes</TabsTrigger>
                </TabsList>
                <TabsContent value="publications" className="mt-6">
                    {group.id && <StudyGroupFeed groupId={group.id} />}
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
                                 publishedInType: 'study_group',
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
