
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, MessageSquare, Users, Eye, Bookmark, Minus, Plus, Clock } from "lucide-react";
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
    timeLeft?: string;
};

const statusColors: { [key: string]: string } = {
    "En Votación": "bg-sky-blue/20 text-sky-blue border-sky-blue/30",
    "Debate Activo": "bg-solar-orange/20 text-solar-orange border-solar-orange/30",
    "En Progreso": "bg-electric-lime/20 text-electric-lime border-electric-lime/30",
    "En Mediación": "bg-golden-yellow/20 text-golden-yellow border-golden-yellow/30",
};

export function ProposalCard({ id, title, proposer, entity, status, stats: initialStats, summary, isSaved, onSaveToggle, timeLeft }: ProposalCardProps) {
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
  const totalVotes = isVotingProposal ? (stats.support || 0) + (stats.reject || 0) + (stats.abstain || 0) : 0;
  const supportPercent = totalVotes > 0 ? (stats.support / totalVotes) * 100 : 0;
  const rejectPercent = totalVotes > 0 ? (stats.reject / totalVotes) * 100 : 0;
  const abstainPercent = totalVotes > 0 ? (stats.abstain / totalVotes) * 100 : 0;


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
                    <div className="w-full space-y-4">
                        <div className="space-y-2">
                            <div className="flex w-full h-3 rounded-full overflow-hidden bg-secondary">
                                <div className="bg-sea-green" style={{ width: `${supportPercent}%` }} />
                                <div className="bg-coral" style={{ width: `${rejectPercent}%` }} />
                                <div className="bg-muted" style={{ width: `${abstainPercent}%` }} />
                            </div>
                            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                <span className="text-sea-green">Apoyan: {stats.support} ({supportPercent.toFixed(1)}%)</span>
                                <span className="text-coral">Rechazan: {stats.reject} ({rejectPercent.toFixed(1)}%)</span>
                                <span>Abstienen: {stats.abstain} ({abstainPercent.toFixed(1)}%)</span>
                            </div>
                        </div>

                        {timeLeft && (
                             <div className="text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{timeLeft} para votar</span>
                            </div>
                        )}

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
