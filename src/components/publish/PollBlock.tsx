
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Vote, PlusCircle, X } from "lucide-react";
import { LegislativeSettings } from "./LegislativeSettings";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/data/firebase";

export interface PollOption {
  text: string;
  votes?: number;
}

export interface PollData {
  type: 'poll';
  question: string;
  options: PollOption[];
  isLegislative?: boolean;
}

interface PollBlockProps {
  data: PollData;
  onChange: (data: PollData) => void;
  onRemove: () => void;
  isLegislative?: boolean;
}

export function PollBlock({ data, onChange, onRemove, isLegislative = false }: PollBlockProps) {
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, question: e.target.value });
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...data.options];
    newOptions[index].text = text;
    onChange({ ...data, options: newOptions });
  };

  const addOption = () => {
    onChange({ ...data, options: [...data.options, { text: "" }] });
  };

  const removeOption = (index: number) => {
    if (data.options.length <= 2) return;
    const newOptions = data.options.filter((_, i) => i !== index);
    onChange({ ...data, options: newOptions });
  };

  return (
    <Card className="bg-secondary/30 border-secondary/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-headline flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            Bloque de Votación / Encuesta
          </CardTitle>
          {!isLegislative && (
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isLegislative && <CardDescription>Este bloque es obligatorio para una propuesta legislativa.</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="poll-question">Pregunta</Label>
          <Input id="poll-question" placeholder="¿Cuál es la pregunta?" value={data.question} onChange={handleQuestionChange} />
        </div>
        <div className="space-y-2">
          <Label>Opciones</Label>
          {data.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input placeholder={`Opción ${index + 1}`} value={option.text} onChange={(e) => handleOptionChange(index, e.target.value)} />
              {data.options.length > 2 && (
                <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addOption}>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Opción
          </Button>
        </div>
        {isLegislative && <LegislativeSettings isLegislativeProposal />}
      </CardContent>
    </Card>
  );
}

// Display Component for the feed
interface PollBlockDisplayProps {
  data: PollData;
  postId: string;
}

export function PollBlockDisplay({ data: initialData, postId }: PollBlockDisplayProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [data, setData] = useState(initialData);
  const [userVote, setUserVote] = useState<number | null>(null);

  const totalVotes = data.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  
  const handleVote = async (optionIndex: number) => {
      if (!user) {
          toast({ variant: "destructive", title: "Debes iniciar sesión para votar." });
          return;
      }
      if (userVote !== null) {
          toast({ variant: "destructive", title: "Ya has votado en esta encuesta." });
          return;
      }
      
      const newData = { ...data };
      newData.options[optionIndex].votes = (newData.options[optionIndex].votes || 0) + 1;
      
      const postRef = doc(db, "posts", postId);
      
      try {
          await updateDoc(postRef, {
             blocks: [newData] // This assumes only one poll block per post for now
          });
          setData(newData);
          setUserVote(optionIndex);
          toast({ title: "¡Voto registrado!" });
      } catch (error) {
          console.error("Error updating vote:", error);
          toast({ variant: "destructive", title: "No se pudo registrar tu voto." });
      }
  };

  return (
      <Card className="bg-card/50 mt-4">
          <CardHeader>
              <CardTitle className="text-lg font-headline">{data.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              {data.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? (((option.votes || 0) / totalVotes) * 100) : 0;
                  return (
                      <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                              <span className="font-medium">{option.text}</span>
                              <span className="text-muted-foreground">{percentage.toFixed(1)}% ({option.votes || 0})</span>
                          </div>
                          <Progress value={percentage} />
                      </div>
                  )
              })}
              <div className="flex justify-center pt-2">
                 <Button onClick={() => handleVote(0)} disabled={userVote !== null}>Votar</Button>
              </div>
          </CardContent>
      </Card>
  )
}
