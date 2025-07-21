import { ProfileClient } from "@/components/profile/ProfileClient";
import { BadgesGrid } from "@/components/profile/BadgesGrid";
import { FeedWidget } from "@/components/dashboard/FeedWidget";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileClient />
      <BadgesGrid />
      <div>
        <h2 className="text-2xl font-headline font-bold mb-4">My Posts</h2>
        <FeedWidget />
      </div>
    </div>
  );
}
