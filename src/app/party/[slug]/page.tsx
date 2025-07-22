
// src/app/party/[slug]/page.tsx
import { PartyClient } from "@/components/politics/PartyClient";

interface PartyPageProps {
  params: {
    slug: string;
  };
}

// Esta página recibe el slug de la URL y lo pasa al componente de cliente.
// El componente de cliente maneja toda la lógica para obtener y mostrar los datos.
export default function PoliticalPartyPage({ params }: PartyPageProps) {
    return <PartyClient slug={params.slug} />;
}
