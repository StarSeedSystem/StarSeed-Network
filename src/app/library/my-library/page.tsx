
import { ProfileClient } from "@/components/profile/ProfileClient";
import { NatalChartWidget } from "@/components/profile/NatalChartWidget";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";

// Placeholder data for generated content. In a real app, this would come from a database.
const initialLibraryItems = [
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


export default function MyLibraryPage() {
  return (
    <div className="space-y-8">
        {/* This page reuses the ProfileClient component to show the user's library in a dedicated view */}
        {/* We can hide non-library parts of the profile if needed, but for now this is a good way to keep it DRY */}
      <ProfileClient initialLibraryItems={initialLibraryItems} viewMode="libraryOnly" />
    </div>
  );
}
