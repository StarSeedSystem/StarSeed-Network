
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Edit } from "lucide-react";
import { MyPagesWidget } from "../dashboard/MyPagesWidget";
import { ProjectsWidget } from "../dashboard/ProjectsWidget";
import { LearningPathWidget } from "../dashboard/LearningPathWidget";
import { PoliticalSummaryWidget } from "../dashboard/PoliticalSummaryWidget";
import { WidgetWrapper } from "../dashboard/WidgetWrapper";

type PageType = 'community' | 'federation' | 'political_party' | 'study_group';

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const allWidgetsMap: { [key: string]: React.ComponentType } = {
    'myPages': MyPagesWidget,
    'projects': ProjectsWidget,
    'learningPath': LearningPathWidget,
    'politicalSummary': PoliticalSummaryWidget,
};

// Define default layouts for each page type
const defaultLayouts: { [key in PageType]: LayoutItem[] } = {
    community: [
        { i: 'myPages', x: 0, y: 0, w: 6, h: 4 },
        { i: 'learningPath', x: 6, y: 0, w: 6, h: 2 },
    ],
    federation: [
        { i: 'politicalSummary', x: 0, y: 0, w: 12, h: 2 },
        { i: 'projects', x: 0, y: 2, w: 12, h: 2 },
    ],
    political_party: [
        { i: 'politicalSummary', x: 0, y: 0, w: 12, h: 4 },
    ],
    study_group: [
        { i: 'learningPath', x: 0, y: 0, w: 12, h: 4 },
    ],
};

interface PublicPageDashboardProps {
    pageType: PageType;
}

export function PublicPageDashboard({ pageType }: PublicPageDashboardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const layout = defaultLayouts[pageType];

    const renderWidget = (widgetId: string) => {
        const Component = allWidgetsMap[widgetId];
        return Component ? <Component /> : null;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end items-center gap-2">
                 <Button variant="outline" disabled>
                    <LayoutTemplate className="mr-2 h-4 w-4"/> Proponer Plantilla
                 </Button>
                 <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="mr-2 h-4 w-4"/> Editar (Próximamente)
                 </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-fr">
                {layout.map(item => (
                    <div
                        key={item.i}
                        className={cn(
                            "transition-all duration-300 col-span-full",
                            `md:col-span-${Math.min(item.w * 2, 6)}`,
                            `lg:col-span-${item.w}`
                        )}
                        style={{ gridRow: `span ${item.h}` }}
                    >
                        <WidgetWrapper isEditing={isEditing} onRemove={() => {}}>
                            {renderWidget(item.i)}
                        </WidgetWrapper>
                    </div>
                ))}
            </div>
        </div>
    );
}
