
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

export interface LayoutItem {
  i: string; // Corresponds to widget id
  x: number;
  y: number;
  w: number;
  h: number;
}

const WIDGET_COLS = 12;

// Define default layout for widgets
const defaultLayout: LayoutItem[] = [
  { i: 'quickAccess', x: 0, y: 0, w: 3, h: 2 },
  { i: 'myPages', x: 3, y: 0, w: 9, h: 4 },
  { i: 'achievements', x: 0, y: 2, w: 3, h: 2 },
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
            setWidgets(JSON.parse(savedWidgets));
            setLayout(JSON.parse(savedLayout));
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
        if (widgets.some(w => w.id === widget.id)) return; // Avoid duplicates
        
        const newWidgets = [...widgets, widget];
        // Position new widget at the bottom
        const y = Math.max(0, ...layout.map(l => l.y + l.h));
        const newLayoutItem: LayoutItem = { i: widget.id, x: 0, y: y, w: 3, h: 2 };
        const newLayout = [...layout, newLayoutItem];
        
        saveDashboard(newWidgets, newLayout);
        setIsLibraryOpen(false);
    };
    
    // Renders the component for a given widget ID
    const renderWidget = (widgetId: string) => {
        const widget = widgets.find(w => w.id === widgetId);
        if (!widget) return null;
        const Component = widget.component;
        return <Component />;
    };

    return (
        <div className="space-y-8">
            <DashboardHeader 
                isEditing={isEditing} 
                onEditToggle={setIsEditing}
                onAddWidget={() => setIsLibraryOpen(true)}
            />
            {isClient ? (
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[100px]">
                    {layout.map(item => (
                        <div
                            key={item.i}
                            className={cn(
                                "transition-all duration-300 col-span-full", // Default to full width on mobile
                                `md:col-span-${Math.min(item.w * 2, 6)}`, // Adjust for medium screens
                                `lg:col-span-${item.w}` // Use defined width on large screens
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
