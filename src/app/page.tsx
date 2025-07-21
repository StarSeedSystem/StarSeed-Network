
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Columna Izquierda */}
      <div className="w-full lg:w-1/4 space-y-8">
        <PoliticalSummaryWidget />
        <AchievementsWidget />
        <TutorialsWidget />
      </div>

      {/* Columna Central (Principal) */}
      <div className="w-full lg:w-1/2 space-y-8">
        <FeedWidget initialFeed={initialFeed} />
      </div>

      {/* Columna Derecha */}
      <div className="w-full lg:w-1/4 space-y-8">
        <ProjectsWidget />
        <LearningPathWidget />
      </div>
    </div>
  );
}
