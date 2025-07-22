
// src/app/community/[slug]/page.tsx
import { CommunityClient } from "@/components/community/CommunityClient";

interface CommunityPageProps {
  params: {
    slug: string;
  };
}

// Esta página recibe el slug de la URL y lo pasa al componente de cliente.
// El componente de cliente maneja toda la lógica para obtener y mostrar los datos.
export default function CommunityPage({ params }: CommunityPageProps) {
    return <CommunityClient slug={params.slug} />;
}
