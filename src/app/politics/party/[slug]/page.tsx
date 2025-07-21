
// This is a Server Component by default
import { PartyClient } from "@/components/politics/PartyClient";

interface PartyPageProps {
  params: {
    slug: string;
  };
}

// This page receives the slug from the URL and passes it to the client component.
// The client component handles all the logic for fetching and displaying data.
export default function PoliticalPartyPage({ params }: PartyPageProps) {
    return <PartyClient slug={params.slug} />;
}
