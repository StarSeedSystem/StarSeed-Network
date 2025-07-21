
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [group, setGroup] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // Fetch data from the 'study_groups' collection using the slug as the ID
    const docRef = doc(db, "study_groups", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setGroup({ id: doc.id, ...doc.data() });
      } else {
        setGroup(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  if (isLoading) {
    return <StudyGroupSkeleton />;
  }

  if (!group) {
    notFound();
  }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={group.bannerUrl} alt={`${group.name} Banner`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={group.avatarUrl} alt={`${group.name} Avatar`} />
                    <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{group.name}</h1>
                            <p className="text-muted-foreground">Topic: {group.topic}</p>
                        </div>
                        <Button>Join Group</Button>
                    </div>
                    {/* Add group description/long description here if available */}
                     <div className="mt-4 text-foreground/90">
                        {/* Placeholder for full description if you add it to the form */}
                         <p>{group.description || "No detailed description provided."}</p>
                     </div>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="discussions" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="discussions" className="rounded-lg"><BookOpen className="mr-2 h-4 w-4"/>Discussions</TabsTrigger>
                     <TabsTrigger value="publications" className="rounded-lg"><PenSquare className="mr-2 h-4 w-4"/>Resources</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg"><Users className="mr-2 h-4 w-4"/>Members</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg"><Settings className="mr-2 h-4 w-4"/>Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="discussions" className="mt-6">
                    <div className="text-center text-muted-foreground py-8">Group discussions and activities will appear here.</div>
                </TabsContent>
                {/* Other Tabs Content */}
            </Tabs>
        </div>
    </div>
  );
}
