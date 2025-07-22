
"use client";

import { useState } from "react";
import { db } from "@/data/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- Import local JSON data ---
import communitiesData from "@/data/communities.json";
import federationsData from "@/data/federations.json";
import partiesData from "@/data/political-parties.json";
import studyGroupsData from "@/data/study-groups.json";
import chatGroupsData from "@/data/chat-groups.json";
import eventsData from "@/data/events.json";

// The data is structured as { "slug-1": { ... }, "slug-2": { ... } }
// We need to convert the inner object to an array.
const communitiesArray = Object.values(communitiesData);
const federationsArray = Object.values(federationsData);
const partiesArray = Object.values(partiesData);
const studyGroupsArray = Object.values(studyGroupsData);
const chatGroupsArray = Object.values(chatGroupsData);
const eventsArray = Object.values(eventsData);


// Helper function to perform the migration for a specific collection
async function migrateCollection(collectionName: string, data: any[], idField: string = 'slug') {
    if (data.length === 0) {
        return { success: true, message: `No data to migrate for ${collectionName}.` };
    }
    
    const batch = writeBatch(db);
    
    data.forEach(item => {
        const docId = item[idField];
        if (!docId) {
            console.error(`Missing ID field '${idField}' for item in ${collectionName}:`, item);
            return; 
        }
        const docRef = doc(db, collectionName, docId.toString());
        batch.set(docRef, item);
    });
    
    await batch.commit();
    return { success: true, message: `Successfully migrated ${data.length} documents to '${collectionName}'.` };
}


export default function MigratePage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleMigrateAll = async () => {
        setIsLoading(true);
        toast({ title: "Starting Migration", description: "Uploading local JSON data to Firestore..." });
        
        try {
            const communitiesResult = await migrateCollection('communities', communitiesArray, 'slug');
            toast({ title: "Communities", description: communitiesResult.message });

            const federationsResult = await migrateCollection('federated_entities', federationsArray, 'slug');
            toast({ title: "Federated Entities", description: federationsResult.message });

            const partiesResult = await migrateCollection('political_parties', partiesArray, 'slug');
            toast({ title: "Political Parties", description: partiesResult.message });
            
            const studyGroupsResult = await migrateCollection('study_groups', studyGroupsArray, 'slug');
            toast({ title: "Study Groups", description: studyGroupsResult.message });
            
            const chatGroupsResult = await migrateCollection('chat_groups', chatGroupsArray, 'slug');
            toast({ title: "Chat Groups", description: chatGroupsResult.message });

            const eventsResult = await migrateCollection('events', eventsArray, 'slug');
            toast({ title: "Events", description: eventsResult.message });

            toast({ title: "Migration Complete!", description: "All example data is now live on Firestore.", variant: "default" });

        } catch (error: any) {
            console.error("Migration failed:", error);
            toast({
                title: "Migration Failed",
                description: error.message || "An unknown error occurred. Make sure your Firestore security rules are correctly set up.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="glass-card max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Database className="text-primary"/>
                        Firestore Data Migration Tool
                    </CardTitle>
                    <CardDescription>
                        This tool will upload the initial example data from local JSON files into your live Firestore database. This makes the app fully functional with server-side data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-lg bg-yellow-900/20 text-yellow-200 border border-yellow-700/50 mb-4 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 mt-1"/>
                        <div>
                            <h4 className="font-bold">Important</h4>
                            <p className="text-sm">Run this operation once to populate your database. Running it again will overwrite any changes you've made to the example documents in Firestore.</p>
                        </div>
                    </div>
                    <Button onClick={handleMigrateAll} disabled={isLoading} className="w-full" size="lg">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                           "Migrate All Example Data to Firestore"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
