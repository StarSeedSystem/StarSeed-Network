
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/data/firebase";
import { ProposalCard } from "@/components/politics/ProposalCard"; // Assuming proposals are shown in party feed
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PartyFeedProps {
    partyId: string; // The ID of the party whose feed we are displaying
}

export function PartyFeed({ partyId }: PartyFeedProps) {
    const [proposals, setProposals] = useState<DocumentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!partyId) return;

        const proposalsCollection = collection(db, "proposals");
        // Query for proposals specifically published in this party
        const q = query(proposalsCollection, where("publishedInProfileId", "==", partyId), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const proposalsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProposals(proposalsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching party proposals: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [partyId]);

    if (isLoading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin"/></div>;
    }

    return (
        <div className="space-y-6">
            {proposals.length > 0 ? (
                proposals.map(proposal => (
                     // We need to adapt the proposal data structure from Firestore
                    <ProposalCard 
                      key={proposal.id} 
                      id={proposal.id}
                      title={proposal.title}
                       // Use author data from the proposal document
                      proposer={{ name: proposal.authorName, avatar: proposal.authorAvatar || "", avatarHint: "user avatar" }}
                      summary={proposal.summary}
                      status={proposal.status}
                      stats={{ support: proposal.votes?.for || 0, reject: proposal.votes?.against || 0, abstain: proposal.votes?.abstain || 0 }}
                      timeLeft="N/A" 
                      isSaved={false} 
                      onSaveToggle={() => {}}
                    />
                ))
            ) : (
                <Card className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">No hay propuestas publicadas en este partido todavía.</p>
                </Card>
            )}
        </div>
    );
}
