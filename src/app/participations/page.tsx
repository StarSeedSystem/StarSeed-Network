
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, BookOpen, Handshake, Globe, Landmark } from "lucide-react";
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

const politicalParties = [
    {
        name: "Partido: Futuro Transhumanista",
        description: "Agrupación que impulsa políticas para la evolución tecnológica y biológica consciente.",
        members: 89,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "futuristic human",
        type: "Partido Político",
        icon: Shield,
    }
];

const studyGroups = [
    {
        name: "Grupo de Estudio: Redes Neuronales Descentralizadas",
        description: "Investigación y desarrollo de arquitecturas de IA que operan en entornos P2P.",
        members: 45,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing brain",
        type: "Grupo de Estudio",
        icon: BookOpen,
    },
    {
        name: "Taller de Diseño de Avatares VRM",
        description: "Aprendizaje colaborativo sobre las herramientas y técnicas para crear avatares 3D interoperables.",
        members: 78,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "3d model",
        type: "Grupo de Estudio",
        icon: BookOpen,
    }
];

const alliances = [
    {
        name: "Alianza por la Soberanía Digital",
        description: "Colaboración entre 'Innovación Sostenible' y la 'E.F. Localidad Central' para desarrollar estándares de datos.",
        members: 2, // Representa a los 2 grupos
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "digital handshake",
        type: "Alianza Estratégica",
        icon: Handshake,
    }
];

const ParticipationCard = ({ item }: { item: (typeof communities)[0] }) => (
    <Card className="glass-card flex items-center p-4 gap-4">
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
                <Users className="h-4 w-4 mr-2 text-primary" /> 
                {item.members.toLocaleString()} {item.type === 'Alianza Estratégica' ? 'Grupos' : 'Miembros'}
            </p>
        </div>
        <Button variant="outline">Ir al Perfil</Button>
    </Card>
);


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
                             <ParticipationCard key={index} item={item as any} />
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
                     <div className="space-y-4">
                        {politicalParties.map((item, index) => (
                             <ParticipationCard key={index} item={item as any} />
                        ))}
                    </div>
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
                     <div className="space-y-4">
                        {studyGroups.map((item, index) => (
                             <ParticipationCard key={index} item={item as any} />
                        ))}
                    </div>
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
                     <div className="space-y-4">
                        {alliances.map((item, index) => (
                             <ParticipationCard key={index} item={item as any} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
