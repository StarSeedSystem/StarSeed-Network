import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Zap, BrainCircuit, Users, Award, ShieldCheck, Gem } from "lucide-react";

const achievements = [
  { icon: Star, label: "Nexus Pioneer", description: "Joined within the first cycle." },
  { icon: Zap, label: "Thoughtcaster", description: "First 100 broadcasts." },
  { icon: BrainCircuit, label: "AI Symbiote", description: "Generated first AI avatar." },
  { icon: Users, label: "Community Weaver", description: "Started a new community." },
  { icon: ShieldCheck, label: "Trusted Voice", description: "High reputation score." },
  { icon: Gem, label: "Genesis Block", description: "Contributor to the platform." },
  { icon: Award, label: "Grand Architect", description: "Coming soon..." },
];

export function BadgesGrid() {
  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Badge Collection</CardTitle>
        <CardDescription>A showcase of your accomplishments and status within the Nexus.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
            {achievements.map((ach, index) => (
                <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30 transition-all group-hover:border-accent group-hover:scale-110">
                                <ach.icon className="w-10 h-10 text-primary glowing-icon transition-all group-hover:text-accent" />
                            </div>
                            <p className="text-sm text-center font-medium truncate w-full">{ach.label}</p>
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
