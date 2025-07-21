
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/data/firebase";
import { DocumentData } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalCard } from "@/components/politics/ProposalCard";
import { Gavel, PlaySquare, Scale, PlusCircle, Loader2 } from "lucide-react";

// This is the new, dynamic Politics Page component.

export default function PoliticsPage() {
  const [proposals, setProposals] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up the real-time listener for the 'proposals' collection
    const proposalsCollection = collection(db, "proposals");
    const q = query(proposalsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const proposalsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProposals(proposalsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching proposals: ", error);
        setIsLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Centro Político</h1>
        <Button asChild>
          <Link href="/participations/create/proposal">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Propuesta
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="legislative" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-card/60 rounded-xl h-auto">
          <TabsTrigger value="legislative" className="rounded-lg py-2 text-base">
            <Gavel className="mr-2 h-5 w-5" />
            Legislativo
          </TabsTrigger>
          <TabsTrigger value="executive" className="rounded-lg py-2 text-base" disabled>
            <PlaySquare className="mr-2 h-5 w-5" />
            Ejecutivo
          </TabsTrigger>
           <TabsTrigger value="judicial" className="rounded-lg py-2 text-base" disabled>
            <Scale className="mr-2 h-5 w-5" />
            Judicial
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="legislative" className="mt-6">
            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : proposals.length > 0 ? (
                <div className="space-y-6">
                    {proposals.map(proposal => (
                        <ProposalCard 
                          key={proposal.id} 
                          id={proposal.id}
                          title={proposal.title}
                          proposer={{ name: proposal.authorName, avatar: "", avatarHint: "user avatar" }}
                          summary={proposal.summary}
                          status={proposal.status}
                          stats={{ support: proposal.votes.for, reject: proposal.votes.against, abstain: proposal.votes.abstain }}
                          timeLeft="N/A" // This can be calculated later
                          isSaved={false} // Saved state can be implemented later
                          onSaveToggle={() => {}} // Dummy function for now
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card/50 rounded-lg">
                    <h3 className="text-xl font-semibold">No Hay Propuestas Activas</h3>
                    <p className="text-muted-foreground mt-2">Sé el primero en presentar una nueva iniciativa.</p>
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
