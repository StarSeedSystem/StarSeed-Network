
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Users, Settings, Gavel } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [entity, setEntity] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Error fetching federated entity:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  if (isLoading) {
    return <EntitySkeleton />;
  }

  if (!entity) {
    notFound();
  }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={entity.banner} alt={`${entity.name} Banner`} layout="fill" objectFit="cover" data-ai-hint={entity.bannerHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={entity.avatar} alt={`${entity.name} Avatar`} data-ai-hint={entity.avatarHint} />
                    <AvatarFallback>{entity.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{entity.name}</h1>
                            <p className="text-muted-foreground">Type: {entity.type}</p>
                        </div>
                        <Button>Request Membership</Button>
                    </div>
                    <p className="mt-4 text-foreground/90">{entity.description}</p>
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="directives" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                    <TabsTrigger value="directives" className="rounded-lg"><Gavel className="mr-2 h-4 w-4"/>Directives</TabsTrigger>
                    <TabsTrigger value="publications" className="rounded-lg"><PenSquare className="mr-2 h-4 w-4"/>Publications</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-lg"><Users className="mr-2 h-4 w-4"/>Members</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg"><Settings className="mr-2 h-4 w-4"/>Settings</TabsTrigger>
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
