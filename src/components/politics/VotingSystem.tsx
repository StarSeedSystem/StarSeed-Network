
"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PollData, PollOption } from "../publish/PollBlock";
import { Button } from "../ui/button";
import { ThumbsUp, PieChart as PieChartIcon, BarChart2, Users, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { CommentSection } from "./CommentSection";
import { useUser } from "@/context/UserContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/data/firebase";

interface VotingSystemProps {
  poll: PollData;
  postId: string;
  onVote: (optionIndex: number) => void;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

export function VotingSystem({ poll, postId, onVote }: VotingSystemProps) {
  const { user } = useUser();
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [showVoters, setShowVoters] = useState(false);
  const [activeOptionDebate, setActiveOptionDebate] = useState<string | null>(null);
  
  const userVote = user && poll.voters ? poll.voters[user.uid] : null;

  const chartData = poll.options.map((option) => ({
    name: option.text,
    votes: option.votes || 0,
    proposer: option.proposer?.name || 'Autor Original'
  }));

  const totalVotes = chartData.reduce((acc, entry) => acc + entry.votes, 0);

  const sortedData = [...chartData].sort((a, b) => b.votes - a.votes);
  
  const handleToggleDebate = (optionText: string) => {
      setActiveOptionDebate(prev => prev === optionText ? null : optionText);
  }

  return (
    <Card className="bg-card/50 mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-headline">{poll.question}</CardTitle>
        <CardDescription>Total de Votos: {totalVotes}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart Section */}
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <Button variant={chartType === 'bar' ? 'secondary' : 'ghost'} size="icon" onClick={() => setChartType('bar')}><BarChart2 className="h-4 w-4"/></Button>
                <Button variant={chartType === 'pie' ? 'secondary' : 'ghost'} size="icon" onClick={() => setChartType('pie')}><PieChartIcon className="h-4 w-4"/></Button>
            </div>
             <div className="h-64 w-full">
                <ResponsiveContainer>
                    {chartType === 'bar' ? (
                        <BarChart data={chartData} layout="vertical" margin={{ left: 50 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <Tooltip cursor={{fill: 'hsl(var(--muted)/0.3)'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                            <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie data={chartData} dataKey="votes" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
             </div>
        </div>
        <Separator/>
        {/* Options and Voting Section */}
        <div className="space-y-3">
             {poll.options.map((option, index) => {
                 const isVotedOption = userVote === option.text;
                 return (
                     <div key={index} className="p-3 rounded-lg bg-background/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium">{option.text}</p>
                                <p className="text-xs text-muted-foreground">Propuesto por: {option.proposer?.name || "Autor Original"}</p>
                            </div>
                            <Button variant={isVotedOption ? "secondary" : "outline"} size="sm" onClick={() => onVote(index)} disabled={!!userVote}>
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                {isVotedOption ? "Votado" : "Votar"} ({option.votes || 0})
                            </Button>
                        </div>
                        <div className="mt-2">
                             <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handleToggleDebate(option.text)}>
                                <MessageSquare className="mr-1.5 h-3 w-3"/>
                                {activeOptionDebate === option.text ? "Ocultar Debate" : "Ver Debate de esta opción"}
                            </Button>
                        </div>
                        {activeOptionDebate === option.text && (
                            <div className="border-t border-dashed mt-2 pt-2">
                                {/* This comment section would need a different logic to scope to the option */}
                                <p className="text-xs text-muted-foreground text-center">El debate por opción es una característica futura.</p>
                            </div>
                        )}
                     </div>
                 )
             })}
              {poll.options.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                    <p>No hay opciones de votación todavía. ¡Propón una en los comentarios!</p>
                </div>
              )}
        </div>
        <Separator/>
        {/* Voters List Section */}
        <div>
            <Button variant="outline" className="w-full" onClick={() => setShowVoters(!showVoters)}>
                <Users className="mr-2 h-4 w-4"/>
                {showVoters ? "Ocultar Lista de Votantes" : "Ver Lista de Votantes"} ({Object.keys(poll.voters || {}).length})
            </Button>
            {showVoters && (
                <div className="mt-4 space-y-3">
                    {Object.entries(poll.voters || {}).map(([uid, vote]) => (
                        <VoterInfo key={uid} uid={uid} vote={vote as string} />
                    ))}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}


function VoterInfo({ uid, vote }: { uid: string, vote: string }) {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
            if (doc.exists()) {
                setProfile(doc.data());
            }
        });
        return unsub;
    }, [uid]);

    if (!profile) return <div className="p-2 text-xs">Cargando votante...</div>;

    return (
        <div className="flex items-start gap-3 p-2 rounded-lg bg-background/50">
            <Avatar className="h-9 w-9">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint="user avatar"/>
                <AvatarFallback>{profile.name?.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-semibold text-sm">{profile.name}</p>
                <p className="text-xs">Votó por: <span className="font-medium text-primary">{vote}</span></p>
            </div>
        </div>
    );
}

