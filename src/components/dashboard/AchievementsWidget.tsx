import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Zap, BrainCircuit, Users, Award } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const achievements = [
  { icon: Star, label: "Nexus Pioneer", description: "Joined within the first cycle." },
  { icon: Zap, label: "Thoughtcaster", description: "First 100 broadcasts." },
  { icon: BrainCircuit, label: "AI Symbiote", description: "Generated first AI avatar." },
  { icon: Users, label: "Community Weaver", description: "Started a new community." },
  { icon: Award, label: "Grand Architect", description: "Coming soon..." },
];

export function AchievementsWidget() {
  return (
    <Card className="glass-card rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Achievements</CardTitle>
        <CardDescription>Badges earned throughout your journey.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <TooltipProvider>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-x-4 gap-y-6">
            {achievements.map((ach, index) => (
                <Tooltip key={index}>
                    <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-2 cursor-pointer">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30">
                                <ach.icon className="w-8 h-8 text-primary glowing-icon" />
                            </div>
                            <p className="text-xs text-center font-medium truncate w-full">{ach.label}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass-card rounded-xl">
                        <p>{ach.description}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
