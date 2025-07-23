
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AchievementsWidget } from "@/components/dashboard/AchievementsWidget";
import { TutorialsWidget } from "@/components/dashboard/TutorialsWidget";
import { ProjectsWidget } from "@/components/dashboard/ProjectsWidget";
import { LearningPathWidget } from "@/components/dashboard/LearningPathWidget";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MyPagesWidget } from "./MyPagesWidget";
import { QuickAccessWidget } from "./QuickAccessWidget";


export function DashboardClient() {
    const [isEditing, setIsEditing] = useState(false);

    const widgetClasses = cn(
        "transition-all duration-300 rounded-2xl",
        isEditing && "ring-2 ring-dashed ring-primary/50"
    );

    return (
        <div className="space-y-8">
            <DashboardHeader isEditing={isEditing} onEditToggle={setIsEditing} />
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Columna Izquierda */}
                <div className="w-full lg:w-1/4 space-y-8">
                    <div className={widgetClasses}><QuickAccessWidget /></div>
                    <div className={widgetClasses}><AchievementsWidget /></div>
                    <div className={widgetClasses}><TutorialsWidget /></div>
                </div>

                {/* Columna Central (Principal) */}
                <div className="w-full lg:w-1/2 space-y-8">
                    <div className={widgetClasses}>
                        <MyPagesWidget />
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="w-full lg:w-1/4 space-y-8">
                     <div className={widgetClasses}><ProjectsWidget /></div>
                     <div className={widgetClasses}><LearningPathWidget /></div>
                </div>
            </div>
        </div>
    );
}
