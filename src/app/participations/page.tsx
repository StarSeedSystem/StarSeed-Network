
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Shield, BookOpen, Handshake, Globe, Landmark, PlusCircle, Calendar, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";

const myCommunities = [
    {
        name: "Innovación Sostenible",
        slug: "innovacion-sostenible",
        members: 125,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "green leaf",
    },
    {
        name: "Arte Ciberdélico",
        slug: "arte-ciberdelico",
        members: 342,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "abstract art",
    },
];

const myFederations = [
     {
        name: "E.F. Localidad Central",
        slug: "ef-localidad-central",
        members: 1530,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "city skyline",
    }
];

const recommendations = [
    {
        name: "Helios",
        slug: "helios",
        description: "Ingeniero de redes energéticas.",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "sun god",
        type: "profile"
    },
    {
        name: "Debate Filosófico",
        slug: "debate-filosofico",
        description: "Comunidad para la discusión profunda.",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing brain",
        type: "community"
    },
    {
        name: "Festival de Música Algorítmica",
        slug: "festival-musica",
        description: "Evento cultural este fin de semana.",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "sound waves",
        type: "event"
    }
]

const ConnectionCard = ({ item }: { item: (typeof myCommunities)[0] }) => (
    <Card className="glass-card flex items-center p-4 gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={item.avatar} alt={item.name} data-ai-hint={item.avatarHint} />
            <AvatarFallback>{item.name.substring(0,2)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
            <h3 className="font-headline text-lg font-semibold">{item.name}</h3>
             <p className="text-sm font-semibold flex items-center mt-1">
                <Users className="h-4 w-4 mr-2 text-primary" /> 
                {item.members.toLocaleString()} Miembros
            </p>
        </div>
        <Button asChild variant="outline">
            <Link href={`/community/${item.slug}`}>Ir al Perfil</Link>
        </Button>
    </Card>
);

export default function ConnectionsHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Hub de Conexiones</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Tu centro para descubrir, crear y gestionar todas tus interacciones en la Red.
        </p>
      </div>
      
      <Card className="glass-card p-4">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Busca perfiles, comunidades, eventos..." className="pl-12 h-14 text-lg bg-background/50" />
            <Button size="lg" className="absolute right-2 top-1/2 -translate-y-1/2">Buscar en el Nexo</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Crear y Proponer</CardTitle>
                <CardDescription>Inicia nuevas formas de colaboración y organización en la red.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto flex-col py-4 gap-2"><Globe className="h-6 w-6 text-primary"/><span>Crear Comunidad</span></Button>
                <Button variant="outline" className="h-auto flex-col py-4 gap-2"><Landmark className="h-6 w-6 text-primary"/><span>Proponer E.F.</span></Button>
                <Button variant="outline" className="h-auto flex-col py-4 gap-2"><Calendar className="h-6 w-6 text-primary"/><span>Organizar Evento</span></Button>
            </CardContent>
        </Card>
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Recomendaciones para ti</CardTitle>
                <CardDescription>Descubre nuevas conexiones basadas en tus intereses y actividad.</CardDescription>
            </CardHeader>
            <CardContent>
                <Carousel
                    opts={{ align: "start", loop: true, }}
                    className="w-full"
                >
                    <CarouselContent>
                        {recommendations.map((item, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                            <Card className="bg-primary/5">
                                <CardContent className="flex flex-col items-center text-center p-4 gap-3">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={item.avatar} alt={item.name} data-ai-hint={item.avatarHint} />
                                        <AvatarFallback>{item.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold">{item.name}</span>
                                    <p className="text-xs text-muted-foreground h-8">{item.description}</p>
                                    <Button size="sm" variant="secondary" className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4"/>
                                        {item.type === 'profile' ? 'Seguir' : 'Unirse'}
                                    </Button>
                                </CardContent>
                            </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4"/>
                    <CarouselNext className="-right-4" />
                </Carousel>
            </CardContent>
        </Card>
      </div>
      
       <Tabs defaultValue="communities" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-card/60 rounded-xl h-auto">
          <TabsTrigger value="communities" className="rounded-lg py-2 text-base">
            <Users className="mr-2 h-5 w-5" />
            Mis Comunidades ({myCommunities.length})
          </TabsTrigger>
          <TabsTrigger value="federations" className="rounded-lg py-2 text-base">
            <Landmark className="mr-2 h-5 w-5" />
            Mis Entidades ({myFederations.length})
          </TabsTrigger>
           <TabsTrigger value="events" className="rounded-lg py-2 text-base">
            <Calendar className="mr-2 h-5 w-5" />
            Mis Eventos (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="mt-6">
            <div className="space-y-4">
                {myCommunities.map((item, index) => (
                        <ConnectionCard key={index} item={item} />
                ))}
            </div>
        </TabsContent>
         <TabsContent value="federations" className="mt-6">
            <div className="space-y-4">
                {myFederations.map((item, index) => (
                        <ConnectionCard key={index} item={item as any} />
                ))}
            </div>
        </TabsContent>
        <TabsContent value="events" className="mt-6">
            <Card className="glass-card text-center p-8">
                <CardDescription>Aún no te has unido o registrado para ningún evento.</CardDescription>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
