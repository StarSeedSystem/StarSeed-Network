
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import { EntityProfile } from "@/components/profile/EntityProfile";
import type { PoliticalParty } from "@/types/content-types";

async function getEntityData(slug: string): Promise<PoliticalParty | null> {
    try {
        const docRef = doc(db, "politicalParties", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as PoliticalParty;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching political party ${slug}:`, error);
        return null;
    }
}

export default async function PoliticalPartyProfilePage({ params }: { params: { slug: string } }) {
    const data = await getEntityData(params.slug);

    if (!data) {
        notFound();
    }

    return <EntityProfile data={data} />;
}
