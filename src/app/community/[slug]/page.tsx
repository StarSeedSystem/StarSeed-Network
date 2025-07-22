// src/app/community/[slug]/page.tsx
import { CommunityClient } from "@/components/community/CommunityClient";

interface CommunityPageProps {
  params: {
    slug: string;
  };
}

// This page receives the slug from the URL and passes it to the client component.
// The client component handles all the logic for fetching and displaying data.
export default function CommunityProfilePage({ params }: CommunityPageProps) {
    return <CommunityClient slug={params.slug} />;
}
