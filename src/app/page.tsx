
"use client";

import { FeedWidget, FeedPostType } from "@/components/dashboard/FeedWidget";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";
import { TutorialsWidget } from "@/components/dashboard/TutorialsWidget";
import { PoliticalSummaryWidget } from "@/components/dashboard/PoliticalSummaryWidget";
import { ProjectsWidget } from "@/components/dashboard/ProjectsWidget";
import { LearningPathWidget } from "@/components/dashboard/LearningPathWidget";

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
    destinations: ["Innovación Sostenible"]
  },
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-2 md:col-span-2 row-span-2">
        <FeedWidget initialFeed={initialFeed} />
      </div>
      <div className="lg:col-span-2 md:col-span-2">
         <PoliticalSummaryWidget />
      </div>
      <div className="lg:col-span-2 md:col-span-2">
        <ProjectsWidget />
      </div>
       <div>
         <AchievementsWidget />
      </div>
       <div>
        <TutorialsWidget />
      </div>
      <div className="lg:col-span-2 md:col-span-2">
         <LearningPathWidget />
      </div>
    </div>
  );
}
