import { ProfileClient } from "@/components/profile/ProfileClient";
import { BadgesGrid } from "@/components/profile/BadgesGrid";
import { FeedWidget } from "@/components/dashboard/FeedWidget";
import { NatalChartWidget } from "@/components/profile/NatalChartWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListVideo, Award, Library } from "lucide-react";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LibraryPlaceholder() {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Mi Biblioteca</CardTitle>
                <CardDescription>Tu ecosistema personal de apps, archivos y avatares.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">La gestión de tu biblioteca personal estará disponible aquí próximamente.</p>
            </CardContent>
        </Card>
    )
}


export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileClient />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card/60 rounded-xl">
                <TabsTrigger value="posts" className="rounded-lg">
                  <ListVideo className="mr-2 h-4 w-4"/>
                  Publicaciones
                  </TabsTrigger>
                <TabsTrigger value="badges" className="rounded-lg">
                  <Award className="mr-2 h-4 w-4"/>
                  Insignias
                </TabsTrigger>
                <TabsTrigger value="library" className="rounded-lg">
                  <Library className="mr-2 h-4 w-4"/>
                  Biblioteca
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6">
                <FeedWidget />
              </TabsContent>
              <TabsContent value="badges" className="mt-6">
                <BadgesGrid />
              </TabsContent>
              <TabsContent value="library" className="mt-6">
                <LibraryPlaceholder />
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
