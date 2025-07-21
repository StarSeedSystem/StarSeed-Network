

import { ProfileClient } from "@/components/profile/ProfileClient";
import type { LibraryItem, LibraryFolder } from "@/components/profile/LibraryGrid";

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
      <ProfileClient 
        initialLibraryItems={initialLibraryItems} 
        initialFolders={initialFolders}
        viewMode="libraryOnly" />
    </div>
  );
}
