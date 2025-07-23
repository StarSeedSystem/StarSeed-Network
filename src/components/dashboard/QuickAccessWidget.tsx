
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, GraduationCap, Sparkles, Network } from "lucide-react";
import Link from "next/link";

const quickAccessLinks = [
  {
    href: "/politics",
    label: "Política",
    icon: Gavel,
    description: "Gobernanza y propuestas",
  },
  {
    href: "/education",
    label: "Educación",
    icon: GraduationCap,
    description: "Conocimiento y tutoriales",
  },
  {
    href: "/culture",
    label: "Cultura",
    icon: Sparkles,
    description: "Arte y comunidades",
  },
];

export function QuickAccessWidget() {
  return (
    <Card className="glass-card rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Network className="text-primary" />
            Explorar la Red
        </CardTitle>
        <CardDescription>Acceso directo a las áreas principales.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="space-y-3 flex flex-col flex-grow justify-around h-full">
            {quickAccessLinks.map((link) => (
                <Button key={link.href} variant="outline" className="w-full justify-start h-auto py-3 flex-grow" asChild>
                    <Link href={link.href}>
                       <link.icon className="h-5 w-5 mr-3 text-primary/80" />
                       <div className="flex flex-col items-start">
                           <span className="font-semibold">{link.label}</span>
                           <span className="text-xs text-muted-foreground font-normal">{link.description}</span>
                       </div>
                    </Link>
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
