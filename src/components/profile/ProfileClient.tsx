"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIAvatarGenerator } from "./AIAvatarGenerator";

export function ProfileClient() {
  const [avatarUrl, setAvatarUrl] = useState("https://placehold.co/128x128.png");
  const [bio, setBio] = useState(
    "Digital nomad exploring the intersections of consciousness and technology. Co-creating the future in the StarSeed Nexus."
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBio = formData.get("bio") as string;
    setBio(newBio);
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <div className="relative h-48 w-full rounded-2xl overflow-hidden">
        <Image src="https://placehold.co/1200x400.png" alt="Profile Banner" layout="fill" objectFit="cover" data-ai-hint="nebula galaxy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      <div className="relative px-4 sm:px-8 pb-8 -mt-24">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
            <AvatarImage src={avatarUrl} alt="User Avatar" data-ai-hint="glowing astronaut" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <div className="pt-16 flex-grow">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Starlight</h1>
                    <p className="text-muted-foreground">@starlight.eth</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your public information and generate a new avatar.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveChanges} className="space-y-4">
                      <AIAvatarGenerator currentAvatar={avatarUrl} onAvatarGenerated={setAvatarUrl} />
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" defaultValue={bio} className="min-h-[100px]" />
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </DialogContent>
                </Dialog>
            </div>
            <p className="mt-4 text-foreground/90">{bio}</p>
          </div>
        </div>
      </div>
    </>
  );
}
