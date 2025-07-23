
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        subtitle="Tu centro de mando personalizado y proactivo."
      />
      <DashboardClient />
    </div>
  );
}
