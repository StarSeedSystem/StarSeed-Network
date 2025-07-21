import { CreatePostWidget } from "@/components/dashboard/CreatePostWidget";
import { FeedWidget } from "@/components/dashboard/FeedWidget";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";
import { TutorialsWidget } from "@/components/dashboard/TutorialsWidget";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CreatePostWidget />
        <FeedWidget />
      </div>
      <div className="space-y-6">
        <AchievementsWidget />
        <TutorialsWidget />
      </div>
    </div>
  );
}
