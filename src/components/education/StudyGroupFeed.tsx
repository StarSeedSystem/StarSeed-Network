
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import type { EducationalContent } from "@/types/content-types";

interface StudyGroupFeedProps {
    groupId: string;
}

export function StudyGroupFeed({ groupId }: StudyGroupFeedProps) {
    const [tutorials, setTutorials] = useState<DocumentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!groupId) return;

        const tutorialsCollection = collection(db, "tutorials");
        const q = query(
            tutorialsCollection, 
            where("publishedInProfileId", "==", groupId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tutorialsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTutorials(tutorialsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching group tutorials: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [groupId]);

    if (isLoading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin"/></div>;
    }

    return (
        <div className="space-y-6">
            {tutorials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutorials.map((item) => {
                        const content: EducationalContent = {
                            id: item.id,
                            title: item.title,
                            category: item.category,
                            type: "Tutorial",
                            level: "Principiante",
                            image: `https://placehold.co/600x400/5a5a5a/ffffff?text=${encodeURIComponent(item.category || 'Tutorial')}`,
                            imageHint: item.category,
                            description: item.summary,
                            author: { name: item.authorName, avatar: "", avatarHint: "user avatar" }
                        };
                        return <ContentCard key={item.id} content={content} />;
                    })}
                </div>
            ) : (
                <Card className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">No hay tutoriales publicados en este grupo de estudio todavía.</p>
                </Card>
            )}
        </div>
    );
}
