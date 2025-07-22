
// src/app/community/[slug]/page.tsx
import { CommunityPage } from "@/components/community/CommunityPage";

interface CommunityProfilePageProps {
  params: {
    slug: string;
  };
}

// Esta página recibe el slug de la URL y lo pasa al componente de cliente.
// El componente de cliente maneja toda la lógica para obtener y mostrar los datos.
export default function CommunityProfilePage({ params }: CommunityProfilePageProps) {
    return <CommunityPage slug={params.slug} />;
}
