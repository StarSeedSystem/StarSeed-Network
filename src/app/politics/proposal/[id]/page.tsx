
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData, runTransaction } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/politics/CommentSection";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface ProposalPageProps {
  params: { id: string };
}

function ProposalSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
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
  const [isVoting, setIsVoting] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<string | null>(null);

  const router = useRouter();
  const { id } = params;
  const { user: authUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "proposals", id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = { id: doc.id, ...doc.data() };
        setProposal(data);
        if (authUser && data.voters && data.voters[authUser.uid]) {
            setUserVote(data.voters[authUser.uid]);
        } else {
            setUserVote(null);
        }
      } else {
        setProposal(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [id, authUser]);

  const handleVote = async (optionId: string) => {
    if (!authUser) {
        toast({ title: "Authentication Required", variant: "destructive" });
        return;
    }
    if (userVote) {
        toast({ title: "Already Voted", description: "You can only vote once per proposal.", variant: "destructive" });
        return;
    }

    setIsVoting(optionId);
    try {
        const proposalRef = doc(db, "proposals", id);
        await runTransaction(db, async (transaction) => {
            const proposalDoc = await transaction.get(proposalRef);
            if (!proposalDoc.exists()) throw "Proposal does not exist!";
            
            const currentData = proposalDoc.data();
            if (currentData.voters && currentData.voters[authUser.uid]) {
                setUserVote(currentData.voters[authUser.uid]);
                throw "User has already voted.";
            }

            const newOptions = currentData.options.map((option: any) => {
                if (option.id === optionId) {
                    return { ...option, votes: option.votes + 1 };
                }
                return option;
            });
            
            const newVoters = { ...currentData.voters, [authUser.uid]: optionId };
            
            transaction.update(proposalRef, { options: newOptions, voters: newVoters });
        });
        toast({ title: "Vote Cast!", description: "Your vote has been successfully recorded." });
    } catch (error: any) {
        if (error !== "User has already voted.") {
            toast({ title: "Error Casting Vote", description: error.toString(), variant: "destructive" });
        }
    } finally {
        setIsVoting(null);
    }
  };

  if (isLoading) return <ProposalSkeleton />;
  if (!proposal) return notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Volver a Propuestas</Button>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{proposal.title}</CardTitle>
          <CardDescription>Propuesta por: {proposal.authorName} | Estado: <span className="font-semibold text-primary">{proposal.status}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="font-semibold">Texto Completo:</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{proposal.fullText}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Votación de Opciones</CardTitle>
            <CardDescription>Elige una de las siguientes opciones. Tu voto es final.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {proposal.options.map((option: any) => (
                <div key={option.id} className="p-4 border rounded-lg flex justify-between items-center bg-background/50">
                    <p className="font-medium">{option.text}</p>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">{option.votes}</span>
                        <Button 
                            onClick={() => handleVote(option.id)}
                            disabled={isVoting !== null || userVote !== null}
                            variant={userVote === option.id ? "secondary" : "default"}
                        >
                            {isVoting === option.id && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {userVote === option.id && <CheckCircle className="mr-2 h-4 w-4 text-green-500"/>}
                            {userVote === option.id ? 'Votado' : 'Votar'}
                        </Button>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>

      <CommentSection proposalId={proposal.id} />
    </div>
  );
}
