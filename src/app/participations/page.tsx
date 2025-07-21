
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Shield, BookOpen, Handshake, Globe, Landmark, PlusCircle, Calendar, Star, Activity, Gavel, PlaySquare, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import type { AnyEntity } from "@/types/content-types";

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
    },
    {
        name: "Grupo de Estudio: IA Generativa",
        slug: "ia-generativa-estudio",
        description: "Explora los últimos modelos y técnicas.",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "ai code",
        type: "study_group"
    },
    {
        name: "Partido: Futuro Sostenible",
        slug: "futuro-sostenible",
        description: "Promoviendo políticas ecológicas.",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "green future",
        type: "political_party"
    }
];

const activeParticipations = {
    votes: [{
        id: "prop-001",
        title: "Ley de Soberanía de Datos Personales",
        entity: "E.F. Global",
        timeLeft: "6 días restantes"
    }],
    tasks: [{
        title: "Revisar Documentación de API",
        project: "Implementación de la Red de Energía Comunitaria"
    }],
    events: [{
        title: "Festival de Música Algorítmica",
        date: "Este Sábado",
    }],
    projects: [{
        title: "Escribir artículo sobre Permacultura",
        progress: 40,
        role: "Investigador Principal"
    }]
};

type ConnectionCardProps = {
    item: AnyEntity;
}

const ConnectionCard = ({ item }: ConnectionCardProps) => {
    let href = "";
    switch (item.type) {
        case 'community': href = `/community/${item.slug}`; break;
        case 'federation': href = `/federation/${item.slug}`; break;
        case 'study_group': href = `/group/${item.slug}`; break;
        case 'political_party': href = `/party/${item.slug}`; break;
        default: href = '#';
    }

    return (
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
                <Link href={href}>Ir al Perfil</Link>
            </Button>
        </Card>
    );
};

export default function ConnectionsHubPage() {
    const [myCommunities, setMyCommunities] = useState<AnyEntity[]>([]);
    const [myFederations, setMyFederations] = useState<AnyEntity[]>([]);
    const [myStudyGroups, setMyStudyGroups] = useState<AnyEntity[]>([]);
    const [myPoliticalParties, setMyPoliticalParties] = useState<AnyEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const collections: { key: string; setter: Function; type: AnyEntity['type'] }[] = [
                    { key: 'communities', setter: setMyCommunities, type: 'community' },
                    { key: 'federations', setter: setMyFederations, type: 'federation' },
                    { key: 'studyGroups', setter: setMyStudyGroups, type: 'study_group' },
                    { key: 'politicalParties', setter: setMyPoliticalParties, type: 'political_party' },
                ];

                const promises = collections.map(async ({ key, setter, type }) => {
                    const querySnapshot = await getDocs(collection(db, key));
                    const data = querySnapshot.docs.map(doc => ({ type, id: doc.id, ...doc.data() } as AnyEntity));
                    setter(data);
                });

                await Promise.all(promises);

            } catch (error) {
                console.error("Error fetching connection data from Firestore: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const renderList = (items: AnyEntity[]) => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
        }
        if (items.length === 0) {
            return <Card className="glass-card text-center p-8"><CardDescription>No perteneces a ninguna entidad de este tipo.</CardDescription></Card>;
        }
        return (
            <div className="space-y-4">
                {items.map((item) => <ConnectionCard key={item.id} item={item} />)}
            </div>
        );
    };


  return (
    <div className="space-y-8">
      <Card className="glass-card p-4">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Busca perfiles, comunidades, eventos, partidos, grupos..." className="pl-12 h-14 text-lg bg-background/50" />
            <Button size="lg" className="absolute right-2 top-1/2 -translate-y-1/2">Buscar en el Nexo</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Crear y Proponer</CardTitle>
                <CardDescription>Inicia nuevas formas de colaboración y organización en la red.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-auto flex-col py-3 gap-2 text-center"><Link href="/participations/create/community"><Globe className="h-5 w-5 text-primary"/><span>Comunidad</span></Link></Button>
                <Button asChild variant="outline" className="h-auto flex-col py-3 gap-2 text-center"><Link href="/participations/create/federation"><Landmark className="h-5 w-5 text-primary"/><span>E.F.</span></Link></Button>
                <Button asChild variant="outline" className="h-auto flex-col py-3 gap-2 text-center" disabled><Link href="#"><Calendar className="h-5 w-5 text-primary"/><span>Evento</span></Link></Button>
                <Button asChild variant="outline" className="h-auto flex-col py-3 gap-2 text-center"><Link href="/participations/create/study-group"><BookOpen className="h-5 w-5 text-primary"/><span>Grupo Estudio</span></Link></Button>
                <Button asChild variant="outline" className="h-auto flex-col py-3 gap-2 text-center"><Link href="/participations/create/party"><Shield className="h-5 w-5 text-primary"/><span>Partido Político</span></Link></Button>
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
      
       <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary"/>
                Mis Participaciones Activas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card className="glass-card">
                    <CardHeader><CardTitle className="font-headline text-xl flex items-center gap-2"><Gavel className="text-primary"/>Votaciones</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {activeParticipations.votes.map(vote => (
                            <div key={vote.id} className="p-3 rounded-lg bg-secondary/70">
                                <p className="font-semibold">{vote.title}</p>
                                <p className="text-sm text-muted-foreground">{vote.timeLeft}</p>
                                <Button variant="link" asChild className="p-0 h-auto mt-1"><Link href={`/politics/proposal/${vote.id}`}>Ir a Votar</Link></Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card className="glass-card">
                    <CardHeader><CardTitle className="font-headline text-xl flex items-center gap-2"><PlaySquare className="text-primary"/>Tareas Voluntarias</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                       {activeParticipations.tasks.map(task => (
                            <div key={task.title} className="p-3 rounded-lg bg-secondary/70">
                                <p className="font-semibold">{task.title}</p>
                                <p className="text-sm text-muted-foreground">Proyecto: {task.project}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card className="glass-card">
                    <CardHeader><CardTitle className="font-headline text-xl flex items-center gap-2"><Calendar className="text-primary"/>Eventos Próximos</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {activeParticipations.events.map(event => (
                            <div key={event.title} className="p-3 rounded-lg bg-secondary/70">
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card className="glass-card">
                    <CardHeader><CardTitle className="font-headline text-xl flex items-center gap-2"><Star className="text-primary"/>Proyectos Activos</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {activeParticipations.projects.map(project => (
                             <div key={project.title} className="p-3 rounded-lg bg-secondary/70">
                                <p className="font-semibold">{project.title}</p>
                                <p className="text-sm text-muted-foreground">Mi Rol: {project.role}</p>
                                <Progress value={project.progress} className="mt-2 h-1.5" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
       </div>

       <Tabs defaultValue="communities" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-card/60 rounded-xl h-auto">
          <TabsTrigger value="communities" className="rounded-lg py-2 text-base">
            <Users className="mr-2 h-5 w-5" />
            Comunidades ({myCommunities.length})
          </TabsTrigger>
          <TabsTrigger value="federations" className="rounded-lg py-2 text-base">
            <Landmark className="mr-2 h-5 w-5" />
            Entidades ({myFederations.length})
          </TabsTrigger>
           <TabsTrigger value="events" className="rounded-lg py-2 text-base" disabled>
            <Calendar className="mr-2 h-5 w-5" />
            Eventos (0)
          </TabsTrigger>
          <TabsTrigger value="study_groups" className="rounded-lg py-2 text-base">
            <BookOpen className="mr-2 h-5 w-5" />
            Grupos ({myStudyGroups.length})
          </TabsTrigger>
          <TabsTrigger value="political_parties" className="rounded-lg py-2 text-base">
            <Shield className="mr-2 h-5 w-5" />
            Partidos ({myPoliticalParties.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="mt-6">{renderList(myCommunities)}</TabsContent>
        <TabsContent value="federations" className="mt-6">{renderList(myFederations)}</TabsContent>
        <TabsContent value="events" className="mt-6">{renderList([])}</TabsContent>
        <TabsContent value="study_groups" className="mt-6">{renderList(myStudyGroups)}</TabsContent>
        <TabsContent value="political_parties" className="mt-6">{renderList(myPoliticalParties)}</TabsContent>
      </Tabs>
    </div>
  );
}
