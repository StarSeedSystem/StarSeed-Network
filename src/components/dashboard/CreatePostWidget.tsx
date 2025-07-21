
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizonal, Globe, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { PenSquare } from "lucide-react";

interface CreatePostWidgetProps {
  onPostCreated: (content: string) => void;
}

export function CreatePostWidget({ onPostCreated }: CreatePostWidgetProps) {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleBroadcast = () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Contenido Vacío",
        description: "Escribe algo para transmitir.",
      });
      return;
    }
    
    onPostCreated(content);

    toast({
        title: "¡Transmisión Rápida Exitosa!",
        description: "Tu mensaje ha sido difundido a tus destinos por defecto.",
    });

    setContent("");
  };

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/50">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="glowing astronaut" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <Textarea
              placeholder="What's resonating with you, Starlight?"
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 resize-none"
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/publish">
                    <PenSquare className="h-5 w-5" />
                    <span className="sr-only">Go to advanced editor</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="glass-card rounded-xl">
                <p>Editor Avanzado</p>
              </TooltipContent>
            </Tooltip>
           </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Label className="font-semibold text-sm">Broadcast to:</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="dest-profile-widget" defaultChecked />
              <Label htmlFor="dest-profile-widget" className="flex items-center gap-1.5 cursor-pointer text-sm font-normal">
                <Users className="h-4 w-4 text-primary" /> Profile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dest-community-widget" />
              <Label htmlFor="dest-community-widget" className="flex items-center gap-1.5 cursor-pointer text-sm font-normal">
                <Globe className="h-4 w-4 text-accent" /> Community
              </Label>
            </div>
          </div>
          <Button className="w-full sm:w-auto shadow-lg shadow-primary/30" onClick={handleBroadcast}>
            <SendHorizonal className="mr-2 h-4 w-4" />
            Broadcast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
