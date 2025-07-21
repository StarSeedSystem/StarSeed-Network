import { ProfileClient } from "@/components/profile/ProfileClient";
import { BadgesGrid } from "@/components/profile/BadgesGrid";
import { FeedWidget } from "@/components/dashboard/FeedWidget";
import { NatalChartWidget } from "@/components/profile/NatalChartWidget";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileClient />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <BadgesGrid />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">My Posts</h2>
              <FeedWidget />
            </div>
        </div>
        <div className="space-y-8">
            <NatalChartWidget />
        </div>
      </div>
    </div>
  );
}
