
import { notFound } from "next/navigation";
import { db } from "@/data/db";
import { EntityProfile } from "@/components/profile/EntityProfile";

export default async function FederationProfilePage({ params }: { params: { slug: string } }) {
    const data = await db.federations.findUnique(params.slug);

    if (!data) {
        notFound();
    }

    return <EntityProfile data={data} />;
}
