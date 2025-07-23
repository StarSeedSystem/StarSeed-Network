
// src/components/participations/ConnectionCard.tsx

"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { AnyEntity, AnyRecommendedPage, Event } from "@/types/content-types";
import { getEntityPath } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "../ui/badge";

const getEntityTypeLabel = (type: AnyRecommendedPage['type']) => {
    switch (type) {
        case 'community': return 'Comunidad';
        case 'federation': return 'E. Federada';
        case 'study_group': return 'Grupo de Estudio';
        case 'chat_group': return 'Grupo de Chat';
        case 'political_party': return 'Partido Político';
        case 'event': return 'Evento';
        default: return 'Página';
    }
}

export const ConnectionCard = ({ item }: { item: AnyRecommendedPage }) => {
    const href = getEntityPath(item.type, item.slug);
    const isEvent = item.type === 'event';
    const memberCount = !isEvent ? (item as AnyEntity).members?.length || 0 : (item as Event).attendees?.length || 0;
    const itemImage = 'avatar' in item ? item.avatar : item.image;
    const itemImageHint = 'avatarHint' in item ? item.avatarHint : item.imageHint;

    return (
        <Card className="glass-card flex items-center p-4 gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarImage src={itemImage} alt={item.name} data-ai-hint={itemImageHint} />
                <AvatarFallback>{item.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <div className="flex items-center gap-2">
                    <h3 className="font-headline text-lg font-semibold">{item.name}</h3>
                    <Badge variant="secondary">{getEntityTypeLabel(item.type)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
            </div>
            <Button asChild variant="outline" className="ml-auto self-start">
                <Link href={href}>Ver Página</Link>
            </Button>
        </Card>
    );
};
