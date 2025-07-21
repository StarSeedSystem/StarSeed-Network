
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeedPost, FeedPostType } from "./FeedPost";

export { type FeedPostType };

interface FeedWidgetProps {
  feeds: {
    all: FeedPostType[];
    following: FeedPostType[];
    communities: FeedPostType[];
  }
}

export function FeedWidget({ feeds }: FeedWidgetProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'communities'>('all');
  
  const currentFeed = feeds[activeFilter];

  return (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <Button 
                variant={activeFilter === 'all' ? 'secondary' : 'ghost'} 
                className="rounded-full"
                onClick={() => setActiveFilter('all')}
            >
                All
            </Button>
            <Button 
                variant={activeFilter === 'following' ? 'secondary' : 'ghost'} 
                className="rounded-full"
                onClick={() => setActiveFilter('following')}
            >
                Following
            </Button>
            <Button 
                variant={activeFilter === 'communities' ? 'secondary' : 'ghost'} 
                className="rounded-full"
                onClick={() => setActiveFilter('communities')}
            >
                Communities
            </Button>
        </div>
        <div className="space-y-4">
            {currentFeed && currentFeed.length > 0 ? (
                currentFeed.map((item, index) => (
                    <FeedPost key={`${activeFilter}-${item.handle}-${index}`} post={item} />
                ))
            ) : (
                <Card className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">No posts in this category yet.</p>
                </Card>
            )}
        </div>
    </div>
  );
}
