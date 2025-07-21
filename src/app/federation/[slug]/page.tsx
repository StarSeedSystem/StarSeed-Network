
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import { EntityProfile } from "@/components/profile/EntityProfile";
import type { FederatedEntity } from "@/types/content-types";

async function getEntityData(slug: string): Promise<FederatedEntity | null> {
    try {
        const docRef = doc(db, "federations", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as FederatedEntity;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching federation ${slug}:`, error);
        return null;
    }
}

export default async function FederationProfilePage({ params }: { params: { slug: string } }) {
    const data = await getEntityData(params.slug);

    if (!data) {
        notFound();
    }

    return <EntityProfile data={data} />;
}
