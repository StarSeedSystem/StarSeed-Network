
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronsRight, Search, FileText, BookOpen, Share2, Folder, ChevronRight, Lightbulb, Link as LinkIcon } from 'lucide-react';
import { KnowledgeNode, UserPage } from '@/types/content-types';
import { DocumentData } from 'firebase/firestore';
import { FeedPost } from '../dashboard/FeedPost';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export type ViewMode = "list" | "map" | "network";
export type NetworkType = "category" | "topic";

interface KnowledgeNetworkProps {
    nodes: KnowledgeNode[]; // Initial nodes to display (either categories or topics)
    allNodes: KnowledgeNode[]; // All nodes for finding relationships
    posts: DocumentData[];
    viewMode: ViewMode;
    networkType: NetworkType;
    selectionMode?: boolean;
    selectedDestinations?: UserPage[];
    onSelectionChange?: (selected: UserPage[]) => void;
}

const findNodeById = (nodes: KnowledgeNode[], id: string): KnowledgeNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        const found = node.children ? findNodeById(node.children, id) : null;
        if (found) return found;
    }
    return null;
};

// This function needs to be robust for nested structures
const findNodeInTree = (nodes: KnowledgeNode[], nodeId: string): KnowledgeNode | null => {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return node;
        }
        if (node.children) {
            const foundInChildren = findNodeInTree(node.children, nodeId);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
    }
    return null;
};


const getPathToNode = (nodes: KnowledgeNode[], nodeId: string, currentParentId?: string): KnowledgeNode[] => {
    const path: KnowledgeNode[] = [];
    
    function findPath(currentNodes: KnowledgeNode[], currentPath: KnowledgeNode[]): boolean {
        for (const node of currentNodes) {
            const newPath = [...currentPath, node];
            if (node.id === nodeId) {
                // If we are looking for a specific path, ensure the parent matches
                if (!currentParentId || (currentPath.length > 0 && currentPath[currentPath.length - 1].id === currentParentId)) {
                     path.push(...newPath);
                     return true;
                }
            }
            if (node.children && findPath(node.children, newPath)) {
                return true;
            }
        }
        return false;
    }
    
    findPath(nodes, []);
    return path;
};


const ListView = ({ nodes, allNodes, posts, networkType, selectionMode, selectedDestinations, onSelectionChange }: Omit<KnowledgeNetworkProps, 'viewMode'>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activePath, setActivePath] = useState<KnowledgeNode[]>([]);
    
    const activeNode = activePath.length > 0 ? activePath[activePath.length - 1] : null;

    const displayedNodes = useMemo(() => {
        if (searchTerm) {
            const flatNodes: KnowledgeNode[] = [];
            const dive = (nodesToSearch: KnowledgeNode[]) => {
                for (const node of nodesToSearch) {
                    if (node.type === networkType || (networkType === 'topic' && node.type === 'concept')) {
                        flatNodes.push(node);
                    }
                    if (node.children) dive(node.children);
                }
            }
            dive(allNodes); // Search all nodes
            return flatNodes.filter(node => node.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // In category view, show children. In topic view, show all topics.
        if (networkType === 'category') {
             return activeNode?.children?.filter(c => c.type === 'category') || nodes;
        }
        return nodes;

    }, [nodes, allNodes, activeNode, searchTerm, networkType]);

    const handleNodeClick = (node: KnowledgeNode) => {
        if (searchTerm) {
            // When clicking from search results, construct the full path to that node
            const pathToNode = getPathToNode(allNodes, node.id);
            setActivePath(pathToNode.length > 0 ? pathToNode : [node]);
            setSearchTerm('');
        } else {
            if (networkType === 'category') {
                 setActivePath([...activePath, node]);
            } else { // topic network
                setActivePath([node]); // Only ever show one level deep for topics
            }
        }
    };
    
    const handleBreadcrumbClick = (index: number) => {
        setActivePath(activePath.slice(0, index + 1));
    }
    
    const handleToggleSelection = (node: KnowledgeNode) => {
        if (selectionMode && onSelectionChange) {
            const page: UserPage = { id: node.id, name: node.name, type: 'knowledge_node', areas: ['education'] };
            const isSelected = selectedDestinations?.some(d => d.id === node.id);
            const newSelection = isSelected 
                ? selectedDestinations?.filter(d => d.id !== node.id)
                : [...(selectedDestinations || []), page];
            onSelectionChange(newSelection);
        }
    };
    
    const relatedContent = useMemo(() => {
        if (!activeNode) return { posts: [], topics: [], categories: [] };
        
        const postsForNode = posts.filter(post => post.destinations?.some((d: any) => d.id === activeNode.id));

        if (activeNode.type === 'category') {
            const topics: KnowledgeNode[] = [];
            const findTopics = (nodesToSearch: KnowledgeNode[]) => {
                 for (const node of nodesToSearch) {
                    if (node.type === 'topic' || node.type === 'concept') {
                        topics.push(node);
                    }
                    if (node.children) findTopics(node.children);
                }
            }
            if(activeNode.children) findTopics(activeNode.children);
            return { posts: postsForNode, topics: topics, categories: [] };
        } else { // topic or concept
            const categories = (activeNode.parentIds || [])
                .map(parentId => findNodeInTree(allNodes, parentId))
                .filter((n): n is KnowledgeNode => n !== null && n.type === 'category');
            return { posts: postsForNode, topics: [], categories: categories };
        }

    }, [activeNode, posts, allNodes]);

    
    const getNodeIcon = (node: KnowledgeNode) => {
        switch(node.type) {
            case 'category': return <Folder className="h-4 w-4 text-primary"/>;
            case 'topic': return <FileText className="h-4 w-4 text-muted-foreground"/>;
            case 'concept': return <Lightbulb className="h-4 w-4 text-yellow-400"/>;
            default: return <FileText className="h-4 w-4 text-muted-foreground"/>;
        }
    };
    
    const getNodeTypeLabel = (node: KnowledgeNode) => {
        switch(node.type) {
            case 'category': return "Categoría";
            case 'topic': return "Tema";
            case 'concept': return "Concepto";
            default: return "";
        }
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[60vh]">
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder={`Buscar en ${networkType === 'category' ? 'categorías' : 'temas'}...`} 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
                     <Button variant="link" className="p-0 h-auto" onClick={() => setActivePath([])}>Raíz</Button>
                     {activePath.map((node, index) => (
                         <React.Fragment key={`${node.id}-${index}`}>
                            <ChevronRight className="h-4 w-4" />
                            <Button variant="link" className="p-0 h-auto" onClick={() => handleBreadcrumbClick(index)}>{node.name}</Button>
                         </React.Fragment>
                     ))}
                </div>
                <ScrollArea className="border rounded-lg h-full">
                    <div className="p-2 space-y-1">
                        {displayedNodes.map(node => {
                            const isSelected = selectedDestinations?.some(d => d.id === node.id);
                            return (
                                <div key={node.id} className={cn("w-full text-left p-2 rounded-md text-sm hover:bg-muted flex items-center justify-between", selectionMode && isSelected && 'bg-primary/20 ring-1 ring-primary')}>
                                   <button onClick={() => handleNodeClick(node)} className="flex-grow text-left">
                                        <div className="flex items-center gap-2">
                                            {getNodeIcon(node)}
                                            <span>{node.name}</span>
                                            <Badge variant="outline" className="text-xs">{getNodeTypeLabel(node)}</Badge>
                                        </div>
                                    </button>
                                    {selectionMode && (
                                         <Button variant={isSelected ? "secondary" : "outline"} size="sm" onClick={() => handleToggleSelection(node)}>
                                            {isSelected ? 'Quitar' : 'Añadir'}
                                        </Button>
                                    )}
                                </div>
                            )
                        })}
                         {displayedNodes.length === 0 && !searchTerm && (
                             <div className="p-4 text-center text-muted-foreground text-sm">
                                No hay más sub-nodos aquí.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className="md:col-span-2">
                <Card className="h-full glass-card">
                    <CardHeader>
                        <CardTitle>{activeNode ? activeNode.name : (networkType === 'category' ? "Red de Categorías" : "Red de Temas")}</CardTitle>
                        <CardDescription>{activeNode ? activeNode.description : "Haz clic en un ítem para explorarlo."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[50vh] pr-3">
                           <div className="space-y-6">
                            {/* Topics in this Category OR Categories this Topic belongs to */}
                            {activeNode && networkType === 'category' && relatedContent.topics.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4"/> Temas en esta Categoría</h4>
                                    <div className="space-y-1">
                                        {relatedContent.topics.map(topic => (
                                            <Button key={topic.id} variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary">
                                                {topic.name}
                                            </Button>
                                        ))}
                                    </div>
                                    <Separator />
                                </div>
                            )}

                            {activeNode && networkType !== 'category' && relatedContent.categories.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><LinkIcon className="h-4 w-4"/> Vinculado en Categorías</h4>
                                    <div className="space-y-1">
                                        {relatedContent.categories.map(cat => (
                                            <Button key={cat.id} variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary">
                                                {cat.name}
                                            </Button>
                                        ))}
                                    </div>
                                     <Separator />
                                </div>
                            )}

                            {/* Posts */}
                            {activeNode && (
                                relatedContent.posts.length > 0 ? (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4"/> Publicaciones Relacionadas</h4>
                                        {relatedContent.posts.map(post => <FeedPost key={post.id} post={post as any}/>)}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-10">
                                        <FileText className="mx-auto h-12 w-12" />
                                        <h3 className="mt-4 text-lg font-medium">No hay publicaciones</h3>
                                        <p className="mt-1 text-sm">Sé el primero en contribuir a {activeNode.name}.</p>
                                    </div>
                                )
                            )}
                           </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const PlaceholderView = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2">Esta visualización es una característica futura y estará disponible pronto.</p>
    </div>
);

export const KnowledgeNetwork = (props: KnowledgeNetworkProps) => {
    switch (props.viewMode) {
        case 'list':
            return <ListView {...props} />;
        case 'map':
            return <PlaceholderView title="Vista de Mapa Conceptual" />;
        case 'network':
            return <PlaceholderView title="Vista de Red 3D" />;
        default:
            return <ListView {...props} />;
    }
};

    