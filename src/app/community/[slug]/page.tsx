
// src/app/community/[slug]/page.tsx

import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import { CommunityProfile } from "@/components/community/CommunityProfile";
import type { Community } from "@/types/content-types";

// This function now runs on the server and fetches data directly from Firestore.
async function getCommunityData(slug: string): Promise<Community | null> {
    try {
        const docRef = doc(db, "communities", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Community;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching community ${slug}:`, error);
        // In case of a database error, we can also treat it as not found.
        return null;
    }
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
