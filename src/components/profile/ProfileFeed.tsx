
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeedPost, FeedPostType } from "../dashboard/FeedPost";

const profileOnlyFeed: FeedPostType[] = [
    {
        author: "Starlight",
        handle: "starlight.eth",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing astronaut",
        content: "My new AI-generated avatar is ready. A small step in forging a new digital identity.",
        comments: 8,
        reposts: 1,
        likes: 42,
        destinations: ["Profile"]
    }
];

const communitiesFeed: FeedPostType[] = [
    {
        author: "Starlight",
        handle: "starlight.eth",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing astronaut",
        content: "Just broadcasted my first message across the Nexus! The journey begins.",
        comments: 2,
        reposts: 0,
        likes: 15,
        destinations: ["Profile", "Innovación Sostenible"]
    },
];

export function ProfileFeed({ initialFeed }: { initialFeed: FeedPostType[] }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'profile' | 'communities'>('all');
  
  const feedData = {
    all: initialFeed,
    profile: profileOnlyFeed,
    communities: communitiesFeed,
  };

  const currentFeed = feedData[activeFilter];

  return (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <Button 
                variant={activeFilter === 'all' ? 'secondary' : 'ghost'} 
                className="rounded-full"
                onClick={() => setActiveFilter('all')}
            >
                Todas
            </Button>
            <Button 
                variant={activeFilter === 'profile' ? 'secondary' : 'ghost'} 
                className="rounded-full"
                onClick={() => setActiveFilter('profile')}
            >
                Solo en Perfil
            </Button>
            <Button 
                variant={activeFilter === 'communities' ? 'secondary' : 'ghost'} 
                className="rounded-full"
                onClick={() => setActiveFilter('communities')}
            >
                En Comunidades
            </Button>
        </div>
        <div className="space-y-4">
            {currentFeed.length > 0 ? (
                currentFeed.map((item, index) => (
                    <FeedPost key={`${activeFilter}-${item.handle}-${index}`} post={item} />
                ))
            ) : (
                <Card className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">No hay publicaciones en esta categoría.</p>
                </Card>
            )}
        </div>
    </div>
  );
}
