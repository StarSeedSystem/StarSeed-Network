
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronsRight, Search, FileText, BookOpen, Share2, Folder, ChevronRight } from 'lucide-react';
import { KnowledgeNode, UserPage } from '@/types/content-types';
import { DocumentData } from 'firebase/firestore';
import { FeedPost } from '../dashboard/FeedPost';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type ViewMode = "list" | "map" | "network";

interface KnowledgeNetworkProps {
    nodes: KnowledgeNode[];
    posts: DocumentData[];
    viewMode: ViewMode;
    selectionMode?: boolean;
    selectedDestinations?: UserPage[];
    onSelectionChange?: (selected: UserPage[]) => void;
}

const findNodeById = (nodes: KnowledgeNode[], id: string): KnowledgeNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

const getPathToNode = (nodes: KnowledgeNode[], nodeId: string): KnowledgeNode[] => {
    const path: KnowledgeNode[] = [];
    
    function findPath(currentNodes: KnowledgeNode[], currentPath: KnowledgeNode[]): boolean {
        for (const node of currentNodes) {
            const newPath = [...currentPath, node];
            if (node.id === nodeId) {
                path.push(...newPath);
                return true;
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


const ListView = ({ nodes, posts, selectionMode, selectedDestinations, onSelectionChange }: Omit<KnowledgeNetworkProps, 'viewMode'>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activePath, setActivePath] = useState<KnowledgeNode[]>([]);
    
    const activeNode = activePath.length > 0 ? activePath[activePath.length - 1] : null;

    const displayedNodes = useMemo(() => {
        if (searchTerm) {
            const allNodes: KnowledgeNode[] = [];
            const dive = (nodesToSearch: KnowledgeNode[]) => {
                for (const node of nodesToSearch) {
                    allNodes.push(node);
                    if (node.children) dive(node.children);
                }
            }
            dive(nodes);
            return allNodes.filter(node => node.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return activeNode?.children || nodes;
    }, [nodes, activeNode, searchTerm]);

    const handleNodeClick = (node: KnowledgeNode) => {
        if (searchTerm) {
            // When clicking from search results, construct the full path to that node
            const pathToNode = getPathToNode(nodes, node.id);
            setActivePath(pathToNode);
            setSearchTerm('');
        } else {
             setActivePath([...activePath, node]);
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
    
    const postsForNode = activeNode ? posts.filter(post => post.destinations?.some((d: any) => d.id === activeNode.id)) : [];

    const otherLocations = useMemo(() => {
        if (!activeNode || (activeNode.parentIds?.length || 0) <= 1) return [];

        const currentParentId = activePath.length > 1 ? activePath[activePath.length - 2].id : null;
        
        return (activeNode.parentIds || [])
            .filter(parentId => parentId !== currentParentId)
            .map(parentId => findNodeById(nodes, parentId))
            .filter((n): n is KnowledgeNode => n !== null);
    }, [activeNode, activePath, nodes]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[60vh]">
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar en toda la red..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
                     <Button variant="link" className="p-0 h-auto" onClick={() => setActivePath([])}>Raíz</Button>
                     {activePath.map((node, index) => (
                         <React.Fragment key={node.id}>
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
                                            {node.children ? <Folder className="h-4 w-4 text-primary"/> : <FileText className="h-4 w-4 text-muted-foreground"/>}
                                            {node.name}
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
                    </div>
                </ScrollArea>
            </div>
            <div className="md:col-span-2">
                <Card className="h-full glass-card">
                    <CardHeader>
                        <CardTitle>{activeNode ? activeNode.name : "Red de Conocimiento"}</CardTitle>
                        <CardDescription>{activeNode ? activeNode.description : "Haz clic en una categoría para explorarla."}</CardDescription>
                         {otherLocations.length > 0 && (
                            <div className="text-xs text-muted-foreground pt-2">
                                <h4 className="font-semibold flex items-center gap-2"><Share2 className="h-3 w-3"/>Ubicaciones Adicionales</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {otherLocations.map(loc => <code key={loc.id} className="p-1 bg-secondary rounded-sm">{loc.name}</code>)}
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[50vh]">
                            {activeNode && (
                                postsForNode.length > 0 ? (
                                    <div className="space-y-4">
                                        {postsForNode.map(post => <FeedPost key={post.id} post={post as any}/>)}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-10">
                                        <FileText className="mx-auto h-12 w-12" />
                                        <h3 className="mt-4 text-lg font-medium">No hay publicaciones</h3>
                                        <p className="mt-1 text-sm">Sé el primero en contribuir a {activeNode.name}.</p>
                                    </div>
                                )
                            )}
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
