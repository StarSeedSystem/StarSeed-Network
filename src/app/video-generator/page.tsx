"use client";

import { useState, useTransition } from "react";
import { generateVideo } from "@/ai/flows/generate-video";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Clapperboard, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function VideoGeneratorPage() {
    const [prompt, setPrompt] = useState("");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleGenerateVideo = () => {
        if (!prompt.trim()) {
            toast({
                variant: "destructive",
                title: "Prompt is empty",
                description: "Please enter a prompt to generate a video.",
            });
            return;
        }

        startTransition(async () => {
            setVideoUrl(null);
            try {
                const result = await generateVideo({ prompt });
                if (result.videoDataUri) {
                    setVideoUrl(result.videoDataUri);
                    toast({
                        title: "Video Generated!",
                        description: "Your new video is ready.",
                    });
                } else {
                     throw new Error("The AI flow did not return a video.");
                }
            } catch (error) {
                console.error("Video generation error:", error);
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                toast({
                    variant: "destructive",
                    title: "Video Generation Failed",
                    description: errorMessage,
                });
            }
        });
    };

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card className="glass-card rounded-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-2">
                        <Clapperboard className="text-primary h-8 w-8" />
                        AI Video Generator
                    </CardTitle>
                    <CardDescription>
                        Create stunning short videos from your text prompts using the power of generative AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                         <Textarea
                            id="video-prompt"
                            placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                            className="min-h-[100px] text-base"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                    <Button onClick={handleGenerateVideo} disabled={isPending} size="lg" className="w-full shadow-lg shadow-primary/30">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating... (this can take a minute)
                            </>
                        ) : (
                             <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate Video
                            </>
                        )}
                    </Button>

                     {isPending && !videoUrl && (
                        <Alert className="bg-primary/10 border-primary/20 text-center">
                            <Loader2 className="h-5 w-5 text-primary animate-spin mx-auto mb-2" />
                            <AlertTitle className="font-headline text-primary">Your video is being created...</AlertTitle>
                            <AlertDescription className="text-foreground/80">
                                The AI is working its magic. This process can take up to a minute. Please be patient.
                            </AlertDescription>
                        </Alert>
                    )}

                    {videoUrl && (
                         <div className="space-y-4">
                            <h3 className="text-xl font-headline font-semibold text-center">Your Generated Video</h3>
                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border-2 border-primary">
                                <video
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    loop
                                    className="w-full h-full object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
