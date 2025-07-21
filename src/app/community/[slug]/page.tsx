
// This is a Server Component by default
import { CommunityClient } from "@/components/community/CommunityClient";

export default function CommunityProfilePage({ params }: { params: { slug: string } }) {
    // We pass the slug to the Client Component, which will handle all data fetching and rendering logic.
    return <CommunityClient slug={params.slug} />;
}
