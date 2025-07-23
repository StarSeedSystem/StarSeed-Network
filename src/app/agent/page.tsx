
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
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[calc(100vh-10rem)]">
      <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
        <AgentSidebar activeContextId={activeContext.id} onContextChange={setActiveContext} />
      </div>
      <div className="flex-grow min-h-0">
        <AgentChat 
          key={activeContext.id} // Re-mount chat when context changes
          title={activeContext.title}
          description={activeContext.description}
        />
      </div>
    </div>
  );
}
