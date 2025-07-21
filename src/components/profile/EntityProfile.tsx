
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Check, Users, Info, PenSquare, Building, BookOpen, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/utils/BackButton";
import { AnyEntity } from "@/types/content-types";

// Mock data, will be replaced by dynamic data
const communityPosts: any[] = [];
const communityMembers: any[] = [];

type EntityProfileProps = {
    data: AnyEntity;
}

const getEntityIcon = (type: AnyEntity['type']) => {
    switch (type) {
        case 'community': return <Users className="h-4 w-4" />;
        case 'federation': return <Building className="h-4 w-4" />;
        case 'study_group': return <BookOpen className="h-4 w-4" />;
        case 'political_party': return <Shield className="h-4 w-4" />;
        default: return <Users className="h-4 w-4" />;
    }
}


export function EntityProfile({ data }: EntityProfileProps) {
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
                    <AvatarImage src={data.avatar} alt="Entity Avatar" data-ai-hint={data.avatarHint} />
                    <AvatarFallback>{data.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 flex-grow">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{data.name}</h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                {getEntityIcon(data.type)}
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
                        <Card className="glass-card text-center p-8">
                            <CardDescription>No hay publicaciones todavía.</CardDescription>
                        </Card>
                    </TabsContent>
                    <TabsContent value="members" className="mt-6">
                         <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Miembros ({communityMembers.length})</CardTitle>
                                <CardDescription>Las personas que dan vida a esta entidad.</CardDescription>
                            </CardHeader>
                             <CardContent className="text-center p-8">
                                <CardDescription>La lista de miembros aparecerá aquí.</CardDescription>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="about" className="mt-6">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Acerca de {data.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-invert max-w-none text-foreground/80">
                                <p>{data.longDescription || 'No hay una descripción detallada disponible.'}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
