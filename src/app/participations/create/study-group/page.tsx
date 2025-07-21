
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/data/firebase";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";

export default function CreateStudyGroupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user: authUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupTopic, setGroupTopic] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) {
            toast({ title: "Authentication Required", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const groupSlug = slugify(groupName);
        if (!groupSlug) {
            toast({ title: "Invalid Name", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        const groupData = {
            name: groupName,
            slug: groupSlug,
            topic: groupTopic,
            memberCount: 1,
            creatorId: authUser.uid,
            avatarUrl: `https://avatar.vercel.sh/${groupSlug}.png`,
            bannerUrl: `https://placehold.co/1200x400/333333/ffffff?text=${groupName}`,
            createdAt: serverTimestamp(),
        };
        
        try {
            const groupRef = doc(db, "study_groups", groupSlug);
            await setDoc(groupRef, groupData);

            toast({
                title: "Study Group Created!",
                description: `The group "${groupName}" is now active.`,
            });
            router.push(`/study-group/${groupSlug}`);

        } catch (error) {
             console.error("Error creating study group:", error);
             toast({ title: "Creation Failed", variant: "destructive" });
             setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary glowing-icon" />
                        Form a Study Group
                    </CardTitle>
                    <CardDescription>
                        Create a focused space for collaborative learning and research.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Name of the Study Group</Label>
                            <Input id="group-name" placeholder="Ej: Quantum Computing Explorers" required value={groupName} onChange={(e) => setGroupName(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group-topic">Main Topic or Subject</Label>
                            <Input id="group-topic" placeholder="Quantum Mechanics, AI Ethics, etc." required value={groupTopic} onChange={(e) => setGroupTopic(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Form Group
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
