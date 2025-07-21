
import { notFound } from "next/navigation";
import { db } from "@/data/db";
import { EntityProfile } from "@/components/profile/EntityProfile";

export default async function PoliticalPartyProfilePage({ params }: { params: { slug: string } }) {
    const data = await db.politicalParties.findUnique(params.slug);

    if (!data) {
        notFound();
    }

    return <EntityProfile data={data} />;
}
