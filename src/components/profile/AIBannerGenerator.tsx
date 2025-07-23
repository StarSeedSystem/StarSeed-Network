
"use client";

import { useState, useTransition } from "react";
import { generateBanner } from "@/ai/flows/generate-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { DialogClose } from "@/components/ui/dialog";

export function AIBannerGenerator({
  currentBanner,
  onBannerGenerated,
}: {
  currentBanner: string;
  onBannerGenerated: (url: string) => void;
}) {
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [generatedBanner, setGeneratedBanner] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!description) {
      toast({
        variant: "destructive",
        title: "Description missing",
        description: "Please describe the banner you want to create.",
      });
      return;
    }

    startTransition(async () => {
      setGeneratedBanner(null);
      try {
        const result = await generateBanner({ description });
        if (result.bannerDataUri) {
          setGeneratedBanner(result.bannerDataUri);
        } else {
          throw new Error("Banner generation did not return a data URI.");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate banner. The model may be offline.",
        });
      }
    });
  };

  const handleUseBanner = () => {
    if (generatedBanner) {
      onBannerGenerated(generatedBanner);
      toast({
        title: "Banner Updated!",
        description: "Your new AI-generated banner has been set."
      });
    }
  };

  const displayBanner = generatedBanner || currentBanner;

  return (
    <div className="space-y-4">
      <div className="aspect-[1200/400] w-full bg-black rounded-lg overflow-hidden border-2 border-primary relative">
        {isPending && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )}
        <Image src={displayBanner} alt="Profile Banner" layout="fill" objectFit="cover" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="banner-desc">Describe your desired banner</Label>
        <div className="flex flex-col sm:flex-row gap-2">
            <Input
            id="banner-desc"
            placeholder="e.g., a serene alien jungle at twilight"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            className="flex-grow"
            />
            <Button onClick={handleGenerate} disabled={isPending} type="button" className="shrink-0">
                {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <Wand2 className="h-4 w-4" />
                )}
                <span className="ml-2 sm:hidden md:inline">Generate</span>
            </Button>
        </div>
      </div>
       {generatedBanner && (
        <DialogClose asChild>
            <Button onClick={handleUseBanner} className="w-full">
                Use This Banner
            </Button>
        </DialogClose>
      )}
    </div>
  );
}
