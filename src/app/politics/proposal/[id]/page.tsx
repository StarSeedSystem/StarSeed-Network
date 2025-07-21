
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Gavel, MessageSquare, Tag, ThumbsDown, ThumbsUp, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentSection } from "@/components/politics/CommentSection";
import { useRouter, useParams } from "next/navigation";

// Mock data, in a real app this would be fetched based on the id
const legislativeProposals = {
  "prop-001": {
    id: "prop-001",
    title: "Ley de Soberanía de Datos Personales",
    proposer: { name: "Alianza por la Privacidad Digital", avatar: "https://placehold.co/100x100.png", avatarHint: "digital shield" },
    entity: "E.F. Global",
    status: "En Votación",
    stats: { support: 72, reject: 18, abstain: 10, comments: 2 },
    tags: ["soberanía", "privacidad", "datos", "legislación"],
    fullDescription: `
<p>Esta propuesta busca establecer, como un derecho fundamental inalienable dentro de la Constitución de la Red StarSeed, el principio de soberanía de datos. Cada individuo será el único propietario y controlador de todos los datos generados por su actividad, conciencia e interacciones dentro de la red.</p>
<h3 class="font-headline text-lg text-primary mt-4">Puntos Clave:</h3>
<ol class="list-decimal list-inside space-y-2 mt-2">
  <li><strong>Consentimiento Explícito:</strong> Ninguna entidad, aplicación o individuo podrá acceder, almacenar o utilizar los datos de otro usuario sin un consentimiento explícito, granular y revocable para cada caso de uso específico.</li>
  <li><strong>Portabilidad Universal:</strong> Los usuarios tendrán el derecho y las herramientas para exportar la totalidad de sus datos en un formato abierto y legible por máquina en cualquier momento.</li>
  <li><strong>Derecho al Olvido:</strong> Se garantizará el derecho a la eliminación completa y permanente de todos los datos personales de la red.</li>
  <li><strong>Auditoría Transparente:</strong> Todos los accesos a datos quedarán registrados en un log inmutable y auditable por el propietario de los datos.</li>
</ol>
<p class="mt-4">La aprobación de esta ley es un paso crítico para construir una sociedad digital verdaderamente libre y centrada en el individuo, protegiéndonos de los modelos de negocio extractivos que han plagado las redes del pasado.</p>
`
  },
};

const statusColors: { [key: string]: string } = {
    "En Votación": "bg-sky-blue/20 text-sky-blue border-sky-blue/30",
};

export default function ProposalDetailPage() {
    const router = useRouter();
    const params = useParams();
    const proposalId = params.id as string;
    const proposal = legislativeProposals[proposalId as keyof typeof legislativeProposals];

    if (!proposal) {
        return <div className="text-center">Propuesta no encontrada.</div>
    }

    return (
        <div className="space-y-8">
             <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Propuestas
            </Button>
             <Card className="glass-card rounded-2xl">
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <CardDescription>{proposal.entity}</CardDescription>
                            <CardTitle className="text-3xl lg:text-4xl font-headline">{proposal.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className={cn("whitespace-nowrap text-base", statusColors[proposal.status])}>{proposal.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={proposal.proposer.avatar} alt={proposal.proposer.name} data-ai-hint={proposal.proposer.avatarHint} />
                            <AvatarFallback>{proposal.proposer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-semibold">{proposal.proposer.name}</p>
                            <p className="text-sm text-muted-foreground">Proponente</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert max-w-none text-foreground/80" dangerouslySetInnerHTML={{ __html: proposal.fullDescription }} />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {proposal.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="font-normal">#{tag}</Badge>
                        ))}
                    </div>
                </CardFooter>
             </Card>

            {/* Voting Section */}
             <Card className="glass-card rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gavel className="text-primary"/>
                        Votación de la Propuesta
                    </CardTitle>
                    <CardDescription>Tu voto es tu voz en la red. El plazo para esta votación finaliza en <strong>6 días</strong>.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-3xl font-bold text-sea-green">{proposal.stats.support}</p>
                            <p className="text-sm text-muted-foreground">APOYAN</p>
                        </div>
                        <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-3xl font-bold text-coral">{proposal.stats.reject}</p>
                            <p className="text-sm text-muted-foreground">RECHAZAN</p>
                        </div>
                        <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-3xl font-bold">{proposal.stats.abstain}</p>
                            <p className="text-sm text-muted-foreground">SE ABSTIENEN</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button size="lg" variant="outline" className="border-sea-green text-sea-green hover:bg-sea-green hover:text-white">
                        <ThumbsUp className="mr-2 h-5 w-5" /> Apoyar
                    </Button>
                    <Button size="lg" variant="outline" className="border-coral text-coral hover:bg-coral hover:text-white">
                        <ThumbsDown className="mr-2 h-5 w-5" /> Rechazar
                    </Button>
                    <Button size="lg" variant="outline">
                        <MessageSquare className="mr-2 h-5 w-5" /> Debatir / Comentar
                    </Button>
                </CardFooter>
             </Card>

            {/* Comments Section */}
            <CommentSection />
        </div>
    )
}
