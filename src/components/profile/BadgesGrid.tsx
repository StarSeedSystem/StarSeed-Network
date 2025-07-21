
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Zap, BrainCircuit, Users, Award, ShieldCheck, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

const allAchievements = [
  { id: 'nexusPioneer', icon: Star, label: "Nexus Pioneer", description: "Joined within the first cycle." },
  { id: 'thoughtcaster', icon: Zap, label: "Thoughtcaster", description: "First 100 broadcasts." },
  { id: 'aiSymbiote', icon: BrainCircuit, label: "AI Symbiote", description: "Generated first AI avatar." },
  { id: 'communityWeaver', icon: Users, label: "Community Weaver", description: "Started a new community." },
  { id: 'trustedVoice', icon: ShieldCheck, label: "Trusted Voice", description: "High reputation score." },
  { id: 'genesisBlock', icon: Gem, label: "Genesis Block", description: "Contributor to the platform." },
  { id: 'grandArchitect', icon: Award, label: "Grand Architect", description: "Coming soon..." },
];

export function BadgesGrid({ earnedBadges }: { earnedBadges: { [key: string]: boolean } }) {
  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Badge Collection</CardTitle>
        <CardDescription>A showcase of your accomplishments and status within the Nexus.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
            {allAchievements.map((ach) => {
              const isEarned = earnedBadges[ach.id];
              return (
                <Tooltip key={ach.id}>
                    <TooltipTrigger asChild>
                        <div className={cn(
                          "flex flex-col items-center gap-2 cursor-pointer group",
                          !isEarned && "opacity-30 grayscale hover:opacity-70 hover:grayscale-0"
                        )}>
                            <div className={cn(
                              "w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30 transition-all group-hover:border-accent group-hover:scale-110",
                              isEarned && "opacity-100"
                            )}>
                                <ach.icon className={cn(
                                  "w-10 h-10 text-primary transition-all group-hover:text-accent",
                                  isEarned && "glowing-icon"
                                  )} />
                            </div>
                            <p className="text-sm text-center font-medium truncate w-full">{ach.label}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass-card rounded-xl">
                        <p>{ach.description}</p>
                        {!isEarned && <p className="text-xs text-muted-foreground">(Not earned yet)</p>}
                    </TooltipContent>
                </Tooltip>
            )})}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
