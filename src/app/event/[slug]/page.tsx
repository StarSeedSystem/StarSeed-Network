
// src/app/event/[slug]/page.tsx
import { EventClient } from "@/components/events/EventClient";

interface EventPageProps {
  params: {
    slug: string;
  };
}

// This server page receives the slug from the URL and passes it to the client component.
// The client component handles all logic for fetching and displaying data.
export default function EventPage({ params }: EventPageProps) {
    return <EventClient slug={params.slug} />;
}
