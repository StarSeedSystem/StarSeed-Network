
"use client";

import { useState } from "react";
import { db } from "@/data/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- Import local JSON data ---
// Direct import of the JSON objects.
import communitiesRawData from "@/data/communities.json";
import federationsRawData from "@/data/federations.json";
import partiesRawData from "@/data/political-parties.json";
import studyGroupsRawData from "@/data/study-groups.json";

// --- CORRECT CONVERSION TO ARRAY ---
// The JSON files contain objects where keys are slugs. We need an array of the values.
const communitiesArray = Object.values(communitiesRawData);
const federationsArray = Object.values(federationsRawData);
const partiesArray = Object.values(partiesRawData);
const studyGroupsArray = Object.values(studyGroupsRawData);


// Helper function to perform the migration for a specific collection
async function migrateCollection(collectionName: string, data: any[], idField: string = 'slug') {
    if (data.length === 0) {
        return { success: false, message: `No data found in source JSON for ${collectionName}.` };
    }
    
    const batch = writeBatch(db);
    let migratedCount = 0;
    
    data.forEach((item: any) => {
        const docId = item[idField];
        if (!docId) {
            console.error(`Missing ID field '${idField}' for item in ${collectionName}:`, item);
            return; // Skip items without a valid ID
        }
        const docRef = doc(db, collectionName, docId.toString());
        // Add or update the document
        batch.set(docRef, item);
        migratedCount++;
    });
    
    if (migratedCount > 0) {
        await batch.commit();
        return { success: true, message: `Successfully migrated ${migratedCount} documents to '${collectionName}'.` };
    } else {
        return { success: false, message: `No valid documents to migrate for ${collectionName}.` };
    }
}


export default function MigratePage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleMigrateAll = async () => {
        setIsLoading(true);
        toast({ title: "Starting Migration", description: "Uploading local JSON data to Firestore...", duration: 5000 });
        
        try {
            // Execute migration for each collection
            const communitiesResult = await migrateCollection('communities', communitiesArray, 'slug');
            toast({ title: "Communities Migration", description: communitiesResult.message });

            const federationsResult = await migrateCollection('federated_entities', federationsArray, 'slug');
            toast({ title: "Federated Entities Migration", description: federationsResult.message });

            const partiesResult = await migrateCollection('parties', partiesArray, 'slug');
            toast({ title: "Political Parties Migration", description: partiesResult.message });
            
            const studyGroupsResult = await migrateCollection('study_groups', studyGroupsArray, 'slug');
            toast({ title: "Study Groups Migration", description: studyGroupsResult.message });

            toast({ title: "Migration Complete!", description: "All example data is now live on Firestore.", variant: "default", duration: 9000 });

        } catch (error: any) {
            console.error("Migration failed:", error);
            toast({
                title: "Migration Failed",
                description: error.message || "An unknown error occurred during migration.",
                variant: "destructive",
                duration: 9000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="glass-card max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Database className="text-primary"/>
                        Firestore Data Migration Tool (v3)
                    </CardTitle>
                    <CardDescription>
                        This tool will upload the initial example data from local JSON files into your live Firestore database, making it the single source of truth.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-lg bg-yellow-900/20 text-yellow-200 border border-yellow-700/50 mb-4 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 mt-1"/>
                        <div>
                            <h4 className="font-bold">Important</h4>
                            <p className="text-sm">This is a one-time operation. Running it again will overwrite any existing example documents in Firestore with the data from your local JSON files.</p>
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
