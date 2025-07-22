
"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, updateDoc, DocumentData } from "firebase/firestore";
import { db, storage } from "@/data/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useUser } from "@/context/UserContext";

// --- UI Imports ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit, ImageIcon, Award, Library, PenSquare, Upload, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// --- Component Imports ---
import { ProfileFeed } from "./ProfileFeed";
import { BadgesGrid } from "./BadgesGrid";
import { LibraryGrid, LibraryItem, LibraryFolder } from "./LibraryGrid";
import { CreateProfileForm } from "./CreateProfileForm";
import { AIBannerGenerator } from "./AIBannerGenerator";
import { AIAvatarGenerator } from "./AIAvatarGenerator";

// --- Placeholder Data ---
const initialLibraryItems: LibraryItem[] = [ { id: "vid_001", type: "Video", title: "Dragon over forest", thumbnail: "https://placehold.co/600x400.png", thumbnailHint: "dragon forest", source: "/video-generator", folderId: "folder_videos" }];
const initialFolders: LibraryFolder[] = [ { id: "folder_avatars", name: "Mis Avatares" }, { id: "folder_videos", name: "Videos Generados" }];


function ProfileSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="relative px-4 sm:px-8 pb-8 -mt-24">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Skeleton className="w-32 h-32 rounded-full border-4 border-background ring-4 ring-primary" />
                    <div className="pt-16 flex-grow space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProfileClient() {
  const { user: authUser, profile, loading } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = async (data: { [key: string]: any }) => {
    if (!authUser) return;
    await updateDoc(doc(db, "users", authUser.uid), data);
  };
  
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authUser || !profile) return;
    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
    };
    try {
      await handleUpdateProfile(updatedData);
      setIsProfileDialogOpen(false);
      toast({ title: "Perfil Actualizado" });
    } catch (error) {
      toast({ title: "Error al guardar cambios", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleFileUpload = (file: File, path: 'avatars' | 'banners') => {
    if (!authUser) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const storageRef = ref(storage, `${path}/${authUser.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        toast({ title: "Fallo la subida", variant: "destructive" });
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const fieldToUpdate = path === 'avatars' ? 'avatarUrl' : 'bannerUrl';
        await handleUpdateProfile({ [fieldToUpdate]: downloadURL });
        
        toast({ title: `${path === 'avatars' ? 'Avatar' : 'Banner'} actualizado!` });
        setIsUploading(false);
        if (path === 'avatars') setIsAvatarDialogOpen(false);
        if (path === 'banners') setIsBannerDialogOpen(false);
      }
    );
  };

  const onAvatarGenerated = async (avatarDataUri: string, description: string) => {
      if (!authUser) return;
      setIsUploading(true);
      setUploadProgress(0);
      try {
        // Convert data URI to blob
        const response = await fetch(avatarDataUri);
        const blob = await response.blob();
        const file = new File([blob], "ai_avatar.png", { type: blob.type });

        // Use the existing upload function
        handleFileUpload(file, 'avatars');
        await handleUpdateProfile({ badges: { ...profile?.badges, aiSymbiote: true } });
        
      } catch (error) {
        console.error("Failed to process AI avatar:", error);
        toast({ title: "Error al guardar el avatar de IA", variant: "destructive" });
        setIsUploading(false);
      }
  };

  const onBannerGenerated = async (bannerDataUri: string) => {
      if (!authUser) return;
      setIsUploading(true);
      setUploadProgress(0);
       try {
        const response = await fetch(bannerDataUri);
        const blob = await response.blob();
        const file = new File([blob], "ai_banner.png", { type: blob.type });
        handleFileUpload(file, 'banners');
      } catch (error) {
        console.error("Failed to process AI banner:", error);
        toast({ title: "Error al guardar el banner de IA", variant: "destructive" });
        setIsUploading(false);
      }
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (authUser && !profile) {
     return <CreateProfileForm />;
  }
  
  if (!profile) {
    router.push('/login');
    return <ProfileSkeleton />;
  };

  return (
    <>
      <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
        <Image src={profile.bannerUrl} alt="Profile Banner" layout="fill" objectFit="cover" data-ai-hint="profile banner" />
        <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon className="mr-2 h-4 w-4" /> Editar Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card rounded-2xl">
            <DialogHeader>
              <DialogTitle>Cambiar Banner</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="generate">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">Generar con IA</TabsTrigger>
                <TabsTrigger value="upload">Subir Imagen</TabsTrigger>
              </TabsList>
              <TabsContent value="generate" className="pt-4">
                <AIBannerGenerator currentBanner={profile.bannerUrl} onBannerGenerated={onBannerGenerated} />
                {isUploading && <Progress value={uploadProgress} className="w-full mt-2" />}
              </TabsContent>
              <TabsContent value="upload" className="pt-4">
                <div className="space-y-4">
                    <div className="aspect-video w-full bg-secondary rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden">
                        <p>Sube una imagen (1200x400 recomendado)</p>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'banners')} className="hidden" />
                    </div>
                    <div className="flex justify-center">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                            <Upload className="mr-2 h-4 w-4" /> Seleccionar Imagen
                        </Button>
                    </div>
                    {isUploading && <Progress value={uploadProgress} className="w-full mt-2" />}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative px-4 sm:px-8 pb-8 -mt-24">
          <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="group relative">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={profile.avatarUrl} alt="User Avatar" />
                    <AvatarFallback>{profile.name?.substring(0, 2) || '??'}</AvatarFallback>
                </Avatar>
                <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                  <DialogTrigger asChild>
                     <Button variant="outline" size="icon" className="absolute bottom-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="h-4 w-4" />
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card rounded-2xl">
                     <DialogHeader><DialogTitle>Cambiar Avatar</DialogTitle></DialogHeader>
                     <Tabs defaultValue="generate">
                        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="generate">Generar con IA</TabsTrigger><TabsTrigger value="upload">Subir Imagen</TabsTrigger></TabsList>
                        <TabsContent value="generate" className="pt-4">
                            <AIAvatarGenerator currentAvatar={profile.avatarUrl} onAvatarGenerated={onAvatarGenerated} />
                            {isUploading && <Progress value={uploadProgress} className="w-full mt-2" />}
                        </TabsContent>
                        <TabsContent value="upload" className="pt-4">
                           <div className="space-y-4 text-center">
                              <p>Sube una imagen cuadrada</p>
                              <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'avatars')} className="hidden" />
                              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}><Upload className="mr-2 h-4 w-4" /> Seleccionar Imagen</Button>
                              {isUploading && <Progress value={uploadProgress} className="w-full mt-2" />}
                           </div>
                        </TabsContent>
                     </Tabs>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="pt-16 flex-grow">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                          <h1 className="text-3xl font-bold font-headline">{profile.name}</h1>
                          <p className="text-muted-foreground">{profile.handle}</p>
                      </div>
                      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                          <DialogTrigger asChild><Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Editar Perfil</Button></DialogTrigger>
                          <DialogContent className="glass-card rounded-2xl">
                              <DialogHeader><DialogTitle>Editar Perfil</DialogTitle></DialogHeader>
                              <form onSubmit={handleSaveChanges} className="space-y-4">
                                  <div className="space-y-2"><Label htmlFor="name">Nombre Público</Label><Input id="name" name="name" defaultValue={profile.name} required /></div>
                                  <div className="space-y-2"><Label htmlFor="bio">Biografía</Label><Textarea id="bio" name="bio" defaultValue={profile.bio} className="min-h-[100px]" required /></div>
                                  <DialogFooter>
                                      <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
                                      <Button type="submit" disabled={isUpdating}>{isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Guardar Cambios"}</Button>
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
            <TabsContent value="publications" className="mt-6"><ProfileFeed profile={profile} /></TabsContent>
            <TabsContent value="badges" className="mt-6"><BadgesGrid earnedBadges={profile.badges || {}} /></TabsContent>
            <TabsContent value="library" className="mt-6"><LibraryGrid items={initialLibraryItems} folders={initialFolders} /></TabsContent>
        </Tabs>
      </div>
    </>
  );
}
