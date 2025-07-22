
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
  const { toast } = useToast();

  // Check if the authenticated user is a member of this community
  const isMember = authUser && community?.members?.includes(authUser.uid);

  useEffect(() => {
    if (!slug) return;

    const docRef = doc(db, "communities", slug);
    // Use onSnapshot to get real-time updates, including the members array
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
  }, [slug]); // Depend on slug

  const handleJoinLeave = async () => {
      // Ensure user is logged in and community data is loaded
      if (!authUser || !community?.id) {
          toast({ title: "Authentication Required", description: "You must be logged in to join or leave.", variant: "destructive" });
          return;
      }

      setIsJoiningLeaving(true); // Indicate loading state
      try {
          const communityRef = doc(db, "communities", community.id);
          if (isMember) {
              // User is a member, so they want to leave
              await updateDoc(communityRef, {
                  members: arrayRemove(authUser.uid) // Remove user's UID from the members array
              });
              toast({ title: "Left Community", description: `You have left ${community.name}.` });
          } else {
              // User is not a member, so they want to join
              await updateDoc(communityRef, {
                  members: arrayUnion(authUser.uid) // Add user's UID to the members array
              });
               // We might also want to add a default role or other data here
              toast({ title: "Joined Community", description: `Welcome to ${community.name}!` });
          }
      } catch (error) {
          console.error("Error joining/leaving community:", error);
          toast({ title: "Action Failed", description: "Could not update your membership status.", variant: "destructive" });
      } finally {
          setIsJoiningLeaving(false); // End loading state
      }
  }

  if (isLoading) {
    return <CommunitySkeleton />;
  }

  if (!community) {
    // If community data is not found after loading, show not-found page
    notFound();
  }

   // Don't render the full content until auth state is known
  if (authLoading) {
      return <CommunitySkeleton />;
  }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            {/* Use optional chaining (?.) in case community is null temporarily */}
            <Image src={community?.banner || ''} alt="Community Banner" layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                {/* Use optional chaining (?.) for avatar URL and name */}
                <AvatarImage src={community?.avatar || ''} alt="Community Avatar" />
                <AvatarFallback>{community?.name?.substring(0, 2) || ''}</AvatarFallback>
            </Avatar>
            <div className="pt-16 flex-grow">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        {/* Use optional chaining (?.) for name and description */}
                        <h1 className="text-3xl font-bold font-headline">{community?.name}</h1>
                        <p className="text-muted-foreground">{community?.description}</p>
                    </div>
                    {/* Join/Leave Button - Only show if authUser is loaded */}
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
                    {!authUser && !authLoading && ( // Show a message if user is not logged in
                        <span className="text-sm text-muted-foreground">Log in to join</span>
                    )}
                </div>
                {/* Use optional chaining (?.) for long description */}
                <p className="mt-4 text-foreground/90">{community?.longDescription}</p>
            </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="publications" className="w-full">
                {/* Update Members tab to show the count from Firestore */}
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="publications" className="rounded-lg py-2 text-base"><PenSquare className="mr-2 h-4 w-4"/>Publicaciones</TabsTrigger>
                <TabsTrigger value="members" className="rounded-lg py-2 text-base"><Users className="mr-2 h-4 w-4"/>Miembros ({community?.members ? community.members.length : 0})</TabsTrigger>
                <TabsTrigger value="goals" className="rounded-lg py-2 text-base">Objetivos</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg py-2 text-base" disabled>Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="publications" className="mt-6">
                    {/* The community feed will go here */}
                    <div className="text-center text-muted-foreground py-8">Las publicaciones de la comunidad aparecerán aquí.</div>
                </TabsContent>
                <TabsContent value="members" className="mt-6">
                     {/* We will display members here later */}
                     <div className="text-center text-muted-foreground py-8">La lista de miembros aparecerá aquí.</div>
                </TabsContent>
                {/* Other Tabs Content */}
            </Tabs>
        </div>
    </div>
  );
}
