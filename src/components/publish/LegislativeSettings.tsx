
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, AlertTriangle, Gavel } from "lucide-react";

export function LegislativeSettings() {
    const [executionDate, setExecutionDate] = useState<Date>();

    return (
         <Card className="bg-primary/5 border-primary/20 animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary font-headline">
                    <Gavel className="h-5 w-5" />
                    Propuesta Legislativa
                </CardTitle>
                <CardDescription>Configura los parámetros de la votación para esta publicación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="execution-date">Sugerir Fecha de Ejecución</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !executionDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {executionDate ? format(executionDate, "PPP") : <span>Elige una fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 glass-card">
                          <Calendar
                            mode="single"
                            selected={executionDate}
                            onSelect={setExecutionDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="voting-period">Establecer Plazo de Votación</Label>
                    <Select defaultValue="7d">
                        <SelectTrigger id="voting-period">
                            <SelectValue placeholder="Seleccionar plazo..." />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                            <SelectItem value="3d">3 Días</SelectItem>
                            <SelectItem value="7d">1 Semana</SelectItem>
                            <SelectItem value="14d">2 Semanas</SelectItem>
                            <SelectItem value="30d">1 Mes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-solar-orange/50 bg-solar-orange/10 p-3">
                    <div className="space-y-0.5">
                        <Label htmlFor="urgent-proposal" className="flex items-center gap-2 text-solar-orange">
                            <AlertTriangle className="h-4 w-4" />
                            Marcar como Urgente
                        </Label>
                         <p className="text-xs text-solar-orange/80">Acorta el plazo a 24h y notifica a todos.</p>
                    </div>
                    <Switch id="urgent-proposal" />
                </div>
            </CardContent>
        </Card>
    );
}
