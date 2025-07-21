

import { ProfileClient } from "@/components/profile/ProfileClient";
import { NatalChartWidget } from "@/components/profile/NatalChartWidget";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";

// Placeholder data for generated content. In a real app, this would come from a database.
const libraryItems = [
    {
        id: "vid_001",
        type: "Video",
        title: "Dragon over forest",
        thumbnail: "https://placehold.co/600x400.png",
        thumbnailHint: "dragon forest",
        source: "/video-generator",
    },
    {
        id: "img_001",
        type: "Avatar",
        title: "AI Symbiote",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "glowing astronaut",
        source: "/avatar-generator",
    }
];


export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileClient libraryItems={libraryItems} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* The main content area including Badges and Library is now managed within ProfileClient */}
        <div className="lg:col-span-2" />
        <div className="space-y-8 lg:col-start-3">
            <NatalChartWidget />
            <AchievementsWidget />
        </div>
      </div>
    </div>
  );
}
