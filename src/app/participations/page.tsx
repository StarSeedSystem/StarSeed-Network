
"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Shield, BookOpen, Handshake, Globe, Landmark, PlusCircle, Calendar, Star, Activity, Gavel, PlaySquare, Loader2, View, Sparkles, SlidersHorizontal, RefreshCw, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import type { AnyEntity, AnyRecommendedPage, Event } from "@/types/content-types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, onSnapshot, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { getEntityPath } from "@/lib/utils";
import { ConnectionCard } from "@/components/participations/ConnectionCard";
import { PageHeader } from "@/components/layout/PageHeader";


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

const getEntityTypeLabel = (type: AnyRecommendedPage['type']) => {
    switch (type) {
        case 'community': return 'Comunidad';
        case 'federation': return 'E. Federada';
        case 'study_group': return 'G. de Estudio';
        case 'chat_group': return 'G. de Chat';
        case 'political_party': return 'Partido';
        case 'event': return 'Evento';
        default: return 'Página';
    }
}

const entityCreationLinks = [
    { href: "/participations/create/community", icon: Globe, label: "Comunidad", description: "Un espacio para la colaboración." },
    { href: "/participations/create/federated-entity", icon: Landmark, label: "E. Federada", description: "Una entidad formal en la red." },
    { href: "/participations/create/study-group", icon: BookOpen, label: "Grupo Estudio", description: "Para el aprendizaje colaborativo." },
    { href: "/participations/create/chat-group", icon: MessageSquare, label: "Grupo Chat", description: "Un espacio público de conversación." },
    { href: "/participations/create/political-party", icon: Shield, label: "Partido Político", description: "Una fuerza ideológica organizada." },
    { href: "/participations/create/proposal", icon: Gavel, label: "Propuesta", description: "Presenta una nueva ley o directiva." },
    { href: "/participations/create/event", icon: Calendar, label: "Evento", description: "Organiza encuentros y actividades.", disabled: false },
];

export default function ConnectionsHubPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [recommendedPages, setRecommendedPages] = useState<AnyRecommendedPage[]>([]);
    const [myPages, setMyPages] = useState<AnyRecommendedPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendationFilter, setRecommendationFilter] = useState('all');
    const [personalizedFilter, setPersonalizedFilter] = useState('activity');

    const collectionsToFetch = [
        { name: "communities", type: 'community' },
        { name: "federated_entities", type: 'federation' },
        { name: "political_parties", type: 'political_party' },
        { name: "study_groups", type: 'study_group' },
        { name: "chat_groups", type: 'chat_group' },
        { name: "events", type: 'event' },
    ] as const;

    useEffect(() => {
        setIsLoading(true);

        const fetchAllPages = async () => {
            const allPagesData: AnyRecommendedPage[] = [];
            for (const c of collectionsToFetch) {
                const q = query(collection(db, c.name));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    allPagesData.push({ ...doc.data(), type: c.type } as AnyRecommendedPage);
                });
            }
            setRecommendedPages(allPagesData);
            
            if (user) {
                const userPages = allPagesData.filter(page => {
                    if (page.type === 'event') {
                        return Array.isArray((page as Event).attendees) && (page as Event).attendees?.includes(user.uid);
                    } else {
                        return Array.isArray((page as AnyEntity).members) && (page as AnyEntity).members?.includes(user.uid);
                    }
                });
                setMyPages(userPages);
            }
            setIsLoading(false);
        };

        fetchAllPages();

    }, [user]);
    
    const handleReloadRecommendations = () => {
        toast({
            title: "Recomendaciones Actualizadas",
            description: "Se ha generado una nueva lista de recomendaciones para ti.",
        });
    };

    const filteredRecommendations = useMemo(() => {
        if (recommendationFilter === 'all') return recommendedPages;
        if (recommendationFilter === 'groups') return recommendedPages.filter(r => r.type === 'study_group' || r.type === 'chat_group');
        return recommendedPages.filter(r => r.type === recommendationFilter);
    }, [recommendationFilter, recommendedPages]);

    const myCommunities = myPages.filter(p => p.type === 'community');
    const myFederations = myPages.filter(p => p.type === 'federation');
    const myGroups = myPages.filter(p => p.type === 'study_group' || p.type === 'chat_group');
    const myPoliticalParties = myPages.filter(p => p.type === 'political_party');
    const myEvents = myPages.filter(p => p.type === 'event');

    const renderList = (items: AnyRecommendedPage[]) => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
        }
        if (items.length === 0) {
            return <Card className="glass-card text-center p-8"><CardDescription>No perteneces a ninguna página de este tipo.</CardDescription></Card>;
        }
        return (
            <div className="space-y-4">
                {items.map((item) => <ConnectionCard key={`${item.type}-${item.id}`} item={item} />)}
            </div>
        );
    };

  return (
    <div className="space-y-8">
      <PageHeader 
          title="Hub de Conexiones"
          subtitle="Explora, crea y gestiona tus participaciones en la red."
      />
      <Card className="glass-card p-4">
        <div className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Busca perfiles, páginas, comunidades, partidos..." className="pl-12 h-14 text-lg bg-background/50" />
            </div>
            <Button size="lg" className="shrink-0 w-full sm:w-auto">Buscar en el Nexo</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Crear y Proponer Páginas Públicas</CardTitle>
                <CardDescription>Inicia nuevos espacios de colaboración y organización en la red.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {entityCreationLinks.map(link => (
                    <Button asChild variant="outline" className="h-auto flex-col p-3 gap-2 text-center" key={link.href} disabled={link.disabled}>
                        <Link href={link.href}>
                            <link.icon className="h-6 w-6 text-primary"/>
                            <div className="flex flex-col text-center">
                                <span className="font-semibold truncate">{link.label}</span>
                                <span className="text-xs font-normal text-muted-foreground hidden sm:block truncate">{link.description}</span>
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
                 <div className="flex flex-wrap items-center gap-2 mb-4">
                     <Tabs value={recommendationFilter} onValueChange={setRecommendationFilter} className="flex-grow">
                        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-card/80">
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            <TabsTrigger value="community">Comunidades</TabsTrigger>
                            <TabsTrigger value="federation">Entidades</TabsTrigger>
                            <TabsTrigger value="groups">Grupos</TabsTrigger>
                            <TabsTrigger value="political_party">Partidos</TabsTrigger>
                            <TabsTrigger value="event">Eventos</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="hidden sm:flex">
                                <SlidersHorizontal className="mr-2 h-4 w-4"/>
                                Filtro IA
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 glass-card">
                            <DropdownMenuLabel>Criterios de IA</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={personalizedFilter} onValueChange={setPersonalizedFilter}>
                              <DropdownMenuRadioItem value="activity">Basado en Actividad</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="new">Nuevas Entidades</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="location">Cerca de mí (AR)</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" onClick={handleReloadRecommendations}>
                            <RefreshCw className="h-4 w-4"/>
                        </Button>
                    </div>
                 </div>
                <Carousel opts={{ align: "start", loop: false }} className="w-full">
                    <CarouselContent className="-ml-2">
                        {filteredRecommendations.map((item, index) => (
                        <CarouselItem key={`${item.type}-${item.id}`} className="pl-2 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
                            <Card className="bg-primary/5 h-full flex flex-col group overflow-hidden rounded-xl">
                                <CardContent className="flex flex-col p-4 gap-3 flex-grow">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={'avatar' in item ? item.avatar : item.image} alt={item.name} data-ai-hint={'avatarHint' in item ? item.avatarHint : item.imageHint} />
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
                                <p className="font-semibold truncate">{vote.title}</p>
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
                                <p className="font-semibold truncate">{task.title}</p>
                                <p className="text-sm text-muted-foreground truncate">Proyecto: {task.project}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card className="glass-card">
                    <CardHeader><CardTitle className="font-headline text-xl flex items-center gap-2"><Calendar className="text-primary"/>Eventos Próximos</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {activeParticipations.events.map(event => (
                            <div key={event.title} className="p-3 rounded-lg bg-secondary/70">
                                <p className="font-semibold truncate">{event.title}</p>
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
                                <p className="font-semibold truncate">{project.title}</p>
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
                <TabsTrigger value="groups" className="rounded-lg py-2 text-base">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Grupos ({myGroups.length})
                </TabsTrigger>
                <TabsTrigger value="political_parties" className="rounded-lg py-2 text-base">
                    <Shield className="mr-2 h-5 w-5" />
                    Partidos ({myPoliticalParties.length})
                </TabsTrigger>
                <TabsTrigger value="events" className="rounded-lg py-2 text-base">
                    <Calendar className="mr-2 h-5 w-5" />
                    Eventos ({myEvents.length})
                </TabsTrigger>
                </TabsList>

                <TabsContent value="communities" className="mt-6">{renderList(myCommunities)}</TabsContent>
                <TabsContent value="federations" className="mt-6">{renderList(myFederations)}</TabsContent>
                <TabsContent value="groups" className="mt-6">{renderList(myGroups)}</TabsContent>
                <TabsContent value="political_parties" className="mt-6">{renderList(myPoliticalParties)}</TabsContent>
                <TabsContent value="events" className="mt-6">{renderList(myEvents)}</TabsContent>
            </Tabs>
       </div>
    </div>
  );
}
