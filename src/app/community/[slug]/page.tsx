
// src/app/community/[slug]/page.tsx

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import { notFound } from "next/navigation";
import { CommunityProfile } from "@/components/community/CommunityProfile";
import type { Community } from "@/types/content-types";

// This is a Server Component that fetches data and passes it to a Client Component.
export default async function CommunityProfilePage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const docRef = doc(db, "communities", slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        // This will render the not-found.tsx file in this directory
        notFound();
    }

    const communityData = { id: docSnap.id, ...docSnap.data() } as Community;

    // We pass the server-fetched data to the client component for rendering.
    return <CommunityProfile initialData={communityData} />;
}
