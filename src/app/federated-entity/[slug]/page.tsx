
// src/app/federated-entity/[slug]/page.tsx
import { FederatedEntityClient } from "@/components/entities/FederatedEntityClient";

interface EntityPageProps {
  params: {
    slug: string;
  };
}

export default function FederatedEntityPage({ params }: EntityPageProps) {
    return <FederatedEntityClient slug={params.slug} />;
}
