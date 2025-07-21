

import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Check, Users, Info, PenSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFeed } from "@/components/profile/ProfileFeed";
import type { FeedPostType } from "@/components/dashboard/FeedPost";
import type { Community } from "@/types/content-types";
import { db } from "@/data/db";
import { BackButton } from "@/components/utils/BackButton";


const communityPosts: FeedPostType[] = [
    {
        author: "GaiaPrime",
        handle: "gaia.sol",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing goddess",
        content: "¡Gran debate hoy sobre la implementación de granjas verticales en nuestros entornos virtuales! La propuesta de usar assets que crezcan con energía de la red fue aprobada. #sostenibilidad",
        comments: 15,
        reposts: 7,
        likes: 58,
        destinations: ["Innovación Sostenible"]
    },
];

const communityMembers = [
    { name: "GaiaPrime", avatar: "https://placehold.co/100x100.png", avatarHint: "glowing goddess", role: "Fundadora" },
    { name: "Helios", avatar: "https://placehold.co/100x100.png", avatarHint: "sun god", role: "Coordinador de Energía" },
    { name: "Starlight", avatar: "https://placehold.co/100x100.png", avatarHint: "glowing astronaut", role: "Miembro" }
]

async function getCommunityData(slug: string): Promise<Community | null> {
    // In a real app, this would fetch this from your database.
    // We are simulating that with our db object.
    const community = await db.communities.findUnique(slug);
    return community;
}

export default async function CommunityProfilePage({ params }: { params: { slug: string } }) {
    const data = await getCommunityData(params.slug);

    if (!data) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <BackButton />
            <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
                <Image src={data.banner} alt="Profile Banner" layout="fill" objectFit="cover" data-ai-hint={data.bannerHint} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
            <div className="relative px-4 sm:px-8 pb-8 -mt-24">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={data.avatar} alt="Community Avatar" data-ai-hint={data.avatarHint} />
                    <AvatarFallback>{data.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{data.name}</h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4" /> 
                                {data.members.toLocaleString()} Miembros
                            </p>
                        </div>
                         <div className="flex items-center gap-2">
                            <Button variant="outline">
                                <Bell className="mr-2 h-4 w-4" /> Notificaciones
                            </Button>
                             <Button>
                                <Check className="mr-2 h-4 w-4" /> Unido
                            </Button>
                         </div>
                    </div>
                    <p className="mt-4 text-foreground/90">{data.description}</p>
                </div>
                </div>
            </div>
            <div className="px-4 sm:px-8">
                <Tabs defaultValue="publications" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-card/60 rounded-xl">
                        <TabsTrigger value="publications" className="rounded-lg">
                            <PenSquare className="mr-2 h-4 w-4"/>
                            Publicaciones
                        </TabsTrigger>
                        <TabsTrigger value="members" className="rounded-lg">
                            <Users className="mr-2 h-4 w-4"/>
                            Miembros
                        </TabsTrigger>
                        <TabsTrigger value="about" className="rounded-lg">
                            <Info className="mr-2 h-4 w-4"/>
                            Acerca de
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="publications" className="mt-6">
                        {/* Here we would have a create post widget specific for the community */}
                        <ProfileFeed initialFeed={communityPosts} />
                    </TabsContent>
                    <TabsContent value="members" className="mt-6">
                         <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Miembros ({communityMembers.length})</CardTitle>
                                <CardDescription>Las personas que dan vida a esta comunidad.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                               {communityMembers.map(member => (
                                    <Card key={member.name} className="bg-card/80 flex items-center p-3 gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.avatarHint} />
                                            <AvatarFallback>{member.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.role}</p>
                                        </div>
                                    </Card>
                               ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="about" className="mt-6">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Acerca de {data.name}</CardTitle>
                            </Header>
                            <CardContent className="prose prose-invert max-w-none text-foreground/80">
                                <p>{data.longDescription}</p>
                                <h3 className="font-headline text-xl text-primary mt-6">Reglas y Principios</h3>
                                <ol>
                                    <li>Fomentar la colaboración abierta y la transparencia.</li>
                                    <li>Respetar la diversidad de opiniones y conocimientos.</li>
                                    <li>Todas las propuestas se someterán a votación comunitaria.</li>
                                </ol>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
