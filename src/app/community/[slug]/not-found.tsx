
"use client";

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold">Comunidad no encontrada</h1>
      <p className="text-muted-foreground">Esta comunidad no existe o ha sido movida.</p>
      <Button asChild className="mt-4">
        <Link href="/participations">Volver al Hub de Conexiones</Link>
      </Button>
    </div>
  )
}
