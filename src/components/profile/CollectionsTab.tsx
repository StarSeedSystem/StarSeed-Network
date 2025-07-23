

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserCollection } from "@/types/content-types";
import { Folder, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface CollectionsTabProps {
    collections: UserCollection[];
}

export function CollectionsTab({ collections }: CollectionsTabProps) {
    if (collections.length === 0) {
        return (
            <Card className="glass-card rounded-2xl p-8 text-center">
                <p className="text-muted-foreground">No has creado ninguna colección todavía.</p>
                <p className="text-sm text-muted-foreground">Guarda tus páginas favoritas para organizarlas aquí.</p>
            </Card>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(collection => (
                <Card key={collection.id} className="glass-card rounded-2xl">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-3">
                            <Folder className="h-6 w-6 text-primary"/>
                            {collection.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                             {collection.privacy === 'public' ? (
                                <><Globe className="h-3 w-3" /> Pública</>
                             ) : (
                                 <><Lock className="h-3 w-3" /> Privada</>
                             )}
                             <span>· {collection.pageIds.length} páginas</span>
                             <span>· {(collection.itemIds || []).length} archivos</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href={`/collection/${collection.id}`}>Ver colección</Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
