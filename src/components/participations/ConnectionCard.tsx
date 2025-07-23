// src/components/participations/ConnectionCard.tsx

"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { AnyEntity, AnyRecommendedPage, Event } from "@/types/content-types";
import { getEntityPath } from "@/lib/utils";
import Link from "next/link";

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
                <h3 className="font-headline text-lg font-semibold">{item.name}</h3>
                 {isEvent ? (
                     <p className="text-sm font-semibold flex items-center mt-1">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        {memberCount.toLocaleString()} Asistentes
                    </p>
                 ) : (
                    <p className="text-sm font-semibold flex items-center mt-1">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        {memberCount.toLocaleString()} Miembros
                    </p>
                 )}
            </div>
            <Button asChild variant="outline">
                <Link href={href}>Ver Página</Link>
            </Button>
        </Card>
    );
};
