
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, BookOpen, PlusCircle, Loader2, List, Map, Share2, ChevronDown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { FeedPost } from "@/components/dashboard/FeedPost";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnyEntity } from "@/types/content-types";
import { ConnectionCard } from "@/components/participations/ConnectionCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { KnowledgeNetwork, ViewMode } from "@/components/education/KnowledgeNetwork";
import { KnowledgeNode } from "@/types/content-types";
import knowledgeData from "@/data/knowledge-network.json";


export default function EducationPage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [myPages, setMyPages] = useState<AnyEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);

  useEffect(() => {
    // Load knowledge network data from JSON
    setKnowledgeNodes(knowledgeData.nodes as KnowledgeNode[]);
    
    if (!user) {
        setIsLoading(false);
        setIsLoadingPages(false);
        return;
    }

    const postsQuery = query(
        collection(db, "posts"),
        where("area", "==", "education")
    );

    const unsubscribePosts = onSnapshot(postsQuery, async (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedPosts = fetchedPosts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setPosts(sortedPosts);
        setIsLoading(false);
    });
    
    const fetchMyPages = async () => {
        setIsLoadingPages(true);
        const pages: AnyEntity[] = [];
        const collectionsToQuery = [
            { name: "study_groups", type: "study_group" },
        ] as const;

        for (const { name, type } of collectionsToQuery) {
            const q = query(collection(db, name), where('members', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                pages.push({ ...doc.data(), type } as AnyEntity);
            });
        }
        setMyPages(pages);
        setIsLoadingPages(false);
    };

    fetchMyPages();

    return () => unsubscribePosts();
  }, [user]);


  const renderMyPages = () => {
      if (isLoadingPages) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
      if (myPages.length === 0) return (
          <Card className="text-center py-16 bg-card/50 rounded-lg">
              <h3 className="text-xl font-semibold">No participas en ningún Grupo de Estudio.</h3>
              <p className="text-muted-foreground mt-2">Explora y únete a grupos para aprender colaborativamente.</p>
          </Card> 
      )
      return (
           <div className="space-y-4">
              {myPages.map(page => <ConnectionCard key={`${page.type}-${page.id}`} item={page} />)}
          </div>
      )
  }
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Educación"
        subtitle="Explora la red de conocimiento, comparte tutoriales e investigaciones."
        actionType="network"
        currentNetwork="education"
         actionButton={
            <Button asChild><Link href="/publish"><PlusCircle className="mr-2 h-4 w-4" />Añadir Contenido</Link></Button>
        }
      />
      
       <Tabs defaultValue="knowledge-network" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="knowledge-network">Red de Conocimiento</TabsTrigger>
                <TabsTrigger value="my-groups">Mis Grupos de Estudio</TabsTrigger>
                <TabsTrigger value="ai-agent">Agente IA Educativo</TabsTrigger>
            </TabsList>
            <TabsContent value="knowledge-network" className="mt-6 space-y-6">
                <Card className="glass-card">
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <CardTitle>Explorar la Red de Conocimiento</CardTitle>
                                <CardDescription>Navega por las categorías y temas para descubrir contenido.</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {viewMode === 'list' && <List className="mr-2 h-4 w-4"/>}
                                        {viewMode === 'map' && <Map className="mr-2 h-4 w-4"/>}
                                        {viewMode === 'network' && <Share2 className="mr-2 h-4 w-4"/>}
                                        Vista: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                                        <ChevronDown className="ml-2 h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="glass-card">
                                    <DropdownMenuItem onClick={() => setViewMode('list')}><List className="mr-2 h-4 w-4"/> Lista</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setViewMode('map')}><Map className="mr-2 h-4 w-4"/> Mapa Conceptual</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setViewMode('network')}><Share2 className="mr-2 h-4 w-4"/> Red 3D</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <KnowledgeNetwork 
                           nodes={knowledgeNodes} 
                           viewMode={viewMode}
                           posts={posts}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="my-groups" className="mt-6">
                {renderMyPages()}
            </TabsContent>
            <TabsContent value="ai-agent" className="mt-6">
                 <Card className="text-center py-16 bg-card/50 rounded-lg">
                    <h3 className="text-xl font-semibold flex items-center justify-center gap-2"><BrainCircuit className="h-6 w-6"/>Función en Construcción</h3>
                    <p className="text-muted-foreground mt-2">Aquí podrás interactuar con un agente de IA para que te guíe en tu aprendizaje.</p>
                </Card> 
            </TabsContent>
        </Tabs>
    </div>
  );
}
