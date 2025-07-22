
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
import chatGroupData from "@/data/chat-groups.json";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatGroup } from "@/types/content-types";

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
  const [group, setGroup] = useState<ChatGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningLeaving, setIsJoiningLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const localData = (chatGroupData as any)[slug];
    if (localData) {
        setGroup(localData);
        setMemberCount(localData.members || 0);
        setIsLoading(false);
    } else {
        // In a real app, you would fetch from Firestore here as a fallback
        setGroup(null);
        setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (group && authUser) {
        const localMembers = JSON.parse(localStorage.getItem('joined_pages') || '{}');
        setIsMember(!!localMembers[group.id]);
    }
  }, [group, authUser]);

  const handleJoinLeave = () => {
      if (!authUser || !group?.id) {
          toast({ title: "Authentication Required", variant: "destructive" });
          return;
      }
      setIsJoiningLeaving(true);
      setTimeout(() => {
        const localMembers = JSON.parse(localStorage.getItem('joined_pages') || '{}');
        const newIsMember = !isMember;

        if (newIsMember) {
            localMembers[group.id] = true;
            setMemberCount(prev => prev + 1);
            toast({ title: "Joined Group", description: `Welcome to ${group.name}!` });
        } else {
            delete localMembers[group.id];
            setMemberCount(prev => prev - 1);
            toast({ title: "Left Group", description: `You have left ${group.name}.` });
        }
        
        localStorage.setItem('joined_pages', JSON.stringify(localMembers));
        setIsMember(newIsMember);
        setIsJoiningLeaving(false);
      }, 300);
  }

  if (isLoading || authLoading) {
    return <GroupSkeleton />;
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
