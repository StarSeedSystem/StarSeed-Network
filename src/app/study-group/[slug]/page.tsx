
// src/app/study-group/[slug]/page.tsx
import { StudyGroupClient } from "@/components/education/StudyGroupClient";

interface StudyGroupPageProps {
  params: {
    slug: string;
  };
}

// This page receives the slug from the URL and passes it to the client component.
// The client component handles all the logic for fetching and displaying data.
export default function StudyGroupPage({ params }: StudyGroupPageProps) {
    return <StudyGroupClient slug={params.slug} />;
}
