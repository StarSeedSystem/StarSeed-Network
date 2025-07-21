
// src/app/community/[slug]/page.tsx

import { notFound } from "next/navigation";
import { CommunityProfile } from "@/components/community/CommunityProfile";
import type { Community } from "@/types/content-types";

// Helper function to fetch data from our API route.
// This function runs on the server.
async function getCommunityData(slug: string): Promise<Community | null> {
    // In a real app, you'd want to use the full URL for server-side fetches,
    // often from an environment variable.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/api/communities/${slug}`, {
        cache: 'no-store' // Ensure we get fresh data every time
    });

    if (!res.ok) {
        // If the response status is 404, we can return null.
        if (res.status === 404) {
            return null;
        }
        // For other errors, we might want to throw an exception.
        throw new Error('Failed to fetch community data');
    }
    return res.json();
}

// This is a Server Component that fetches data and passes it to a Client Component.
export default async function CommunityProfilePage({ params }: { params: { slug: string } }) {
    const communityData = await getCommunityData(params.slug);

    if (!communityData) {
        // This will render the not-found.tsx file in this directory
        notFound();
    }
    
    // We pass the server-fetched data to the client component for rendering.
    return <CommunityProfile initialData={communityData} />;
}
