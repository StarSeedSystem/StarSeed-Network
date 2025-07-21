"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizonal, Globe, Users } from "lucide-react";

export function CreatePostWidget() {
  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/50">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="glowing astronaut" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <Textarea
              placeholder="What's resonating with you, Starlight?"
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0"
              rows={2}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Label className="font-semibold">Broadcast to:</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="dest-profile" defaultChecked />
              <Label htmlFor="dest-profile" className="flex items-center gap-1.5 cursor-pointer">
                <Users className="h-4 w-4 text-primary" /> Profile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dest-community" />
              <Label htmlFor="dest-community" className="flex items-center gap-1.5 cursor-pointer">
                <Globe className="h-4 w-4 text-accent" /> Community
              </Label>
            </div>
          </div>
          <Button className="w-full sm:w-auto shadow-lg shadow-primary/30">
            <SendHorizonal className="mr-2 h-4 w-4" />
            Broadcast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
