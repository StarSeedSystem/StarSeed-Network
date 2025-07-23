
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Vote, PlusCircle, X, ThumbsUp } from "lucide-react";
import { LegislativeSettings, LegislativeData } from "./LegislativeSettings";
import { useUser } from "@/context/UserContext";

export interface PollOption {
  text: string;
  votes?: number;
  proposer?: {
      name: string;
      uid: string;
  }
}

export interface PollData {
  type: 'poll';
  question: string;
  options: PollOption[];
  isLegislative?: boolean;
  legislativeData?: LegislativeData;
  voters?: { [uid: string]: string }; // Tracks who voted for which option text
}

interface PollBlockProps {
  data: PollData;
  onChange: (data: PollData) => void;
  onRemove: () => void;
  isLegislative?: boolean;
}

export function PollBlock({ data, onChange, onRemove, isLegislative = false }: PollBlockProps) {
  const { user, profile } = useUser();
  
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, question: e.target.value });
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...data.options];
    newOptions[index].text = text;
    onChange({ ...data, options: newOptions });
  };

  const addOption = () => {
    const newOption: PollOption = {
      text: "",
      proposer: user && profile ? { uid: user.uid, name: profile.name } : undefined
    }
    onChange({ ...data, options: [...data.options, newOption] });
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
          <Label>Opciones de Votación</Label>
          <p className="text-xs text-muted-foreground">Define las opciones iniciales. Los usuarios podrán proponer más desde los comentarios.</p>
          {data.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input placeholder={`Opción ${index + 1}`} value={option.text} onChange={(e) => handleOptionChange(index, e.target.value)} className="flex-grow" />
              <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="shrink-0">
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
