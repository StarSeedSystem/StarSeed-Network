// src/components/publish/EducationInfoDisplay.tsx
"use client";

import { Award, Book, FileText, GraduationCap, Link as LinkIcon, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationData } from "./EducationSettings";

interface EducationInfoDisplayProps {
  data: EducationData;
}

export function EducationInfoDisplay({ data }: EducationInfoDisplayProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline text-base">
          <GraduationCap className="h-5 w-5" />
          Información Educativa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Tipo:</span>
            <Badge variant="secondary" className="capitalize flex items-center gap-1.5">
                {data.subArea === 'article' ? <FileText className="h-3 w-3" /> : <Book className="h-3 w-3" />}
                {data.subArea}
            </Badge>
        </div>

        {data.categories && (
            <div className="flex items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-semibold mt-1.5 shrink-0"><Tags className="h-4 w-4"/>Categorías:</div>
                <div className="flex flex-wrap gap-1.5">
                    {data.categories.split(',').map(cat => cat.trim() && <Badge key={cat}>{cat.trim()}</Badge>)}
                </div>
            </div>
        )}

        {data.prerequisites && (
            <div className="flex items-start gap-2 text-sm">
                 <div className="flex items-center gap-2 font-semibold mt-0.5 shrink-0"><LinkIcon className="h-4 w-4"/>Requisitos:</div>
                <p className="text-muted-foreground">{data.prerequisites}</p>
            </div>
        )}

        {data.missions && data.missions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2"><Award className="h-4 w-4"/>Misiones</h4>
            {data.missions.map((mission, index) => (
              <div key={index} className="p-3 rounded-md bg-background/50 border">
                <p className="font-semibold">{mission.title}</p>
                <p className="text-sm text-muted-foreground">{mission.description}</p>
                {mission.badge && <p className="text-xs text-primary font-medium mt-1">Recompensa: Insignia "{mission.badge.name}"</p>}
              </div>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
