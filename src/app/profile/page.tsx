
import { ProfileClient } from "@/components/profile/ProfileClient";
import { BadgesGrid } from "@/components/profile/BadgesGrid";
import { NatalChartWidget } from "@/components/profile/NatalChartWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Library } from "lucide-react";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";
import { LibraryGrid } from "@/components/profile/LibraryGrid";

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
      <ProfileClient />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="badges" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card/60 rounded-xl">
                <TabsTrigger value="badges" className="rounded-lg">
                  <Award className="mr-2 h-4 w-4"/>
                  Insignias
                </TabsTrigger>
                <TabsTrigger value="library" className="rounded-lg">
                  <Library className="mr-2 h-4 w-4"/>
                  Biblioteca
                </TabsTrigger>
              </TabsList>
              <TabsContent value="badges" className="mt-6">
                <BadgesGrid earnedBadges={{}} />
              </TabsContent>
              <TabsContent value="library" className="mt-6">
                 <LibraryGrid items={libraryItems} />
              </TabsContent>
            </Tabs>
        </div>
        <div className="space-y-8">
            <NatalChartWidget />
            <AchievementsWidget />
        </div>
      </div>
    </div>
  );
}
