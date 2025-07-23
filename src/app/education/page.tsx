
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, BookOpen, PlusCircle, Loader2, List, Share2, ChevronDown, FileText, Folder, Network, Layers } from "lucide-react";
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
  
  const [allNodes, setAllNodes] = useState<KnowledgeNode[]>([]);
  const [categoryNodes, setCategoryNodes] = useState<KnowledgeNode[]>([]);
  const [topicNodes, setTopicNodes] = useState<KnowledgeNode[]>([]);

  const [activeTab, setActiveTab] = useState("categories-network");
  const [articleFilter, setArticleFilter] = useState<"all" | "class" | "article">("all");

  useEffect(() => {
    // Load and process knowledge network data from JSON
    const allNodesData = knowledgeData.nodes as KnowledgeNode[];
    setAllNodes(allNodesData);

    const categories = allNodesData.filter(node => node.type === 'category');
    
    // Use a Map to ensure unique nodes when flattening for the topics network
    const topicsAndConceptsMap = new Map<string, KnowledgeNode>();
    const findTopicsRecursive = (nodes: KnowledgeNode[]) => {
        for (const node of nodes) {
            if (node.type === 'topic' || node.type === 'concept') {
                if (!topicsAndConceptsMap.has(node.id)) {
                    topicsAndConceptsMap.set(node.id, node);
                }
            }
            if (node.children) {
                findTopicsRecursive(node.children);
            }
        }
    }
    findTopicsRecursive(allNodesData);
    const topicsAndConcepts = Array.from(topicsAndConceptsMap.values());

    setCategoryNodes(categories);
    setTopicNodes(topicsAndConcepts);
    
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
  
  const filteredPosts = useMemo(() => {
    if (articleFilter === 'all') return posts;
    return posts.filter(p => p.subArea === articleFilter);
  }, [posts, articleFilter]);
  
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
      
       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 bg-card/60 rounded-xl h-auto">
                <TabsTrigger value="categories-network"><Folder className="mr-2 h-4 w-4"/>Red de Categorías</TabsTrigger>
                <TabsTrigger value="topics-network"><FileText className="mr-2 h-4 w-4"/>Red de Temas</TabsTrigger>
                <TabsTrigger value="publications">Publicaciones</TabsTrigger>
                <TabsTrigger value="my-groups">Mis Grupos de Estudio</TabsTrigger>
                <TabsTrigger value="ai-agent">Agente IA Educativo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories-network" className="mt-6 space-y-6">
                <Card className="glass-card">
                    <CardHeader>
                         <CardTitle>Explorar la Red de Categorías</CardTitle>
                         <CardDescription>Navega por las categorías principales para descubrir temas y contenido relacionado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <KnowledgeNetwork 
                           nodes={categoryNodes}
                           allNodes={allNodes}
                           posts={posts}
                           viewMode={viewMode}
                           networkType="category"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="topics-network" className="mt-6 space-y-6">
                 <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Explorar la Red de Temas</CardTitle>
                        <CardDescription>Busca temas específicos y descubre en qué categorías se encuentran.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <KnowledgeNetwork 
                           nodes={topicNodes} 
                           allNodes={allNodes}
                           posts={posts}
                           viewMode={viewMode}
                           networkType="topic"
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="publications" className="mt-6 space-y-4">
                <Tabs value={articleFilter} onValueChange={(v) => setArticleFilter(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">Todo</TabsTrigger>
                        <TabsTrigger value="article"><FileText className="mr-2 h-4 w-4"/>Artículos</TabsTrigger>
                        <TabsTrigger value="class"><BookOpen className="mr-2 h-4 w-4"/>Clases</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="space-y-6">
                    {isLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>}
                    {!isLoading && filteredPosts.length === 0 && (
                        <Card className="text-center py-16 bg-card/50 rounded-lg">
                            <h3 className="text-xl font-semibold">No hay publicaciones de este tipo.</h3>
                        </Card>
                    )}
                    {filteredPosts.map(post => <FeedPost key={post.id} post={post as any}/>)}
                </div>
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
