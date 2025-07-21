
"use client";

import { useState } from "react";
import { CreatePostWidget } from "@/components/dashboard/CreatePostWidget";
import { FeedWidget, FeedPostType } from "@/components/dashboard/FeedWidget";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";
import { TutorialsWidget } from "@/components/dashboard/TutorialsWidget";

const initialFeed: FeedPostType[] = [
  {
    author: "CosmoNaut",
    handle: "cosmo.eth",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "futuristic astronaut",
    content: "Just integrated my consciousness with a stellar nebula. The universe is unbelievably vast and beautiful from this perspective. #transhumanism #starcitizen",
    comments: 12,
    reposts: 5,
    likes: 42,
  },
  {
    author: "GaiaPrime",
    handle: "gaia.sol",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "glowing goddess",
    content: "The latest AR nature overlay for Central Park is live! Experience the primordial forest as it was millions of years ago. A truly humbling experience.",
    comments: 8,
    reposts: 2,
    likes: 33,
  },
];

export default function DashboardPage() {
  const [feed, setFeed] = useState<FeedPostType[]>(initialFeed);

  const handleCreatePost = (content: string) => {
    const newPost: FeedPostType = {
      author: "Starlight",
      handle: "starlight.eth",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "glowing astronaut",
      content: content,
      comments: 0,
      reposts: 0,
      likes: 0,
    };
    setFeed(prevFeed => [newPost, ...prevFeed]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CreatePostWidget onPostCreated={handleCreatePost} />
        <FeedWidget initialFeed={feed} />
      </div>
      <div className="space-y-6">
        <AchievementsWidget />
        <TutorialsWidget />
      </div>
    </div>
  );
}
