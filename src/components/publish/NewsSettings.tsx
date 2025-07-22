
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Newspaper } from "lucide-react";

interface NewsSettingsProps {
    isNews: boolean;
    onIsNewsChange: (isNews: boolean) => void;
}

export function NewsSettings({ isNews, onIsNewsChange }: NewsSettingsProps) {

    return (
         <Card className="bg-secondary/40 border-secondary/60 animate-in fade-in-50">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground/90 font-headline">
                    <Newspaper className="h-5 w-5 text-primary"/>
                    Opción de Noticia
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                    <div className="space-y-0.5">
                        <Label htmlFor="news-proposal" className="flex items-center gap-2">
                           Sugerir como Noticia
                        </Label>
                         <p className="text-xs text-muted-foreground">Se enviará a verificación por pares.</p>
                    </div>
                    <Switch 
                        id="news-proposal"
                        checked={isNews}
                        onCheckedChange={onIsNewsChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

    

    