import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Zap, BrainCircuit, Users, Award, ShieldCheck, Gem, MessageSquare, BookOpen, Code, Palette, Video, Mic, Heart } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

const achievements = [
  { id: 'nexusPioneer', icon: Star, label: "Nexus Pioneer", description: "Joined within the first cycle." },
  { id: 'thoughtcaster', icon: Zap, label: "Thoughtcaster", description: "First 100 broadcasts." },
  { id: 'aiSymbiote', icon: BrainCircuit, label: "AI Symbiote", description: "Generated first AI avatar." },
  { id: 'communityWeaver', icon: Users, label: "Community Weaver", description: "Started a new community." },
  { id: 'trustedVoice', icon: ShieldCheck, label: "Trusted Voice", description: "High reputation score." },
  { id: 'genesisBlock', icon: Gem, label: "Genesis Block", description: "Contributor to the platform." },
  { id: 'grandArchitect', icon: Award, label: "Grand Architect", description: "Proposed a successful global directive." },
  { id: 'eventHorizon', icon: Award, label: "Event Horizon", description: "Hosted 3+ events." },
  { id: 'knowledgeSeeker', icon: BookOpen, label: "Knowledge Seeker", description: "Completed 5 tutorials." },
  { id: 'codeAlchemist', icon: Code, label: "Code Alchemist", description: "Contributed a new app template." },
  { id: 'masterOrator', icon: Mic, label: "Master Orator", description: "Won a major debate." },
  { id: 'patronOfArts', icon: Palette, label: "Patron of the Arts", description: "Commissioned 10 AI art pieces." },
  { id: 'viralHit', icon: Heart, label: "Viral Hit", description: "A post with over 1000 likes." },
  { id: 'filmDirector', icon: Video, label: "Film Director", description: "Generated 5 videos with AI." },
];

export function AchievementsWidget() {
  return (
    <Card className="glass-card rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Achievements</CardTitle>
        <CardDescription>Badges earned throughout your journey.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <ScrollArea className="flex-grow -mx-2">
            <TooltipProvider>
                <div className="grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-x-4 gap-y-6 px-2">
                {achievements.map((ach, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-2 cursor-pointer group">
                                <div className={cn(
                                "w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30 transition-all group-hover:border-accent group-hover:scale-110"
                                )}>
                                    <ach.icon className="w-8 h-8 text-primary transition-all group-hover:text-accent glowing-icon" />
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
