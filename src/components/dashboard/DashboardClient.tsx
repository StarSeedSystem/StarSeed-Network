
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WidgetLibrary, allWidgets, Widget } from "./WidgetLibrary";
import { WidgetWrapper } from "./WidgetWrapper";
import { Dialog, DialogContent } from "../ui/dialog";
import { QuickAccessWidget } from "./QuickAccessWidget";
import { MyPagesWidget } from "./MyPagesWidget";
import { ProjectsWidget } from "./ProjectsWidget";
import { LearningPathWidget } from "./LearningPathWidget";
import { AchievementsWidget } from "./AchievementsWidget";
import { PoliticalSummaryWidget } from "./PoliticalSummaryWidget";

export interface LayoutItem {
  i: string; // Corresponds to widget id
  x: number;
  y: number;
  w: number;
  h: number;
}

// Define default layout for widgets
const defaultLayout: LayoutItem[] = [
  { i: 'quickAccess', x: 0, y: 0, w: 4, h: 2 },
  { i: 'myPages', x: 4, y: 0, w: 8, h: 4 },
  { i: 'politicalSummary', x: 0, y: 2, w: 4, h: 2 },
  { i: 'projects', x: 0, y: 4, w: 6, h: 2 },
  { i: 'learningPath', x: 6, y: 4, w: 6, h: 2 },
  { i: 'achievements', x: 0, y: 6, w: 12, h: 2 },
];

const defaultWidgets = allWidgets.filter(w => defaultLayout.some(l => l.i === w.id));

export function DashboardClient() {
    const [isEditing, setIsEditing] = useState(false);
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [layout, setLayout] = useState<LayoutItem[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedWidgets = localStorage.getItem('dashboard_widgets');
        const savedLayout = localStorage.getItem('dashboard_layout');
        if (savedWidgets && savedLayout) {
            try {
                setWidgets(JSON.parse(savedWidgets));
                setLayout(JSON.parse(savedLayout));
            } catch (e) {
                setWidgets(defaultWidgets);
                setLayout(defaultLayout);
            }
        } else {
            setWidgets(defaultWidgets);
            setLayout(defaultLayout);
        }
    }, []);

    const saveDashboard = (newWidgets: Widget[], newLayout: LayoutItem[]) => {
        localStorage.setItem('dashboard_widgets', JSON.stringify(newWidgets));
        localStorage.setItem('dashboard_layout', JSON.stringify(newLayout));
        setWidgets(newWidgets);
        setLayout(newLayout);
    };

    const handleRemoveWidget = (widgetId: string) => {
        const newWidgets = widgets.filter(w => w.id !== widgetId);
        const newLayout = layout.filter(l => l.i !== widgetId);
        saveDashboard(newWidgets, newLayout);
    };

    const handleAddWidget = (widget: Widget) => {
        if (widgets.some(w => w.id === widget.id)) return;
        
        const newWidgets = [...widgets, widget];
        const y = Math.max(0, ...layout.map(l => l.y + l.h));
        const newLayoutItem: LayoutItem = { i: widget.id, x: 0, y: y, w: 4, h: 2 };
        const newLayout = [...layout, newLayoutItem];
        
        saveDashboard(newWidgets, newLayout);
        setIsLibraryOpen(false);
    };
    
    const renderWidget = (widgetId: string) => {
        const widget = allWidgets.find(w => w.id === widgetId);
        if (!widget) return null;
        const Component = widget.component;
        return <Component />;
    };
    
    const visibleLayout = layout.filter(l => widgets.some(w => w.id === l.i));

    return (
        <div className="space-y-8">
            <DashboardHeader 
                isEditing={isEditing} 
                onEditToggle={setIsEditing}
                onAddWidget={() => setIsLibraryOpen(true)}
            />
            {isClient ? (
                <div className="grid grid-cols-12 gap-6">
                    {visibleLayout.map(item => (
                        <div
                            key={item.i}
                            className={cn(
                                "col-span-full",
                                `lg:col-span-${item.w}`
                            )}
                            style={{
                                gridRow: `span ${item.h}`,
                            }}
                        >
                           <WidgetWrapper 
                             isEditing={isEditing} 
                             onRemove={() => handleRemoveWidget(item.i)}
                           >
                              {renderWidget(item.i)}
                           </WidgetWrapper>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading Dashboard...</p>
            )}

            <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                <DialogContent className="glass-card sm:max-w-[600px]">
                     <WidgetLibrary onSelectWidget={handleAddWidget} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
