
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheck, UserPlus, Heart, MessageSquare, Gavel, Users, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Notification = {
    id: string;
    type: "follow" | "like" | "comment" | "vote" | "invite";
    author: {
        name: string;
        avatar: string;
        avatarHint: string;
    };
    content: string;
    context: string;
    timestamp: string;
    isRead: boolean;
};

const initialNotifications: Notification[] = [
    {
        id: "notif-1",
        type: "follow",
        author: { name: "Helios", avatar: "https://placehold.co/100x100.png", avatarHint: "sun god" },
        content: "ha comenzado a seguirte.",
        context: "",
        timestamp: "hace 5 min",
        isRead: false,
    },
    {
        id: "notif-2",
        type: "like",
        author: { name: "GaiaPrime", avatar: "https://placehold.co/100x100.png", avatarHint: "glowing goddess" },
        content: "le ha gustado tu publicación:",
        context: "Mi nuevo avatar de IA está listo...",
        timestamp: "hace 1 hora",
        isRead: false,
    },
    {
        id: "notif-3",
        type: "comment",
        author: { name: "CyberSec-DAO", avatar: "https://placehold.co/100x100.png", avatarHint: "cybernetic eye" },
        content: "ha comentado en tu propuesta:",
        context: "Ley de Soberanía de Datos...",
        timestamp: "hace 3 horas",
        isRead: true,
    },
    {
        id: "notif-4",
        type: "vote",
        author: { name: "E.F. Global", avatar: "https://placehold.co/100x100.png", avatarHint: "city skyline" },
        content: "La votación ha finalizado para:",
        context: "Actualización del Protocolo de Verificación de Identidad. El resultado es: APROBADO",
        timestamp: "hace 1 día",
        isRead: true,
    },
    {
        id: "notif-5",
        type: "invite",
        author: { name: "Art-AI Collective", avatar: "https://placehold.co/100x100.png", avatarHint: "abstract art" },
        content: "te ha invitado a unirte a su comunidad.",
        context: "",
        timestamp: "hace 2 días",
        isRead: false,
    },
];

const notificationIcons = {
    follow: <UserPlus className="h-5 w-5 text-sky-blue" />,
    like: <Heart className="h-5 w-5 text-accent" />,
    comment: <MessageSquare className="h-5 w-5 text-primary" />,
    vote: <Gavel className="h-5 w-5 text-solar-orange" />,
    invite: <Users className="h-5 w-5 text-sea-green" />,
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAllAsRead = () => {
        setNotifications(
            notifications.map((n) => ({ ...n, isRead: true }))
        );
    };

    const renderNotificationList = (filter: (n: Notification) => boolean) => {
        const filtered = notifications.filter(filter);
        if (filtered.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
                    <p>No tienes notificaciones en esta categoría.</p>
                </div>
            )
        }
        return (
            <div className="space-y-3">
                {filtered.map((n) => (
                    <div
                        key={n.id}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-card/90",
                            n.isRead ? "bg-card/60" : "bg-primary/10 border border-primary/20"
                        )}
                    >
                        <div className="mt-1 flex-shrink-0">{notificationIcons[n.type]}</div>
                        <div className="flex-grow">
                             <div className="flex items-center gap-2 flex-wrap">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={n.author.avatar} alt={n.author.name} data-ai-hint={n.author.avatarHint} />
                                    <AvatarFallback>{n.author.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                    <span className="font-semibold">{n.author.name}</span> {n.content}
                                </p>
                            </div>
                            {n.context && (
                                <blockquote className="mt-2 pl-3 text-sm border-l-2 border-muted-foreground/30 text-muted-foreground italic">
                                   "{n.context}"
                                </blockquote>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{n.timestamp}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                         <div className="flex items-center gap-3">
                             <div>
                                <CardTitle className="font-headline text-3xl">Notificaciones</CardTitle>
                                <CardDescription>Toda tu actividad reciente en la red, en un solo lugar.</CardDescription>
                            </div>
                         </div>
                        <Button variant="outline" onClick={markAllAsRead}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Marcar todo como leído
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList className="bg-card/80">
                            <TabsTrigger value="all">Todas</TabsTrigger>
                            <TabsTrigger value="unread">No Leídas</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4">
                            {renderNotificationList(() => true)}
                        </TabsContent>
                        <TabsContent value="unread" className="mt-4">
                            {renderNotificationList((n) => !n.isRead)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
