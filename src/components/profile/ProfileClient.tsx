
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";

// --- UI Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit, ImageIcon, Award, Library, PenSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Component Imports ---
import { ProfileFeed } from "./ProfileFeed";
import { BadgesGrid } from "./BadgesGrid";
import { LibraryGrid, LibraryItem, LibraryFolder } from "./LibraryGrid";
import { AIBannerGenerator } from "./AIBannerGenerator";
import { AIAvatarGenerator } from "./AIAvatarGenerator";

// --- Placeholder Data ---
const initialLibraryItems: LibraryItem[] = [ { id: "vid_001", type: "Video", title: "Dragon over forest", thumbnail: "https://placehold.co/600x400.png", thumbnailHint: 'dragon forest', source: "/video-generator", folderId: "folder_videos" }];
const initialFolders: LibraryFolder[] = [ { id: "folder_avatars", name: "Mis Avatares" }, { id: "folder_videos", name: "Videos Generados" }];

export function ProfileClient() {
  const { user: authUser, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // --- Real-time Profile Subscription ---
  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      router.push('/login');
      return;
    }

    const docRef = doc(db, "users", authUser.uid);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setProfile({ id: doc.id, ...doc.data() });
      } else {
        // If profile doesn't exist, redirect to creation page
        router.push('/profile/create');
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [authUser, authLoading, router]);

  // --- Profile Update Handlers ---
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authUser || !profile) return;
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      bio: formData.get("bio") as string,
      name: formData.get("name") as string,
      handle: formData.get("handle") as string,
    };

    try {
      const docRef = doc(db, "users", authUser.uid);
      await updateDoc(docRef, updatedData);
      
      setIsEditOpen(false);
      toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast({ title: "Error", description: "Could not save your changes.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateField = async (field: string, value: any) => {
    if (!authUser) return;
    try {
      await updateDoc(doc(db, "users", authUser.uid), { [field]: value });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast({ title: "Error", description: `Could not update ${field}.`, variant: "destructive" });
    }
  };
  
  const handleBannerGenerated = async (newBannerUrl: string) => {
    await handleUpdateField('bannerUrl', newBannerUrl);
    setIsBannerOpen(false);
  };

  const handleAvatarGenerated = async (newAvatarUrl: string, description: string) => {
    await handleUpdateField('avatarUrl', newAvatarUrl);
    await handleUpdateField('badges.aiSymbiote', true);
    setIsAvatarOpen(false);
    toast({
        title: "¡Insignia Desbloqueada!",
        description: "Has obtenido la insignia 'AI Symbiote'. ¡Tu nuevo avatar está listo!",
        duration: 5000,
    });
  };

  if (authLoading || isLoading) {
    return <div className="text-center p-10">
      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      <p className="mt-2 text-muted-foreground">Loading Profile...</p>
    </div>;
  }

  if (!profile) {
    // This case is handled by the redirect in useEffect, but as a fallback:
    return <div className="text-center p-10">
        <p>Redirigiendo a la creación de perfil...</p>
    </div>
  }
  
  return (
    <>
      <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
        <Image src={profile.bannerUrl} alt="Profile Banner" layout="fill" objectFit="cover" data-ai-hint="futuristic space" />
        <Dialog open={isBannerOpen} onOpenChange={setIsBannerOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="mr-2 h-4 w-4" /> Generar Banner
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Generador de Banners con IA</DialogTitle>
                    <DialogDescription>Crea un nuevo banner para tu perfil usando IA.</DialogDescription>
                </DialogHeader>
                <AIBannerGenerator currentBanner={profile.bannerUrl} onBannerGenerated={handleBannerGenerated} />
            </DialogContent>
        </Dialog>
      </div>

      <div className="relative px-4 sm:px-8 pb-8 -mt-24">
          <div className="flex flex-col sm:flex-row items-start gap-6">
              <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
                <DialogTrigger asChild>
                    <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary cursor-pointer transition-all hover:ring-accent hover:scale-105">
                        <AvatarImage src={profile.avatarUrl} alt="User Avatar" />
                        <AvatarFallback>{profile.name?.substring(0, 2) || '??'}</AvatarFallback>
                    </Avatar>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-xl">
                     <DialogHeader>
                        <DialogTitle>Generador de Avatares con IA</DialogTitle>
                        <DialogDescription>Crea un nuevo avatar o modifica el actual.</DialogDescription>
                    </DialogHeader>
                    <AIAvatarGenerator currentAvatar={profile.avatarUrl} onAvatarGenerated={handleAvatarGenerated} />
                </DialogContent>
              </Dialog>
              <div className="pt-16 flex-grow">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                          <h1 className="text-3xl font-bold font-headline">{profile.name}</h1>
                          <p className="text-muted-foreground">{profile.handle}</p>
                      </div>
                      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                          <DialogTrigger asChild><Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button></DialogTrigger>
                          <DialogContent className="glass-card rounded-2xl max-w-2xl">
                              <DialogHeader><DialogTitle>Edit Profile</DialogTitle><DialogDescription>Update your public information.</DialogDescription></DialogHeader>
                              <form onSubmit={handleSaveChanges} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
                                  <div className="space-y-2"><Label htmlFor="name">Display Name</Label><Input id="name" name="name" defaultValue={profile.name} required /></div>
                                  <div className="space-y-2"><Label htmlFor="handle">Handle</Label><Input id="handle" name="handle" defaultValue={profile.handle} required /></div>
                                  <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" defaultValue={profile.bio} className="min-h-[100px]" required /></div>
                                  <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4 -mx-1 -mb-1 px-1">
                                      <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                      <Button type="submit" disabled={isUpdating}>{isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save Changes"}</Button>
                                  </DialogFooter>
                              </form>
                          </DialogContent>
                      </Dialog>
                  </div>
                  <p className="mt-4 text-foreground/90">{profile.bio}</p>
              </div>
          </div>
      </div>
      
      <div className="px-4 sm:px-8">
        <Tabs defaultValue="publications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/60 rounded-xl">
              <TabsTrigger value="publications" className="rounded-lg"><PenSquare className="mr-2 h-4 w-4"/>Publicaciones</TabsTrigger>
              <TabsTrigger value="badges" className="rounded-lg"><Award className="mr-2 h-4 w-4"/>Insignias</TabsTrigger>
              <TabsTrigger value="library" className="rounded-lg"><Library className="mr-2 h-4 w-4"/>Biblioteca</TabsTrigger>
            </TabsList>
            <TabsContent value="publications" className="mt-6">
                <ProfileFeed profile={profile} />
            </TabsContent>
            <TabsContent value="badges" className="mt-6">
                <BadgesGrid earnedBadges={profile.badges || {}} />
            </TabsContent>
            <TabsContent value="library" className="mt-6">
                <LibraryGrid items={initialLibraryItems} folders={initialFolders} />
            </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
