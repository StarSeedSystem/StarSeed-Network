"use client";

import { useState, useTransition } from "react";
import { generateAvatar } from "@/ai/flows/generate-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AIAvatarGenerator({
  currentAvatar,
  onAvatarGenerated,
}: {
  currentAvatar: string;
  onAvatarGenerated: (url: string) => void;
}) {
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!description) {
      toast({
        variant: "destructive",
        title: "Description missing",
        description: "Please describe the avatar you want to create.",
      });
      return;
    }

    startTransition(async () => {
      setGeneratedAvatar(null);
      try {
        const result = await generateAvatar({ description });
        if (result.avatarDataUri) {
          setGeneratedAvatar(result.avatarDataUri);
        } else {
          throw new Error("Avatar generation did not return a data URI.");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate avatar. The model may be offline.",
        });
      }
    });
  };

  const handleUseAvatar = () => {
    if (generatedAvatar) {
      onAvatarGenerated(generatedAvatar);
      setGeneratedAvatar(null);
      toast({
        title: "Avatar Updated!",
        description: "Your new AI-generated avatar has been set."
      })
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-background/50">
      <h3 className="text-lg font-medium font-headline">AI Avatar Generator</h3>
      <div className="flex items-center gap-4">
        <div>
            <Label className="text-xs text-muted-foreground">Current</Label>
            <Avatar className="h-20 w-20 border-2 border-primary/50">
                <AvatarImage src={currentAvatar} alt="Current Avatar" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </div>
        {isPending && (
          <div>
            <Label className="text-xs text-muted-foreground">Generating...</Label>
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        )}
        {generatedAvatar && (
            <div>
                 <Label className="text-xs text-muted-foreground">New</Label>
                <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-accent ring-2 ring-accent/50">
                    <AvatarImage src={generatedAvatar} alt="Generated Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <Button size="sm" className="absolute -bottom-2 -right-8" onClick={handleUseAvatar}>
                    Use this
                    </Button>
                </div>
            </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar-desc">Describe your desired avatar</Label>
        <div className="flex gap-2">
            <Input
            id="avatar-desc"
            placeholder="e.g., cybernetic phoenix, glowing feathers"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            />
            <Button onClick={handleGenerate} disabled={isPending} type="button">
                {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <Wand2 className="h-4 w-4" />
                )}
                <span className="sr-only">Generate</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
