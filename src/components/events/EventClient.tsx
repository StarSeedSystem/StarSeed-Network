
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/utils/BackButton";
import { Calendar, MapPin, Users, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { doc, onSnapshot, DocumentData, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/data/firebase";

interface EventClientProps {
  slug: string;
}

export function EventClient({ slug }: EventClientProps) {
  const [event, setEvent] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [isUpdatingAttendance, setIsUpdatingAttendance] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (!slug) return;
    const docRef = doc(db, "events", slug);
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = { id: doc.id, ...doc.data() };
            setEvent(data);
            if (user) {
                setIsAttending(data.attendees?.includes(user.uid));
            }
        } else {
            setEvent(null);
        }
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [slug, user]);

  const handleAttendClick = async () => {
    if (!user || !event) {
        toast({ title: "Debes iniciar sesión para asistir.", variant: "destructive" });
        return;
    }

    setIsUpdatingAttendance(true);
    const docRef = doc(db, "events", event.id);

    try {
        if (isAttending) {
            await updateDoc(docRef, { attendees: arrayRemove(user.uid) });
            toast({
                title: "Asistencia cancelada",
                description: `Ya no asistirás a ${event?.name}.`,
            });
        } else {
            await updateDoc(docRef, { attendees: arrayUnion(user.uid) });
            toast({
                title: "¡Inscripción confirmada!",
                description: `Nos vemos en ${event?.name}.`,
            });
        }
        setIsAttending(!isAttending);
    } catch (error: any) {
        console.error("Error updating attendance:", error);
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setIsUpdatingAttendance(false);
    }
  };


  if (isLoading) {
    // You can add a skeleton loader here
    return <div>Loading event...</div>;
  }

  if (!event) {
    notFound();
  }
  
  const attendeeCount = event?.attendees?.length || 0;

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="relative h-64 w-full rounded-2xl overflow-hidden group">
        <Image src={event.image} alt={`${event.name} Banner`} layout="fill" objectFit="cover" data-ai-hint={event.imageHint} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <div className="relative px-4 sm:px-8 pb-8 -mt-24">
        <div className="bg-card/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold font-headline mb-2">{event.name}</h1>
          <p className="text-lg text-muted-foreground">{event.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{attendeeCount} Asistentes</span>
            </div>
          </div>
          <Button
            size="lg"
            className={cn(
                "mt-6 w-full sm:w-auto",
                isAttending && "bg-green-600 hover:bg-green-700"
            )}
            onClick={handleAttendClick}
            disabled={!user || isUpdatingAttendance}
          >
            {isUpdatingAttendance ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : isAttending ? (
                <><Check className="mr-2 h-5 w-5" /> Asistiendo</>
            ) : (
                "Asistiré"
            )}
          </Button>
        </div>
      </div>
      <div className="px-4 sm:px-8 prose dark:prose-invert max-w-none text-foreground/90">
        <h2 className="font-headline text-2xl">Acerca de este evento</h2>
        <p>{event.longDescription}</p>
      </div>
    </div>
  );
}
