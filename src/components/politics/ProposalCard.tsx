
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, MessageSquare, Users, Eye, Bookmark, Minus, Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Progress } from "../ui/progress";

type VoteType = "support" | "reject" | null;

type ProposalCardProps = {
    id: string;
    title: string;
    proposer: { name: string; avatar: string; avatarHint: string; };
    entity: string;
    status: string;
    stats: { [key: string]: number };
    summary: string;
    isSaved: boolean;
    onSaveToggle: (isSaved: boolean) => void;
};

const statusColors: { [key: string]: string } = {
    "En Votación": "bg-sky-blue/20 text-sky-blue border-sky-blue/30",
    "Debate Activo": "bg-solar-orange/20 text-solar-orange border-solar-orange/30",
    "En Progreso": "bg-electric-lime/20 text-electric-lime border-electric-lime/30",
    "En Mediación": "bg-golden-yellow/20 text-golden-yellow border-golden-yellow/30",
};

export function ProposalCard({ id, title, proposer, entity, status, stats: initialStats, summary, isSaved, onSaveToggle }: ProposalCardProps) {
  const [stats, setStats] = useState(initialStats);
  const [userVote, setUserVote] = useState<VoteType>(null);

  const handleVote = (newVote: VoteType) => {
    setStats(currentStats => {
        const newStats = { ...currentStats };

        // Revert previous vote if it exists
        if (userVote) {
            newStats[userVote]--;
        }

        // Apply new vote
        if (newVote && newVote !== userVote) {
            newStats[newVote]++;
            setUserVote(newVote);
        } else {
            // If clicking the same button again, un-vote
            setUserVote(null);
        }
        
        return newStats;
    });
  };
  
  const handleSaveClick = () => {
    onSaveToggle(!isSaved);
  };

  const getStatsIcon = (key: string, value: number) => {
    switch (key) {
        case 'comments': return <div className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-primary" /> <span>{value} Comentarios</span></div>;
        case 'volunteers': return <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-sky-blue" /> <span>{value} Voluntarios</span></div>;
        case 'participants': return <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-sky-blue" /> <span>{value} Participantes</span></div>;
        case 'progress': return (
            <div className="w-full flex-grow">
                <div className="text-sm font-semibold mb-1">{value}% Progreso</div>
                <Progress value={value} className="h-2"/>
            </div>
        );
        default: return null;
    }
  }

  const isVotingProposal = status === "En Votación";

  return (
    <Card className="glass-card rounded-2xl overflow-hidden transition-all hover:border-primary/50 flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start gap-4">
                <div>
                    <CardDescription>{entity}</CardDescription>
                    <CardTitle className="text-2xl font-headline">{title}</CardTitle>
                </div>
                 <Badge variant="outline" className={cn("whitespace-nowrap", statusColors[status])}>{status}</Badge>
            </div>
             <div className="flex items-center gap-3 pt-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={proposer.avatar} alt={proposer.name} data-ai-hint={proposer.avatarHint} />
                    <AvatarFallback>{proposer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">{proposer.name}</p>
                    <p className="text-xs text-muted-foreground">Proponente</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-foreground/80">{summary}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 w-full">
                 {Object.entries(stats).map(([key, value]) => {
                     if (isVotingProposal && (key === 'support' || key === 'reject' || key === 'abstain')) {
                         return null;
                     }
                     return <div key={key} className="text-sm text-muted-foreground">{getStatsIcon(key, value)}</div>
                 })}
            </div>

            {isVotingProposal && (
                <>
                    <Separator className="bg-white/10" />
                    <div className="w-full space-y-3">
                        <div className="flex justify-around items-center text-center">
                            <div>
                                <p className="font-bold text-lg text-sea-green">{stats.support}</p>
                                <p className="text-xs text-muted-foreground">APOYAN</p>
                            </div>
                             <div>
                                <p className="font-bold text-lg text-coral">{stats.reject}</p>
                                <p className="text-xs text-muted-foreground">RECHAZAN</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg">{stats.abstain}</p>
                                <p className="text-xs text-muted-foreground">SE ABSTIENEN</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                             <Button variant={userVote === 'support' ? 'secondary' : 'outline'} onClick={() => handleVote('support')} className={cn(userVote === 'support' && "border-sea-green text-sea-green")}>
                                <ThumbsUp className="mr-2 h-4 w-4" /> Apoyar
                            </Button>
                             <Button variant={userVote === 'reject' ? 'secondary' : 'outline'} onClick={() => handleVote('reject')} className={cn(userVote === 'reject' && "border-coral text-coral")}>
                                <ThumbsDown className="mr-2 h-4 w-4" /> Rechazar
                            </Button>
                             <Button variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" /> Debatir
                            </Button>
                        </div>
                    </div>
                </>
            )}
            
            <Separator className="bg-white/10" />

            <div className="flex items-center gap-2 w-full">
                 <Button variant="outline" className="flex-1" onClick={handleSaveClick}>
                    {isSaved ? <Bookmark className="mr-2 h-4 w-4 fill-current text-primary" /> : <Bookmark className="mr-2 h-4 w-4" />}
                    {isSaved ? "Guardado" : "Guardar"}
                </Button>
                <Button asChild className="flex-1">
                    <Link href={`/politics/proposal/${id}`}>Ver Detalles</Link>
                </Button>
            </div>
        </CardFooter>
    </Card>
  );
}
