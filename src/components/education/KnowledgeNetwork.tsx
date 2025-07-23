
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronsRight, Search, FileText, BookOpen } from 'lucide-react';
import { KnowledgeNode, UserPage } from '@/types/content-types';
import { DocumentData } from 'firebase/firestore';
import { FeedPost } from '../dashboard/FeedPost';
import { cn } from '@/lib/utils';

export type ViewMode = "list" | "map" | "network";

interface KnowledgeNetworkProps {
    nodes: KnowledgeNode[];
    posts: DocumentData[];
    viewMode: ViewMode;
    selectionMode?: boolean;
    selectedDestinations?: UserPage[];
    onSelectionChange?: (selected: UserPage[]) => void;
}

const ListView = ({ nodes, posts, selectionMode, selectedDestinations, onSelectionChange }: Omit<KnowledgeNetworkProps, 'viewMode'>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeNode, setActiveNode] = useState<KnowledgeNode | null>(null);

    const filteredNodes = useMemo(() => 
        nodes.filter(node => node.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [nodes, searchTerm]
    );

    const handleNodeClick = (node: KnowledgeNode) => {
        setActiveNode(node);
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[60vh]">
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar categoría..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="border rounded-lg h-full">
                    <div className="p-2 space-y-1">
                        {filteredNodes.map(node => {
                            const isSelected = selectedDestinations?.some(d => d.id === node.id);
                            return (
                                <button 
                                    key={node.id} 
                                    onClick={() => handleNodeClick(node)}
                                    className={cn(
                                        "w-full text-left p-2 rounded-md text-sm hover:bg-muted",
                                        activeNode?.id === node.id && 'bg-primary/10',
                                        selectionMode && isSelected && 'bg-primary/20 ring-2 ring-primary'
                                    )}
                                >
                                    {node.name}
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>
            <div className="md:col-span-2">
                <Card className="h-full glass-card">
                    <CardHeader>
                        <CardTitle>{activeNode ? activeNode.name : "Selecciona una Categoría"}</CardTitle>
                        <CardDescription>{activeNode ? activeNode.description : "Haz clic en una categoría de la izquierda para ver su contenido."}</CardDescription>
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
                                        <p className="mt-1 text-sm">Sé el primero en contribuir a esta categoría.</p>
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
