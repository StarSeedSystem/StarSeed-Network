
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Tu centro de mando personalizado y proactivo.</p>
      </div>
      <DashboardClient />
    </div>
  );
}
