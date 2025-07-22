
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy, DocumentData, limit } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalCard } from "@/components/politics/ProposalCard";
import { Gavel, PlusCircle, Loader2, Flag, Landmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Reusable card for Political Parties and Federations
function PoliticalEntityCard({ entity, type }: { entity: DocumentData, type: 'party' | 'federation' }) {
    const linkPath = type === 'party' ? `/party/${entity.slug}` : `/federated-entity/${entity.slug}`;
    const memberCount = Array.isArray(entity.members) ? entity.members.length : 0;
    return (
        <Link href={linkPath} passHref>
            <Card className="glass-card hover:bg-primary/10 transition-colors h-full flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                    <Avatar>
                        <AvatarImage src={entity.avatar} />
                        <AvatarFallback>{entity.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-lg">{entity.name}</CardTitle>
                        <CardDescription>{memberCount} Members</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">{entity.description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function PoliticsPage() {
  const [proposals, setProposals] = useState<DocumentData[]>([]);
  const [parties, setParties] = useState<DocumentData[]>([]);
  const [federations, setFederations] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener for proposals
    const proposalsQuery = query(collection(db, "proposals"), orderBy("createdAt", "desc"));
    const unsubscribeProposals = onSnapshot(proposalsQuery, (snapshot) => {
        setProposals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false); // Set loading to false after the primary content loads
    });

    // Listener for political parties
    const partiesQuery = query(collection(db, "political_parties"));
    const unsubscribeParties = onSnapshot(partiesQuery, (snapshot) => {
        setParties(snapshot.docs.map(doc => doc.data()));
    });

    // Listener for federated entities
    const federationsQuery = query(collection(db, "federated_entities"));
    const unsubscribeFederations = onSnapshot(federationsQuery, (snapshot) => {
        setFederations(snapshot.docs.map(doc => doc.data()));
    });

    return () => {
      unsubscribeProposals();
      unsubscribeParties();
      unsubscribeFederations();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Centro Político</h1>
         <Button asChild><Link href="/publish"><PlusCircle className="mr-2 h-4 w-4" />Crear Contenido</Link></Button>
      </div>

      <Tabs defaultValue="legislative" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-card/60 rounded-xl h-auto">
          <TabsTrigger value="legislative" className="rounded-lg py-2 text-base"><Gavel className="mr-2 h-5 w-5" />Propuestas</TabsTrigger>
          <TabsTrigger value="parties" className="rounded-lg py-2 text-base"><Flag className="mr-2 h-5 w-5" />Partidos Políticos</TabsTrigger>
          <TabsTrigger value="federations" className="rounded-lg py-2 text-base"><Landmark className="mr-2 h-5 w-5" />Entidades Federativas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="legislative" className="mt-6">
            {isLoading ? ( <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
            ) : proposals.length > 0 ? (
                <div className="space-y-6">
                    {proposals.map(proposal => (
                        <ProposalCard key={proposal.id} id={proposal.id} title={proposal.title}
                          proposer={{ name: proposal.authorName, avatar: "", avatarHint: "user avatar" }}
                          entity={proposal.publishedInProfileName || "Red General"}
                          summary={proposal.summary} status={proposal.status}
                          stats={{ support: proposal.votes.for, reject: proposal.votes.against, abstain: proposal.votes.abstain }}
                          timeLeft="N/A" isSaved={false} onSaveToggle={() => {}} />
                    ))}
                </div>
            ) : ( <div className="text-center py-16 bg-card/50 rounded-lg"><h3 className="text-xl font-semibold">No Hay Propuestas Activas</h3><p className="text-muted-foreground mt-2">Sé el primero en presentar una nueva iniciativa.</p></div> )}
        </TabsContent>

        <TabsContent value="parties" className="mt-6">
            {isLoading ? ( <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
            ) : parties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parties.map(party => <PoliticalEntityCard key={party.slug} entity={party} type="party" />)}
                </div>
            ) : ( <div className="text-center py-16 bg-card/50 rounded-lg"><h3 className="text-xl font-semibold">No Hay Partidos Políticos</h3><p className="text-muted-foreground mt-2">Sé el primero en registrar uno.</p></div> )}
        </TabsContent>

        <TabsContent value="federations" className="mt-6">
            {isLoading ? ( <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin"/></div>
            ) : federations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {federations.map(fed => <PoliticalEntityCard key={fed.slug} entity={fed} type="federation" />)}
                </div>
            ) : ( <div className="text-center py-16 bg-card/50 rounded-lg"><h3 className="text-xl font-semibold">No Hay Entidades Federativas</h3><p className="text-muted-foreground mt-2">Sé el primero en establecer una.</p></div> )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
