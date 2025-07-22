
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData, updateDoc, increment } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, ThumbsDown, Hand } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/politics/CommentSection";
import { useToast } from "@/hooks/use-toast";

interface ProposalPageProps {
  params: {
    id: string; // The document ID from the URL
  };
}

function ProposalSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Separator />
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        </div>
    );
}


export default function ProposalPage({ params }: ProposalPageProps) {
  const [proposal, setProposal] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = params;
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "proposals", id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setProposal({ id: doc.id, ...doc.data() });
      } else {
        setProposal(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching proposal:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (isLoading) {
    return <ProposalSkeleton />;
  }

  if (!proposal) {
    return notFound();
  }
  
  const handleVote = async (voteType: 'for' | 'against' | 'abstain') => {
      if (!user) {
        toast({ title: "Debes iniciar sesión para votar.", variant: "destructive" });
        return;
      }
      if (!proposal) return;

      const docRef = doc(db, "proposals", proposal.id);
      
      try {
        await updateDoc(docRef, {
            [`votes.${voteType}`]: increment(1)
        });
        toast({ title: "¡Voto registrado!", description: "Gracias por tu participación." });
      } catch (error) {
        console.error("Error al registrar el voto:", error);
        toast({ title: "Error al votar", variant: "destructive" });
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Propuestas
      </Button>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{proposal.title}</CardTitle>
          <CardDescription>
            Propuesta por: {proposal.authorName} | Estado: <span className="font-semibold text-primary">{proposal.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="font-semibold">Resumen:</h3>
            <p>{proposal.summary}</p>
            <Separator className="my-6" />
            <h3 className="font-semibold">Texto Completo:</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{proposal.fullText}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Votación</CardTitle>
            <CardDescription>Emite tu voto sobre esta propuesta.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white flex-1" onClick={() => handleVote('for')}>
                <ThumbsUp className="mr-2"/> A Favor ({proposal.votes.for})
            </Button>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white flex-1" onClick={() => handleVote('against')}>
                <ThumbsDown className="mr-2"/> En Contra ({proposal.votes.against})
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={() => handleVote('abstain')}>
                <Hand className="mr-2"/> Abstenerse ({proposal.votes.abstain})
            </Button>
        </CardContent>
      </Card>

      <CommentSection proposalId={proposal.id} />

    </div>
  );
}
