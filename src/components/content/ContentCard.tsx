
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CulturalContent, EducationalContent } from "@/types/content-types";

type ContentCardProps = {
    content: CulturalContent | EducationalContent;
};

// Type guard to check if content is EducationalContent
function isEducationalContent(content: any): content is EducationalContent {
    return 'category' in content && 'level' in content;
}

export function ContentCard({ content }: ContentCardProps) {

    return (
        <Card className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full">
            <div className="aspect-video relative">
                <Image src={content.image} alt={content.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={content.imageHint} />
                 <div className="absolute top-3 right-3">
                     <Button variant="ghost" size="icon" className="bg-black/30 backdrop-blur-sm rounded-full h-8 w-8 text-white hover:bg-black/50 hover:text-white">
                        <Bookmark className="h-4 w-4" />
                     </Button>
                 </div>
            </div>
            <CardHeader>
                {isEducationalContent(content) ? (
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{content.category} - {content.type}</span>
                        <Badge variant="outline">{content.level}</Badge>
                    </div>
                ) : (
                    <CardDescription>{content.type}</CardDescription>
                )}
                <CardTitle className="font-headline text-xl">{content.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-foreground/80">{content.description}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 mt-auto">
                 <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={content.author.avatar} alt={content.author.name} data-ai-hint={content.author.avatarHint} />
                        <AvatarFallback>{content.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-muted-foreground">{content.author.name}</span>
                </div>
                <div className="flex justify-between w-full border-t border-white/10 pt-3">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <MessageSquare className="h-4 w-4" /> 12
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent">
                        <Heart className="h-4 w-4" /> 42
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-sky-blue">
                        <Share className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
