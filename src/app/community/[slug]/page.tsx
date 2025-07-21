// src/app/community/[slug]/page.tsx
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import { EntityProfile } from "@/components/profile/EntityProfile";
import type { Community } from "@/types/content-types";

// This is a Server Component that fetches data and passes it to a Client Component.
async function getEntityData(slug: string): Promise<Community | null> {
    try {
        const docRef = doc(db, "communities", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { type: 'community', id: docSnap.id, ...docSnap.data() } as Community;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching community ${slug}:`, error);
        // In case of a database error, we can also treat it as not found.
        return null;
    }
}

export default async function CommunityProfilePage({ params }: { params: { slug: string } }) {
    const entityData = await getEntityData(params.slug);

    if (!entityData) {
        notFound();
    }
    
    return <EntityProfile data={entityData} />;
}
