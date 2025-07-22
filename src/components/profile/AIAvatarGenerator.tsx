
"use client";

import { useState, useTransition } from "react";
import { generateAvatar } from "@/ai/flows/generate-avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

export function AIAvatarGenerator({
  currentAvatar,
  onAvatarGenerated,
}: {
  currentAvatar?: string;
  onAvatarGenerated: (url: string, description: string) => void;
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
          toast({
            title: "Avatar Generated!",
            description: "Your new AI-generated avatar is ready to use.",
          });
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
      onAvatarGenerated(generatedAvatar, description);
      setGeneratedAvatar(null);
    }
  };

  const displayAvatar = generatedAvatar || currentAvatar;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="avatar-desc" className="text-lg font-headline font-semibold">
          Paso 1: Describe tu visión
        </Label>
        <Textarea
          id="avatar-desc"
          placeholder="Ej: un astronauta brillante con un casco de nebulosa, armadura cristalina, y ojos que son como estrellas..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
          className="min-h-[120px] text-base"
        />
      </div>

      <div className="flex justify-center">
        <Button onClick={handleGenerate} disabled={isPending} size="lg" className="shadow-lg shadow-primary/30">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generar Avatar
            </>
          )}
        </Button>
      </div>

      {(isPending || displayAvatar) && (
        <div className="space-y-4 text-center">
           <h3 className="text-lg font-headline font-semibold">Paso 2: Resultado</h3>
            <div className="flex justify-center items-center gap-8">
                {currentAvatar && (
                    <div className="text-center">
                        <Label className="text-sm text-muted-foreground">Actual</Label>
                        <Avatar className="h-24 w-24 border-2 border-primary/50 mt-1">
                            <AvatarImage src={currentAvatar} alt="Current Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                )}
                 {isPending && !generatedAvatar && (
                     <div className="text-center">
                        <Label className="text-sm text-muted-foreground">Generando...</Label>
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/10 mt-1">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    </div>
                 )}
                {generatedAvatar && (
                    <div className="text-center animate-in fade-in zoom-in-95">
                        <Label className="text-sm font-semibold text-accent">Nuevo</Label>
                        <Avatar className="h-24 w-24 border-2 border-accent ring-2 ring-accent/50 mt-1">
                            <AvatarImage src={generatedAvatar} alt="Generated Avatar" />
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>
             {generatedAvatar && (
                <div className="pt-2">
                    <Button onClick={handleUseAvatar} size="lg">Usar este Avatar y Obtener Insignia</Button>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
