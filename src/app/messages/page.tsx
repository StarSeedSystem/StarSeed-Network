
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, Edit, MoreVertical, Paperclip, Search, Send, Smile, User, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const conversationsData = [
  {
    id: 1,
    name: "GaiaPrime",
    handle: "@gaia.sol",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "glowing goddess",
    lastMessage: "¡Claro! Te envío el borrador del bioma ahora mismo.",
    time: "5m",
    unread: 2,
    online: true,
    bio: "Bióloga de sistemas y arquitecta de entornos virtuales. Co-creadora del bioma 'Bosque Primordial'.",
    messages: [
      {
        id: "msg1-1",
        author: "GaiaPrime",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing goddess",
        text: "Hola Starlight, ¿tienes un momento para revisar los últimos diseños del bioma para el Entorno Virtual 'Bosque Primordial'?",
        isOwn: false,
      },
      {
        id: "msg1-2",
        author: "Starlight",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing astronaut",
        text: "¡Hola Gaia! Por supuesto. Justo estaba pensando en eso.",
        isOwn: true,
      },
      {
        id: "msg1-3",
        author: "GaiaPrime",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing goddess",
        text: "Perfecto. La idea es integrar flora que reaccione a la data emocional de los avatares. ¿Qué te parece?",
        isOwn: false,
      },
      {
        id: "msg1-4",
        author: "Starlight",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "glowing astronaut",
        text: "Es una idea fascinante. Ciberdelia en su máxima expresión. Me encanta. ¡Claro! Te envío el borrador del bioma ahora mismo.",
        isOwn: true,
      },
    ]
  },
  {
    id: 2,
    name: "Art-AI Collective",
    handle: "@art-ai.dao",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "abstract art",
    lastMessage: "La nueva exhibición está generando mucha resonancia.",
    time: "2h",
    unread: 0,
    online: false,
    bio: "Colectivo de artistas y programadores explorando la creatividad emergente a través de la IA.",
    messages: [
        { id: "msg2-1", author: "Art-AI Collective", text: "La nueva exhibición está generando mucha resonancia. ¿Has tenido la oportunidad de visitarla?", isOwn: false, avatar: "https://placehold.co/100x100.png", avatarHint: "abstract art"},
        { id: "msg2-2", author: "Starlight", text: "Aún no, ¡pero está en mi lista! He oído maravillas.", isOwn: true, avatar: "https://placehold.co/100x100.png", avatarHint: "glowing astronaut" },
    ]
  },
  {
    id: 3,
    name: "Helios",
    handle: "@helios.dev",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "sun god",
    lastMessage: "El paper sobre redes energéticas está listo para revisión.",
    time: "1d",
    unread: 0,
    online: true,
    bio: "Ingeniero dedicado a la creación de redes de energía descentralizadas y sostenibles.",
    messages: [
        { id: "msg3-1", author: "Helios", text: "El paper sobre redes energéticas está listo para revisión. Tu perspectiva sería muy valiosa.", isOwn: false, avatar: "https://placehold.co/100x100.png", avatarHint: "sun god" },
    ]
  },
  {
    id: 4,
    name: "Innovación Sostenible",
    handle: "@sustain.comm",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "green leaf",
    lastMessage: "Próxima reunión: Planificación del proyecto de reciclaje.",
    time: "3d",
    unread: 5,
    online: false,
    bio: "Comunidad dedicada a encontrar e implementar soluciones ecológicas en la red.",
    messages: [
        { id: "msg4-1", author: "Innovación Sostenible", text: "Recordatorio: Próxima reunión mañana para la planificación del proyecto de reciclaje de bioplásticos.", isOwn: false, avatar: "https://placehold.co/100x100.png", avatarHint: "green leaf" },
    ]
  },
];


export default function MessagesPage() {
  const [conversations, setConversations] = useState(conversationsData);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Set the first conversation as active by default
    if (conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const messageToSend = {
      id: `msg-${activeConversationId}-${Date.now()}`,
      author: "Starlight",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "glowing astronaut",
      text: newMessage,
      isOwn: true,
    };
    
    const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversationId) {
            return {
                ...conv,
                messages: [...conv.messages, messageToSend],
                lastMessage: newMessage,
                time: "Now"
            };
        }
        return conv;
    });

    setConversations(updatedConversations);
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16)-2*theme(spacing.8))] flex glass-card rounded-2xl overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/4 border-r border-white/10 flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold">Mensajes</h2>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar en mensajes..." className="pl-9" />
          </div>
        </div>
        <Separator className="bg-white/10" />
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <Button
                key={conv.id}
                variant={activeConversationId === conv.id ? "secondary" : "ghost"}
                className="w-full h-auto justify-start p-2 rounded-lg"
                onClick={() => setActiveConversationId(conv.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.avatar} alt={conv.name} data-ai-hint={conv.avatarHint} />
                      <AvatarFallback>{conv.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-chart-2 ring-2 ring-card" />}
                  </div>
                  <div className="flex-1 text-left truncate">
                    <p className="font-semibold">{conv.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end text-xs text-muted-foreground h-full">
                    <p>{conv.time}</p>
                    {conv.unread > 0 && <Badge className="mt-1 bg-primary text-primary-foreground">{conv.unread}</Badge>}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Active Chat */}
      <div className="w-1/2 flex flex-col bg-background/30">
        {activeConversation ? (
          <>
            <div className="flex items-center p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} data-ai-hint={activeConversation.avatarHint} />
                  <AvatarFallback>{activeConversation.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{activeConversation.name}</p>
                  <p className="text-sm text-muted-foreground">{activeConversation.online ? "En línea" : "Desconectado"}</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {activeConversation.messages.map((msg) => (
                  <div key={msg.id} className={cn("flex items-end gap-3", msg.isOwn && "justify-end")}>
                    {!msg.isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} alt={msg.author} data-ai-hint={msg.avatarHint} />
                        <AvatarFallback>{msg.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-md p-3 rounded-2xl", msg.isOwn ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary rounded-bl-none")}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} alt={msg.author} data-ai-hint={msg.avatarHint} />
                        <AvatarFallback>{msg.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
              <div className="relative">
                <Input 
                  placeholder="Escribe un mensaje..." 
                  className="pr-28" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" type="button"><Smile className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" type="button"><Paperclip className="h-5 w-5" /></Button>
                  <Button size="icon" type="submit"><Send className="h-5 w-5" /></Button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Selecciona una conversación para empezar a chatear.</p>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="w-1/4 border-l border-white/10 flex flex-col">
        {activeConversation ? (
          <ScrollArea className="flex-1">
            <div className="flex flex-col items-center text-center p-6">
                 <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} data-ai-hint={activeConversation.avatarHint} />
                    <AvatarFallback>{activeConversation.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline mt-4">{activeConversation.name}</h3>
                <p className="text-sm text-muted-foreground">{activeConversation.handle}</p>
                <Badge variant="outline" className={cn("mt-2", activeConversation.online ? "border-chart-2 text-chart-2" : "border-muted text-muted-foreground")}>{activeConversation.online ? "Online" : "Offline"}</Badge>
            </div>
            <Separator className="bg-white/10" />
            <div className="p-6 space-y-4 text-sm">
                <p className="text-muted-foreground">{activeConversation.bio}</p>
                <div className="space-y-2">
                    <h4 className="font-semibold text-base">Insignias Compartidas</h4>
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        <span>AI Symbiote</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <span>Nexus Pioneer</span>
                    </div>
                </div>
            </div>
         </ScrollArea>
        ) : (
          <div className="flex flex-1 items-center justify-center">
             <p className="text-muted-foreground p-8 text-center">La información del contacto aparecerá aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
