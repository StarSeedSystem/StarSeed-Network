import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, MessageSquare, Users, Star, Eye } from "lucide-react";

type ProposalCardProps = {
    id: string;
    title: string;
    proposer: { name: string; avatar: string; avatarHint: string; };
    entity: string;
    status: string;
    stats: { [key: string]: number };
    summary: string;
};

const statusColors: { [key: string]: string } = {
    "En Votación": "bg-sky-blue/20 text-sky-blue border-sky-blue/30",
    "Debate Activo": "bg-solar-orange/20 text-solar-orange border-solar-orange/30",
    "En Progreso": "bg-electric-lime/20 text-electric-lime border-electric-lime/30",
    "En Mediación": "bg-golden-yellow/20 text-golden-yellow border-golden-yellow/30",
};

const getStatsIcon = (key: string) => {
    switch (key) {
        case 'support': return <ThumbsUp className="h-4 w-4 text-sea-green" />;
        case 'reject': return <ThumbsDown className="h-4 w-4 text-coral" />;
        case 'abstain': return <Eye className="h-4 w-4 text-muted-foreground" />;
        case 'comments': return <MessageSquare className="h-4 w-4 text-primary" />;
        case 'volunteers': return <Users className="h-4 w-4 text-sky-blue" />;
        case 'participants': return <Users className="h-4 w-4 text-sky-blue" />;
        default: return null;
    }
}

export function ProposalCard({ title, proposer, entity, status, stats, summary }: ProposalCardProps) {
  return (
    <Card className="glass-card rounded-2xl overflow-hidden transition-all hover:border-primary/50">
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
        <CardContent>
            <p className="text-foreground/80">{summary}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                 {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                       {getStatsIcon(key)}
                       <span>{value}{key === 'progress' ? '%' : ''}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                 <Button variant="outline" className="w-full sm:w-auto">
                    <Star className="mr-2 h-4 w-4" />
                    Guardar
                </Button>
                <Button className="w-full sm:w-auto">
                    Ver Detalles
                </Button>
            </div>
        </CardFooter>
    </Card>
  );
}
