import { ProfileClient } from "@/components/profile/ProfileClient";
import { BadgesGrid } from "@/components/profile/BadgesGrid";
import { FeedWidget } from "@/components/dashboard/FeedWidget";
import { NatalChartWidget } from "@/components/profile/NatalChartWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListVideo, Award } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileClient />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card/60 rounded-xl">
                <TabsTrigger value="posts" className="rounded-lg">
                  <ListVideo className="mr-2 h-4 w-4"/>
                  Mis Publicaciones
                  </TabsTrigger>
                <TabsTrigger value="badges" className="rounded-lg">
                  <Award className="mr-2 h-4 w-4"/>
                  Insignias
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6">
                <FeedWidget />
              </TabsContent>
              <TabsContent value="badges" className="mt-6">
                <BadgesGrid />
              </TabsContent>
            </Tabs>
        </div>
        <div className="space-y-8">
            <NatalChartWidget />
        </div>
      </div>
    </div>
  );
}
