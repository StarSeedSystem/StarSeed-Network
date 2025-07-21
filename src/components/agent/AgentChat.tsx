
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { runAgentFlow } from "@/ai/flows/agent-flow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Camera, SendHorizonal, BrainCircuit, User, Video, Aperture } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

interface Message {
    id: string;
    text: string;
    sender: "user" | "agent";
    image?: string;
}

export function AgentChat() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Hola, soy tu Exocórtex Digital. ¿En qué podemos colaborar hoy? Puedes darme instrucciones, pedirme que analice un archivo o que te explique cómo funciona una característica de la red.", sender: "agent" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const { toast } = useToast();

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
    
    useEffect(() => {
      return () => {
        // Cleanup: stop video stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
      }
    }, [])

    const handleToggleCamera = async () => {
        if (isCameraActive) {
            setIsCameraActive(false);
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraActive(true);
            } catch (error) {
                console.error("Error accessing camera:", error);
                setHasCameraPermission(false);
                toast({
                    variant: "destructive",
                    title: "Acceso a la Cámara Denegado",
                    description: "Por favor, habilita los permisos de la cámara en tu navegador.",
                });
            }
        }
    };
    
    const handleCaptureAndAnalyze = () => {
        if (!videoRef.current || !canvasRef.current || !input.trim()) {
            toast({
                variant: "destructive",
                title: "Falta Información",
                description: "Por favor, escribe una pregunta antes de capturar la imagen.",
            });
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUri = canvas.toDataURL("image/jpeg");
            handleSubmit(new Event("submit"), imageDataUri);
        }
    };

    const handleSubmit = async (e: FormEvent | Event, image?: string) => {
        e.preventDefault();
        if ((!input.trim() && !image) || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: input,
            sender: "user",
            image: image,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const agentResponse = await runAgentFlow({
                prompt: userMessage.text,
                imageDataUri: image,
            });

            const aiMessage: Message = {
                id: `agent-${Date.now()}`,
                text: agentResponse.answer,
                sender: "agent"
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
             const aiMessage: Message = {
                id: `agent-error-${Date.now()}`,
                text: "Lo siento, he encontrado un error al procesar tu petición. Por favor, inténtalo de nuevo.",
                sender: "agent"
            };
            setMessages(prev => [...prev, aiMessage]);
             console.error("Error calling AI flow:", error);
        } finally {
            setIsLoading(false);
            // Turn off camera after analysis
            if (isCameraActive && image) {
                handleToggleCamera();
            }
        }
    };

    return (
        <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden">
            <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
                <div className="space-y-8">
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-start gap-4", message.sender === 'user' && "flex-row-reverse")}>
                            {message.sender === 'agent' ? (
                                <Avatar className="h-10 w-10 border-2 border-primary/50">
                                    <AvatarFallback><BrainCircuit className="text-primary" /></AvatarFallback>
                                </Avatar>
                            ) : (
                                <Avatar className="h-10 w-10 border-2 border-muted">
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-lg p-4 rounded-2xl text-foreground/90 flex flex-col gap-3",
                                message.sender === 'agent' ? "bg-card rounded-bl-none" : "bg-primary text-primary-foreground rounded-br-none"
                            )}>
                                {message.image && (
                                    <Image src={message.image} alt="User capture" width={300} height={200} className="rounded-lg" />
                                )}
                                <p className="whitespace-pre-wrap">{message.text}</p>
                            </div>
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

            {isCameraActive && (
                <div className="p-4 border-t border-white/10 bg-black">
                     {!hasCameraPermission ? (
                        <Alert variant="destructive">
                            <AlertTitle>Acceso a la Cámara Requerido</AlertTitle>
                            <AlertDescription>
                                Por favor, permite el acceso a la cámara en tu navegador para usar esta función.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="relative">
                            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    )}
                </div>
            )}

            <div className="p-4 border-t border-white/10 bg-card/50">
                <form onSubmit={handleSubmit} className="relative">
                     <Textarea
                        placeholder={isCameraActive ? "Escribe qué quieres que analice en la imagen..." : "Escribe un comando o haz una pregunta..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey && !isCameraActive) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        disabled={isLoading}
                        className="pr-48"
                        rows={1}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" disabled>
                            <Paperclip className="h-5 w-5" />
                            <span className="sr-only">Adjuntar Archivo</span>
                        </Button>
                         <Button type="button" variant="ghost" size="icon" onClick={handleToggleCamera} disabled={isLoading}>
                            <Camera className={cn("h-5 w-5", isCameraActive && "text-primary")} />
                             <span className="sr-only">Activar Cámara</span>
                        </Button>
                        {isCameraActive ? (
                             <Button type="button" size="sm" onClick={handleCaptureAndAnalyze} disabled={isLoading || !input.trim()}>
                                <Aperture className="h-5 w-5 mr-2" />
                                Capturar
                            </Button>
                        ) : (
                             <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                <SendHorizonal className="h-5 w-5" />
                                <span className="sr-only">Enviar Mensaje</span>
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
