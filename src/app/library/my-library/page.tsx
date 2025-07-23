

"use client";

import { ProfileClient } from "@/components/profile/ProfileClient";
import type { LibraryItem, LibraryFolder } from "@/components/profile/LibraryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, LayoutDashboard } from "lucide-react";
import { WidgetLibrary } from "@/components/dashboard/WidgetLibrary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


// Placeholder data for generated content. In a real app, this would come from a database.
const initialLibraryItems: LibraryItem[] = [
    {
        id: "vid_001",
        type: "Video",
        title: "Dragon over forest",
        thumbnail: "https://placehold.co/600x400.png",
        thumbnailHint: "dragon forest",
        source: "/video-generator",
        folderId: "folder_videos"
    },
    {
        id: "img_001",
        type: "Avatar",
        title: "AI Symbiote",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "glowing astronaut",
        source: "/avatar-generator",
        folderId: "folder_avatars"
    },
    {
        id: "img_002",
        type: "Avatar",
        title: "Ciber-Druida",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "cyber druid",
        source: "/avatar-generator",
        folderId: "folder_avatars"
    },
    {
        id: "img_003",
        type: "Image",
        title: "Logo para 'Innovación Sostenible'",
        thumbnail: "https://placehold.co/400x400.png",
        thumbnailHint: "green logo",
        source: "/agent",
        folderId: "folder_proyectos"
    }
];

const initialFolders: LibraryFolder[] = [
    { id: "folder_proyectos", name: "Proyectos en Curso" },
    { id: "folder_avatars", name: "Mis Avatares" },
    { id: "folder_videos", name: "Videos Generados" },
];


export default function MyLibraryPage() {
  return (
    <div className="space-y-8">
        <Tabs defaultValue="files" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="files" className="rounded-lg py-2 text-base">
                    <Folder className="mr-2 h-5 w-5" />
                    Mis Archivos y Creaciones
                </TabsTrigger>
                <TabsTrigger value="widgets" className="rounded-lg py-2 text-base">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Biblioteca de Widgets
                </TabsTrigger>
            </TabsList>
            <TabsContent value="files" className="mt-6">
                 <ProfileClient 
                    initialLibraryItems={initialLibraryItems} 
                    initialFolders={initialFolders}
                    viewMode="libraryOnly" />
            </TabsContent>
            <TabsContent value="widgets" className="mt-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Biblioteca de Widgets del Dashboard</CardTitle>
                        <CardDescription>Explora, añade y gestiona los widgets para personalizar tu dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WidgetLibrary onSelectWidget={() => {}} />
                    </CardContent>
                </Card>
            </TabsContent>
      </Tabs>
    </div>
  );
}
