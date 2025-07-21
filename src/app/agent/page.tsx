import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import { AgentChat } from "@/components/agent/AgentChat";

export default function AgentPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16)-2*theme(spacing.8))] flex flex-col">
       <div className="mb-4">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <BrainCircuit className="h-10 w-10 text-primary glowing-icon" />
          Exocórtex Digital
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Tu compañero de IA proactivo para la co-creación, automatización y exploración.
        </p>
      </div>

      <div className="flex-grow">
          <AgentChat />
      </div>
    </div>
  );
}
