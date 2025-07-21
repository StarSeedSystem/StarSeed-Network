import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Orbit } from "lucide-react";
import Image from "next/image";

export function NatalChartWidget() {
  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Orbit className="text-primary glowing-icon" />
            Carta Natal
        </CardTitle>
        <CardDescription>Tu huella cósmica en el momento de tu nacimiento.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full bg-primary/5 rounded-full flex items-center justify-center p-2">
            <Image 
                src="/natal-chart-placeholder.svg" 
                alt="Natal Chart" 
                width={300} 
                height={300}
                className="opacity-80"
                data-ai-hint="astrology chart"
            />
        </div>
         <div className="mt-4 space-y-2 text-xs text-muted-foreground text-center">
            <p><strong>Sol:</strong> 25° Leo</p>
            <p><strong>Luna:</strong> 12° Sagitario</p>
            <p><strong>Ascendente:</strong> 18° Acuario</p>
        </div>
      </CardContent>
    </Card>
  );
}
