
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import { EntityProfile } from "@/components/profile/EntityProfile";
import type { StudyGroup } from "@/types/content-types";

async function getEntityData(slug: string): Promise<StudyGroup | null> {
    try {
        const docRef = doc(db, "studyGroups", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as StudyGroup;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching study group ${slug}:`, error);
        return null;
    }
}

export default async function StudyGroupProfilePage({ params }: { params: { slug: string } }) {
    const data = await getEntityData(params.slug);

    if (!data) {
        notFound();
    }

    return <EntityProfile data={data} />;
}
