
// src/app/federated-entity/[slug]/page.tsx
import { FederatedEntityPage } from "@/components/entities/FederatedEntityPage";

interface EntityPageProps {
  params: {
    slug: string;
  };
}

export default function FederatedEntityProfilePage({ params }: EntityPageProps) {
    return <FederatedEntityPage slug={params.slug} />;
}
