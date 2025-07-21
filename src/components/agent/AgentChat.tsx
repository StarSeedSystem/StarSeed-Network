
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, Camera, SendHorizonal, BrainCircuit, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    text: string;
    sender: "user" | "agent";
}

export function AgentChat() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Hola, soy tu Exocórtex Digital. ¿En qué podemos colaborar hoy? Puedes darme instrucciones, pedirme que analice un archivo o que te ayude a crear algo nuevo.", sender: "agent" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: input,
            sender: "user"
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate agent response
        setTimeout(() => {
            const agentResponse: Message = {
                id: `agent-${Date.now()}`,
                text: `He procesado tu petición: "${userMessage.text}". Estoy analizando mis capacidades para darte la mejor respuesta. Por favor, dame un momento.`,
                sender: "agent"
            };
            setMessages(prev => [...prev, agentResponse]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden">
            <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
                <div className="space-y-8">
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-start gap-4", message.sender === 'user' && "justify-end")}>
                            {message.sender === 'agent' && (
                                <Avatar className="h-10 w-10 border-2 border-primary/50">
                                    <AvatarFallback><BrainCircuit className="text-primary" /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-lg p-4 rounded-2xl text-foreground/90",
                                message.sender === 'agent' ? "bg-card rounded-bl-none" : "bg-primary text-primary-foreground rounded-br-none"
                            )}>
                                <p className="whitespace-pre-wrap">{message.text}</p>
                            </div>
                            {message.sender === 'user' && (
                                <Avatar className="h-10 w-10 border-2 border-muted">
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                             <Avatar className="h-10 w-10 border-2 border-primary/50">
                                <AvatarFallback><BrainCircuit className="text-primary animate-pulse" /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-lg p-4 rounded-2xl bg-card rounded-bl-none">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-white/10 bg-card/50">
                <form onSubmit={handleSubmit} className="relative">
                     <Textarea
                        placeholder="Escribe un comando, haz una pregunta o pide a tu agente que cree algo..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        disabled={isLoading}
                        className="pr-40 min-h-[50px] max-h-48"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon" disabled>
                            <Paperclip className="h-5 w-5" />
                            <span className="sr-only">Adjuntar Archivo</span>
                        </Button>
                         <Button type="button" variant="ghost" size="icon" disabled>
                            <Camera className="h-5 w-5" />
                             <span className="sr-only">Activar Cámara</span>
                        </Button>
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            <SendHorizonal className="h-5 w-5" />
                            <span className="sr-only">Enviar Mensaje</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
