
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Shield, BookOpen, Handshake, Globe, Landmark, PlusCircle, Calendar, Star, Activity, Gavel, PlaySquare, Loader2, View } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import type { AnyEntity } from "@/types/content-types";
import { cn } from "@/lib/utils";

const recommendations: (AnyEntity & { type: 'community' | 'political_party' | 'study_group' | 'federation' })[] = [
    {
        id: "innovacion-sostenible",
        name: "Innovación Sostenible",
        slug: "innovacion-sostenible",
        description: "Colectivo para construir un futuro más verde.",
        avatar: "https://avatar.vercel.sh/innovacion-sostenible.png",
        avatarHint: "green leaf",
        type: "community",
        members: 1257,
        banner: "",
        bannerHint: "",
    },
    {
        id: "partido-conciencia-digital",
        name: "Partido de la Conciencia Digital",
        slug: "partido-conciencia-digital",
        description: "Promoviendo la soberanía de datos y la IA ética.",
        avatar: "https://avatar.vercel.sh/partido-conciencia-digital.png",
        avatarHint: "digital brain",
        type: "political_party",
        members: 2341,
        banner: "",
        bannerHint: "",
    },
     {
        id: "exploradores-cuanticos",
        name: "Exploradores de Computación Cuántica",
        slug: "exploradores-cuanticos",
        description: "Grupo para investigar los límites de la computación.",
        avatar: "https://avatar.vercel.sh/exploradores-cuanticos.png",
        avatarHint: "quantum atom",
        type: "study_group",
        members: 152,
        banner: "",
        bannerHint: "",
    },
    {
        id: "art-ai-collective",
        name: "Art-AI Collective",
        slug: "art-ai-collective",
        description: "Comunidad para la exploración de la creatividad emergente.",
        avatar: "https://avatar.vercel.sh/art-ai-collective.png",
        avatarHint: "abstract art",
        type: "community",
        members: 843,
        banner: "",
        bannerHint: "",
    },
    {
        id: "consejo-etica-digital",
        name: "Consejo de Ética Digital",
        slug: "consejo-etica-digital",
        description: "Entidad que supervisa el desarrollo ético de la IA.",
        avatar: "https://avatar.vercel.sh/consejo-etica-digital.png",
        avatarHint: "balanced scale",
        type: "federation",
        members: 42,
        banner: "",
        bannerHint: "",
    },
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

const getEntityPath = (type: AnyEntity['type'], slug: string) => {
    switch (type) {
        case 'community': return `/community/${slug}`;
        case 'federation': return `/federated-entity/${slug}`;
        case 'study_group': return `/study-group/${slug}`;
        case 'political_party': return `/party/${slug}`;
        default: return '#';
    }
}

const getEntityTypeLabel = (type: AnyEntity['type']) => {
    switch (type) {
        case 'community': return 'Comunidad';
        case 'federation': return 'E. Federada';
        case 'study_group': return 'G. de Estudio';
        case 'political_party': return 'Partido';
        default: return 'Página';
    }
}

const entityCreationLinks = [
    { href: "/participations/create/community", icon: Globe, label: "Comunidad", description: "Un espacio para la colaboración." },
    { href: "/participations/create/federated-entity", icon: Landmark, label: "E. Federada", description: "Una entidad formal en la red." },
    { href: "/participations/create/study-group", icon: BookOpen, label: "Grupo Estudio", description: "Para el aprendizaje colaborativo." },
    { href: "/participations/create/party", icon: Shield, label: "Partido Político", description: "Una fuerza ideológica organizada." },
    { href: "/participations/create/proposal", icon: Gavel, label: "Propuesta", description: "Presenta una nueva ley o directiva." },
    { href: "#", icon: Calendar, label: "Evento", description: "Organiza encuentros y actividades.", disabled: true },
];

const ConnectionCard = ({ item }: ConnectionCardProps) => {
    const href = getEntityPath(item.type, item.slug);

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
                    {Array.isArray(item.members) ? item.members.length : (item.members || 0).toLocaleString()} Miembros
                </p>
            </div>
            <Button asChild variant="outline">
                <Link href={href}>Ver Página</Link>
            </Button>
        </Card>
    );
};

export default function ConnectionsHubPage() {
    const { user } = useUser();
    const [myCommunities, setMyCommunities] = useState<AnyEntity[]>([]);
    const [myFederations, setMyFederations] = useState<AnyEntity[]>([]);
    const [myStudyGroups, setMyStudyGroups] = useState<AnyEntity[]>([]);
    const [myPoliticalParties, setMyPoliticalParties] = useState<AnyEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendationFilter, setRecommendationFilter] = useState('all');

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const collections: { key: string; setter: Function; type: AnyEntity['type'] }[] = [
                    { key: 'communities', setter: setMyCommunities, type: 'community' },
                    { key: 'federated_entities', setter: setMyFederations, type: 'federation' },
                    { key: 'study_groups', setter: setMyStudyGroups, type: 'study_group' },
                    { key: 'political_parties', setter: setMyPoliticalParties, type: 'political_party' },
                ];

                const promises = collections.map(async ({ key, setter, type }) => {
                    const q = query(collection(db, key), where("creatorId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
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
    }, [user]);
    
    const filteredRecommendations = useMemo(() => {
        if (recommendationFilter === 'all') {
            return recommendations;
        }
        return recommendations.filter(r => r.type === recommendationFilter);
    }, [recommendationFilter]);

    const renderList = (items: AnyEntity[]) => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
        }
        if (items.length === 0) {
            return <Card className="glass-card text-center p-8"><CardDescription>No perteneces a ninguna página de este tipo.</CardDescription></Card>;
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
            <Input placeholder="Busca perfiles, páginas, comunidades, partidos..." className="pl-12 h-14 text-lg bg-background/50" />
            <Button size="lg" className="absolute right-2 top-1/2 -translate-y-1/2">Buscar en el Nexo</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Crear y Proponer Páginas Públicas</CardTitle>
                <CardDescription>Inicia nuevos espacios de colaboración y organización en la red.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {entityCreationLinks.map(link => (
                    <Button asChild variant="outline" className="h-auto flex-col p-3 gap-2 text-center" key={link.href} disabled={link.disabled}>
                        <Link href={link.href}>
                            <link.icon className="h-6 w-6 text-primary"/>
                            <div className="flex flex-col text-center">
                                <span className="font-semibold">{link.label}</span>
                                <span className="text-xs font-normal text-muted-foreground hidden sm:block">{link.description}</span>
                            </div>
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Recomendaciones para ti</CardTitle>
                <CardDescription>Descubre nuevas páginas y comunidades basadas en tus intereses.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs value={recommendationFilter} onValueChange={setRecommendationFilter} className="w-full mb-4">
                    <TabsList className="grid w-full grid-cols-4 bg-card/80">
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="community">Comunidades</TabsTrigger>
                        <TabsTrigger value="political_party">Partidos</TabsTrigger>
                        <TabsTrigger value="study_group">Grupos</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Carousel opts={{ align: "start", loop: false }} className="w-full">
                    <CarouselContent className="-ml-2">
                        {filteredRecommendations.map((item, index) => (
                        <CarouselItem key={index} className="pl-2 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
                            <Card className="bg-primary/5 h-full flex flex-col group overflow-hidden rounded-xl">
                                <CardContent className="flex flex-col p-4 gap-3 flex-grow">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={item.avatar} alt={item.name} data-ai-hint={item.avatarHint} />
                                            <AvatarFallback>{item.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-semibold truncate">{item.name}</p>
                                            <p className="text-xs text-primary font-medium">{getEntityTypeLabel(item.type)}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground h-10 flex-grow">{item.description}</p>
                                    <Button size="sm" variant="secondary" className="w-full mt-auto" asChild>
                                        <Link href={getEntityPath(item.type, item.slug)}>
                                            <View className="mr-2 h-4 w-4"/> Ver Página
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex -left-4"/>
                    <CarouselNext className="hidden sm:flex -right-4" />
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

       <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline">Mis Páginas</h2>
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
    </div>
  );
}
