

"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Image as ImageIcon, Calendar as CalendarIcon, Clock, MapPin, Award, Library, PenSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIAvatarGenerator } from "./AIAvatarGenerator";
import { PrivacySettings } from "./PrivacySettings";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AIBannerGenerator } from "./AIBannerGenerator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgesGrid } from "./BadgesGrid";
import { LibraryGrid, LibraryItem, LibraryFolder } from "./LibraryGrid";
import { ProfileFeed } from "./ProfileFeed";
import type { FeedPostType } from "../dashboard/FeedPost";
import { NatalChartWidget } from "./NatalChartWidget";
import { AchievementsWidget } from "../dashboard/AchievementsWidget";
import { useUser } from "@/context/UserContext";

interface ProfileClientProps {
  initialLibraryItems: LibraryItem[];
  initialFolders?: LibraryFolder[];
  viewMode?: "full" | "libraryOnly";
}

const userPosts: FeedPostType[] = [
    {
        author: "Starlight",
        handle: "starlight.eth",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing astronaut",
        content: "Just broadcasted my first message across the Nexus! The journey begins.",
        comments: 2,
        reposts: 0,
        likes: 15,
        destinations: ["Profile", "Innovación Sostenible"]
    },
    {
        author: "Starlight",
        handle: "starlight.eth",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing astronaut",
        content: "My new AI-generated avatar is ready. A small step in forging a new digital identity.",
        comments: 8,
        reposts: 1,
        likes: 42,
        destinations: ["Profile"]
    }
]

export function ProfileClient({ initialLibraryItems, initialFolders = [], viewMode = "full" }: ProfileClientProps) {
  const { user, setUser } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(initialLibraryItems);
  const { toast } = useToast();

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBio = formData.get("bio") as string;
    
    setUser(prevUser => ({...prevUser, bio: newBio}));

    setIsDialogOpen(false);
     toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleAvatarGenerated = (newAvatarUrl: string, description: string) => {
    setUser(prevUser => ({...prevUser, avatarUrl: newAvatarUrl}));
    
    // Add new avatar to library
    const newLibraryItem: LibraryItem = {
      id: `img_${Date.now()}`,
      type: "Avatar",
      title: description || "New AI Avatar",
      thumbnail: newAvatarUrl,
      thumbnailHint: "ai generated",
      source: "/avatar-generator",
      folderId: "folder_avatars" // Assuming a folder for avatars exists
    };
    setLibraryItems(prev => [newLibraryItem, ...prev]);

    if (!user.badges.aiSymbiote) {
       setUser(prev => ({ ...prev, badges: { ...prev.badges, aiSymbiote: true } }));
       toast({
        title: "¡Insignia Desbloqueada!",
        description: "Has obtenido la insignia 'AI Symbiote'. Tu nuevo avatar está listo y guardado en tu biblioteca.",
        duration: 5000,
       });
    } else {
        toast({
            title: "Avatar actualizado",
            description: "Tu nuevo avatar ha sido guardado en tu biblioteca.",
        });
    }
  }

  const handleBannerGenerated = (newBannerUrl: string) => {
    setUser(prevUser => ({...prevUser, bannerUrl: newBannerUrl}));
  }
  
  return (
    <>
    {viewMode === "full" && (
        <>
            <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
                <Image src={user.bannerUrl} alt="Profile Banner" layout="fill" objectFit="cover" data-ai-hint="nebula galaxy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="mr-2 h-4 w-4" /> Edit Banner
                    </Button>
                </DialogTrigger>
                <DialogContent className="glass-card rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Generate New Banner</DialogTitle>
                        <DialogDescription>
                            Describe the banner you want to create with AI.
                        </DialogDescription>
                    </DialogHeader>
                    <AIBannerGenerator currentBanner={user.bannerUrl} onBannerGenerated={handleBannerGenerated} />
                </DialogContent>
                </Dialog>
            </div>
            <div className="relative px-4 sm:px-8 pb-8 -mt-24">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={user.avatarUrl} alt="User Avatar" data-ai-hint="glowing astronaut" />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                            <p className="text-muted-foreground">{user.handle}</p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card rounded-2xl max-w-2xl">
                            <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Update your public information, generate a new avatar, and set your privacy controls.
                            </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSaveChanges} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
                            <AIAvatarGenerator currentAvatar={user.avatarUrl} onAvatarGenerated={handleAvatarGenerated} />
                            
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" name="bio" defaultValue={user.bio} className="min-h-[100px]" />
                            </div>

                            <div>
                                <h3 className="text-lg font-headline font-semibold mb-2">Carta Natal Astrológica</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border bg-background/50">
                                <div className="space-y-2">
                                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !birthDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {birthDate ? format(birthDate, "PPP") : <span>Elige una fecha</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 glass-card">
                                        <Calendar
                                            mode="single"
                                            selected={birthDate}
                                            onSelect={setBirthDate}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                        <Label htmlFor="birthTime">Hora de Nacimiento</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="birthTime" name="birthTime" type="time" className="pl-9" />
                                        </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="birthPlace">Lugar de Nacimiento</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="birthPlace" name="birthPlace" placeholder="Ciudad, País" className="pl-9"/>
                                        </div>
                                </div>
                                </div>
                            </div>

                            <PrivacySettings />
                            
                            <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4 -mx-1 -mb-1 px-1">
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                            </form>
                        </DialogContent>
                        </Dialog>
                    </div>
                    <p className="mt-4 text-foreground/90">{user.bio}</p>
                </div>
                </div>
            </div>
            <div className="px-4 sm:px-8">
                <Tabs defaultValue="publications" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-card/60 rounded-xl">
                    <TabsTrigger value="publications" className="rounded-lg">
                        <PenSquare className="mr-2 h-4 w-4"/>
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
                    <TabsContent value="publications" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                             <div className="lg:col-span-2 space-y-4">
                                <ProfileFeed initialFeed={userPosts} />
                             </div>
                             <div className="space-y-8 lg:col-start-3">
                                <NatalChartWidget />
                                <AchievementsWidget />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="badges" className="mt-6">
                    <BadgesGrid earnedBadges={user.badges} />
                    </TabsContent>
                    <TabsContent value="library" className="mt-6">
                        <LibraryGrid items={libraryItems} folders={initialFolders} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )}
    {viewMode === "libraryOnly" && (
         <div className="px-4 sm:px-8">
             <LibraryGrid items={libraryItems} folders={initialFolders} />
         </div>
    )}
    </>
  );
}
