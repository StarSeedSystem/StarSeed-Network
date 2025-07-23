
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { db } from '@/data/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, ArrowRight, Star, Loader2 } from 'lucide-react';
import type { AnyRecommendedPage } from '@/types/content-types';
import Link from 'next/link';
import { getEntityPath } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function MyPagesWidget() {
    const { user } = useUser();
    const [pages, setPages] = useState<AnyRecommendedPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('activity');

    const collectionsToFetch = [
        { name: "communities", type: 'community' },
        { name: "federated_entities", type: 'federation' },
        { name: "political_parties", type: 'political_party' },
        { name: "study_groups", type: 'study_group' },
        { name: "chat_groups", type: 'chat_group' },
        { name: "events", type: 'event' },
    ] as const;

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchUserPages = async () => {
            setIsLoading(true);
            const userPages: AnyRecommendedPage[] = [];

            for (const c of collectionsToFetch) {
                const q = query(collection(db, c.name), where('members', 'array-contains', user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    userPages.push({ ...doc.data(), type: c.type } as AnyRecommendedPage);
                });
            }
            setPages(userPages);
            setIsLoading(false);
        };

        fetchUserPages();
    }, [user]);

    const filteredPages = useMemo(() => {
        // Here you would implement the actual filtering logic based on the 'filter' state.
        // For now, we'll just return the pages as is.
        return pages;
    }, [pages, filter]);

    return (
        <Card className="glass-card rounded-2xl h-full">
            <CardHeader className='flex-row items-center justify-between'>
                <div>
                    <CardTitle className="font-headline">Mis Páginas</CardTitle>
                    <CardDescription>Acceso rápido a tus comunidades y proyectos.</CardDescription>
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filtrar
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 glass-card">
                        <DropdownMenuLabel>Ordenar y Filtrar</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                            <DropdownMenuRadioItem value="activity">Actividad Reciente</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="new_publications">Nuevas Publicaciones</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="most_visited" disabled>Más Visitadas</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="most_commented" disabled>Más Comentadas</DropdownMenuRadioItem>
                             <DropdownMenuRadioItem value="favorites" disabled>Favoritas</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[450px] pr-3">
                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredPages.length > 0 ? (
                             filteredPages.map(page => (
                                <Link href={getEntityPath(page.type, page.slug)} key={page.id} passHref>
                                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                                        <Avatar className='h-10 w-10'>
                                            <AvatarImage src={'avatar' in page ? page.avatar : page.image} data-ai-hint={'avatarHint' in page ? page.avatarHint : page.imageHint} />
                                            <AvatarFallback>{page.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className='flex-grow'>
                                            <p className='font-semibold'>{page.name}</p>
                                            <p className='text-xs text-muted-foreground capitalize'>{page.type.replace('_', ' ')}</p>
                                        </div>
                                        <div className='flex items-center text-muted-foreground'>
                                            {false && <Star className="h-4 w-4 text-yellow-400 fill-current mr-2" />}
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                             <div className="text-center py-16 text-muted-foreground">
                                <p>No perteneces a ninguna página todavía.</p>
                                <Button variant="link" asChild><Link href="/participations">Explora y únete a páginas</Link></Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
