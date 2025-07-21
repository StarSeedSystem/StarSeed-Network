

"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeedPost, FeedPostType } from "../dashboard/FeedPost";

export function ProfileFeed({ initialFeed }: { initialFeed: FeedPostType[] }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'profile' | 'communities'>('all');
  
  const currentFeed = useMemo(() => {
    switch(activeFilter) {
      case 'profile':
        return initialFeed.filter(post => post.destinations?.includes("Profile") && post.destinations.length === 1);
      case 'communities':
        return initialFeed.filter(post => post.destinations && post.destinations.some(d => d !== "Profile"));
      case 'all':
      default:
        return initialFeed;
    }
  }, [activeFilter, initialFeed]);


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
