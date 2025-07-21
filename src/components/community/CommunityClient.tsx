
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Award, Users, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommunityClientProps {
  slug: string;
}

function CommunitySkeleton() {
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

export function CommunityClient({ slug }: CommunityClientProps) {
  const [community, setCommunity] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const docRef = doc(db, "communities", slug);
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
        setCommunity(null);
    });

    return () => unsubscribe();
  }, [slug]);

  if (isLoading) {
    return <CommunitySkeleton />;
  }

  if (!community) {
    notFound();
  }

  return (
    <div>
        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
            <Image src={community.banner} alt="Community Banner" layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-4 sm:px-8 pb-8 -mt-24">
            <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                <AvatarImage src={community.avatar} alt="Community Avatar" />
                <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="pt-16 flex-grow">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{community.name}</h1>
                        <p className="text-muted-foreground">{community.description}</p>
                    </div>
                    {/* TODO: Add Join/Leave/Settings button logic here */}
                    <Button>Unirse a la Comunidad</Button>
                </div>
                <p className="mt-4 text-foreground/90">{community.longDescription}</p>
            </div>
            </div>
        </div>

        <div className="px-4 sm:px-8">
            <Tabs defaultValue="publications" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/60 rounded-xl">
                <TabsTrigger value="publications" className="rounded-lg"><PenSquare className="mr-2 h-4 w-4"/>Publicaciones</TabsTrigger>
                <TabsTrigger value="members" className="rounded-lg"><Users className="mr-2 h-4 w-4"/>Miembros</TabsTrigger>
                <TabsTrigger value="goals" className="rounded-lg"><Award className="mr-2 h-4 w-4"/>Objetivos</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg"><Settings className="mr-2 h-4 w-4"/>Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="publications" className="mt-6">
                    {/* The community feed will go here */}
                    <div className="text-center text-muted-foreground py-8">Las publicaciones de la comunidad aparecerán aquí.</div>
                </TabsContent>
                {/* Other Tabs Content */}
            </Tabs>
        </div>
    </div>
  );
}
