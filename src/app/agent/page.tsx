
"use client";

import { useState } from "react";
import { AgentChat } from "@/components/agent/AgentChat";
import { AgentSidebar } from "@/components/agent/AgentSidebar";

export type ActiveContext = {
  id: string;
  type: 'project' | 'history' | 'new';
  title: string;
  description: string;
};

export default function AgentPage() {
  const [activeContext, setActiveContext] = useState<ActiveContext>({
    id: 'new-chat',
    type: 'new',
    title: 'Exocórtex Digital',
    description: 'Tu compañero de IA proactivo para la co-creación, automatización y exploración.'
  });

  return (
    <div className="h-[calc(100vh-theme(spacing.16)-2*theme(spacing.8))] flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 lg:w-1/4 h-full md:h-auto">
        <AgentSidebar activeContextId={activeContext.id} onContextChange={setActiveContext} />
      </div>
      <div className="flex-grow min-h-0 h-full">
        <AgentChat 
          key={activeContext.id} // Re-mount chat when context changes
          title={activeContext.title}
          description={activeContext.description}
        />
      </div>
    </div>
  );
}
