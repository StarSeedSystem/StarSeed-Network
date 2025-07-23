
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Vote, PlusCircle, X, ThumbsUp } from "lucide-react";
import { LegislativeSettings, LegislativeData } from "./LegislativeSettings";

export interface PollOption {
  text: string;
  votes?: number;
}

export interface PollData {
  type: 'poll';
  question: string;
  options: PollOption[];
  isLegislative?: boolean;
  legislativeData?: LegislativeData;
  userVote?: number; // To track user's vote on the client
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
    const newOptions = data.options.filter((_, i) => i !== index);
    onChange({ ...data, options: newOptions });
  };

  const handleLegislativeDataChange = (legislativeData: LegislativeData) => {
      onChange({ ...data, legislativeData });
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
          <Label htmlFor="poll-question">Propuesta</Label>
          <Input id="poll-question" placeholder="Escribe la propuesta o pregunta a votar..." value={data.question} onChange={handleQuestionChange} />
        </div>
        <div className="space-y-2">
          <Label>Opciones de Votación (opcional)</Label>
          <p className="text-xs text-muted-foreground">Puedes dejar esto en blanco para que la comunidad proponga opciones desde los comentarios.</p>
          {data.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input placeholder={`Opción ${index + 1}`} value={option.text} onChange={(e) => handleOptionChange(index, e.target.value)} />
              <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addOption}>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Opción
          </Button>
        </div>
        {isLegislative && <LegislativeSettings data={data.legislativeData || {}} onChange={handleLegislativeDataChange} />}
      </CardContent>
    </Card>
  );
}

// Display Component for the feed
interface PollBlockDisplayProps {
  data: PollData;
  onVote: (optionIndex: number) => void;
}

export function PollBlockDisplay({ data, onVote }: PollBlockDisplayProps) {
  const totalVotes = data.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  const userHasVoted = data.userVote !== undefined;

  return (
      <Card className="bg-card/50 mt-4">
          <CardHeader>
              <CardTitle className="text-lg font-headline">{data.question}</CardTitle>
              <CardDescription>Total de Votos: {totalVotes}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
              {data.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? (((option.votes || 0) / totalVotes) * 100) : 0;
                  const isVotedOption = data.userVote === index;
                  return (
                      <div key={index} className="space-y-2 p-3 rounded-lg bg-background/50">
                          <div className="flex justify-between items-center text-sm">
                              <span className="font-medium">{option.text}</span>
                              <Button variant={isVotedOption ? "secondary" : "outline"} size="sm" onClick={() => onVote(index)} disabled={userHasVoted}>
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                {isVotedOption ? `Votado (${option.votes || 0})` : `Votar (${option.votes || 0})`}
                              </Button>
                          </div>
                          <Progress value={percentage} />
                      </div>
                  )
              })}
              {data.options.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                    <p>No hay opciones de votación todavía. ¡Propón una en los comentarios!</p>
                </div>
              )}
          </CardContent>
      </Card>
  )
}
