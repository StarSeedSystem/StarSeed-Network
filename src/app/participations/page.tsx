import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, BookOpen, Handshake } from "lucide-react";

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
                    <CardDescription>Grupos sociales y territoriales a los que perteneces.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Aquí se mostrará una lista de tus comunidades y entidades federativas. Próximamente...</p>
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
