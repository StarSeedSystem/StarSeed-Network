
// src/app/party/[slug]/page.tsx
import { PartyPage } from "@/components/politics/PartyPage";

interface PoliticalPartyPageProps {
  params: {
    slug: string;
  };
}

// Esta página recibe el slug de la URL y lo pasa al componente de cliente.
// El componente de cliente maneja toda la lógica para obtener y mostrar los datos.
export default function PoliticalPartyPage({ params }: PoliticalPartyPageProps) {
    return <PartyPage slug={params.slug} />;
}
