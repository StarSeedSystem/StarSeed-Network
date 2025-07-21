
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalCard } from "@/components/politics/ProposalCard";
import { Gavel, PlaySquare, Scale } from "lucide-react";
import { AdvancedFilter, FilterState } from "@/components/politics/AdvancedFilter";

const legislativeProposals = [
  {
    id: "prop-001",
    title: "Ley de Soberanía de Datos Personales",
    proposer: { name: "Alianza por la Privacidad Digital", avatar: "https://placehold.co/100x100.png", avatarHint: "digital shield" },
    entity: "E.F. Global",
    status: "En Votación",
    stats: { support: 72, reject: 18, abstain: 10 },
    summary: "Propuesta para establecer que cada individuo es el único propietario de sus datos generados, requiriendo consentimiento explícito para cualquier uso por parte de terceros dentro de la red."
  },
  {
    id: "prop-002",
    title: "Actualización del Protocolo de Verificación de Identidad",
    proposer: { name: "Comunidad de Seguridad Cibernética", avatar: "https://placehold.co/100x100.png", avatarHint: "cybernetic eye" },
    entity: "E.F. Global",
    status: "Debate Activo",
    stats: { comments: 152 },
    summary: "Revisión del sistema anual de verificación de identidad para incorporar métodos biométricos descentralizados y mejorar la resistencia a la suplantación de identidad."
  }
];

const executiveProjects = [
    {
        id: "proj-001",
        title: "Implementación de la Red de Energía Comunitaria",
        proposer: { name: "Legislativo Aprobado #742", avatar: "https://placehold.co/100x100.png", avatarHint: "green energy" },
        entity: "E.F. Localidad Central",
        status: "En Progreso",
        stats: { progress: 65, volunteers: 42 },
        summary: "Despliegue de la infraestructura para la red de energía solar compartida. Fase actual: Instalación de paneles en espacios comunitarios."
    }
];

const judicialCases = [
    {
        id: "case-001",
        title: "Disputa de Recursos en el Entorno Virtual 'Bosque Primordial'",
        proposer: { name: "Mediación Comunitaria", avatar: "https://placehold.co/100x100.png", avatarHint: "balanced scales" },
        entity: "Tribunal Comunitario",
        status: "En Mediación",
        stats: { participants: 5 },
        summary: "Conflicto entre dos comunidades sobre el uso y modificación de un activo digital compartido en un Entorno Virtual Persistente. Se busca una solución restaurativa."
    }
];

export default function PoliticsPage() {
  const [filters, setFilters] = useState<FilterState>({
    entity: "all",
    status: "all",
    tags: "",
    saved: false,
  });

  // Mapeo para mantener el estado "guardado" de cada tarjeta.
  // En una app real, esto podría venir de un contexto o API de usuario.
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});

  const handleSaveToggle = (id: string, isSaved: boolean) => {
    setSavedStates(prev => ({ ...prev, [id]: isSaved }));
  };

  const filterItems = (items: any[]) => {
    if (!filters.saved) {
      return items;
    }
    return items.filter(item => savedStates[item.id]);
  };
  
  return (
    <div className="space-y-8">
       <AdvancedFilter filters={filters} onFilterChange={setFilters} />

      <Tabs defaultValue="legislative" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-card/60 rounded-xl h-auto">
          <TabsTrigger value="legislative" className="rounded-lg py-2 text-base">
            <Gavel className="mr-2 h-5 w-5" />
            Legislativo
          </TabsTrigger>
          <TabsTrigger value="executive" className="rounded-lg py-2 text-base">
            <PlaySquare className="mr-2 h-5 w-5" />
            Ejecutivo
          </TabsTrigger>
           <TabsTrigger value="judicial" className="rounded-lg py-2 text-base">
            <Scale className="mr-2 h-5 w-5" />
            Judicial
          </TabsTrigger>
        </TabsList>
        <TabsContent value="legislative" className="mt-6">
            <div className="space-y-6">
                {filterItems(legislativeProposals).map(proposal => (
                    <ProposalCard 
                      key={proposal.id} 
                      {...proposal} 
                      isSaved={savedStates[proposal.id] || false}
                      onSaveToggle={(isSaved) => handleSaveToggle(proposal.id, isSaved)}
                    />
                ))}
            </div>
        </TabsContent>
        <TabsContent value="executive" className="mt-6">
            <div className="space-y-6">
                {filterItems(executiveProjects).map(proposal => (
                    <ProposalCard 
                      key={proposal.id} 
                      {...proposal}
                      isSaved={savedStates[proposal.id] || false}
                      onSaveToggle={(isSaved) => handleSaveToggle(proposal.id, isSaved)}
                    />
                ))}
            </div>
        </TabsContent>
         <TabsContent value="judicial" className="mt-6">
            <div className="space-y-6">
                {filterItems(judicialCases).map(proposal => (
                    <ProposalCard 
                      key={proposal.id} 
                      {...proposal}
                      isSaved={savedStates[proposal.id] || false}
                      onSaveToggle={(isSaved) => handleSaveToggle(proposal.id, isSaved)}
                    />
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
