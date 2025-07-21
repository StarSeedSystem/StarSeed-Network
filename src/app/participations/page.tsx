
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, BookOpen, Handshake, Globe, Landmark, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const communities = [
    {
        name: "Innovación Sostenible",
        description: "Comunidad dedicada a encontrar e implementar soluciones ecológicas en la red.",
        members: 125,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "green leaf",
        type: "Comunidad",
        icon: Globe,
    },
    {
        name: "Arte Ciberdélico",
        description: "Colectivo de artistas y programadores explorando la creatividad emergente a través de la IA.",
        members: 342,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "abstract art",
        type: "Comunidad",
        icon: Globe,
    },
     {
        name: "E.F. Localidad Central",
        description: "Entidad territorial para la gobernanza local y proyectos comunitarios.",
        members: 1530,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "city skyline",
        type: "Entidad Federativa",
        icon: Landmark,
    }
];


export default function ParticipationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Mis Participaciones</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Tu centro de mando para toda actividad grupal, asociativa y colaborativa en la Red.
        </p>
      </div>

       <Tabs defaultValue="communities" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-card/60 rounded-xl h-auto">
          <TabsTrigger value="communities" className="rounded-lg py-2 text-base">
            <Users className="mr-2 h-5 w-5" />
            Comunidades y E.F.
          </TabsTrigger>
          <TabsTrigger value="parties" className="rounded-lg py-2 text-base">
            <Shield className="mr-2 h-5 w-5" />
            Partidos Políticos
          </TabsTrigger>
           <TabsTrigger value="study-groups" className="rounded-lg py-2 text-base">
            <BookOpen className="mr-2 h-5 w-5" />
            Grupos de Estudio
          </TabsTrigger>
          <TabsTrigger value="alliances" className="rounded-lg py-2 text-base">
            <Handshake className="mr-2 h-5 w-5" />
            Alianzas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="mt-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Comunidades y Entidades Federativas</CardTitle>
                    <CardDescription>Grupos sociales y territoriales a los que perteneces. Estos son tus principales espacios de colaboración y gobernanza.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {communities.map((item, index) => (
                             <Card key={index} className="glass-card flex items-center p-4 gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary/30">
                                    <AvatarImage src={item.avatar} alt={item.name} data-ai-hint={item.avatarHint} />
                                    <AvatarFallback>{item.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2">
                                         <h3 className="font-headline text-lg font-semibold">{item.name}</h3>
                                         <div className="flex items-center text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                            <item.icon className="h-3 w-3 mr-1"/>
                                            {item.type}
                                         </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                     <p className="text-sm font-semibold flex items-center mt-1">
                                        <Users className="h-4 w-4 mr-2 text-primary" /> {item.members.toLocaleString()} Miembros
                                    </p>
                                </div>
                                <Button variant="outline">Ir al Perfil</Button>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="parties" className="mt-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Partidos Políticos</CardTitle>
                    <CardDescription>Agrupaciones ideológicas para la acción política coordinada.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">Aquí se mostrará una lista de los partidos políticos en los que participas. Próximamente...</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="study-groups" className="mt-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Grupos de Estudio</CardTitle>
                    <CardDescription>Colaboración y aprendizaje sobre temas específicos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Aquí se mostrará una lista de tus grupos de estudio. Próximamente...</p>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="alliances" className="mt-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Alianzas</CardTitle>
                    <CardDescription>Colaboraciones formales entre los diferentes grupos en los que participas.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">Aquí se visualizarán tus alianzas estratégicas. Próximamente...</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
