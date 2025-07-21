
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import type { EducationalContent } from "@/types/content-types";

export default function EducationPage() {
  const [tutorials, setTutorials] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tutorialsCollection = collection(db, "tutorials");
    const q = query(tutorialsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tutorialsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setTutorials(tutorialsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching tutorials: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  return (
    <div className="space-y-8">
       <Card className="glass-card p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar en tutoriales..." className="pl-9 h-12 text-base" />
                </div>
                <Button size="lg" disabled> 
                    Búsqueda Inteligente (Próximamente)
                </Button>
            </div>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline">Recursos Educativos</h2>
        <Button asChild>
          <Link href="/participations/create/tutorial">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Tutorial
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((item) => {
                // Adapt the data from Firestore to the format expected by ContentCard
                const content: EducationalContent = {
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    type: "Tutorial", // We can make this dynamic later
                    level: "Principiante", // We can make this dynamic later
                    image: `https://placehold.co/600x400/5a5a5a/ffffff?text=${encodeURIComponent(item.category)}`, // Placeholder image
                    imageHint: item.category,
                    description: item.summary,
                    author: { name: item.authorName, avatar: "", avatarHint: "user avatar" }
                };
                return <ContentCard key={item.id} content={content} />;
            })}
        </div>
      ) : (
        <div className="text-center py-16 bg-card/50 rounded-lg">
            <h3 className="text-xl font-semibold">No Hay Contenido Educativo Todavía</h3>
            <p className="text-muted-foreground mt-2">¡Sé el primero en compartir tu conocimiento!</p>
        </div>
      )}
    </div>
  );
}
