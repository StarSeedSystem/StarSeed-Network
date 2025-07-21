import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function ConstitutionPage() {
  return (
    <div className="space-y-8">
       <Card className="glass-card">
         <CardHeader>
           <div className="flex items-center gap-4">
             <div>
               <CardTitle className="font-headline text-3xl">Constitución de la Red StarSeed</CardTitle>
               <CardDescription>Las leyes fundamentales, derechos, límites y principios que guían a nuestra sociedad.</CardDescription>
             </div>
           </div>
         </CardHeader>
         <CardContent className="prose prose-invert max-w-none text-foreground/80">
            <h2 className="font-headline text-2xl text-primary">Preámbulo</h2>
            <p>
                Nosotros, los pioneros de la Red StarSeed, en la búsqueda de una evolución consciente y colectiva, establecemos esta Constitución como el pacto fundamental para nuestra coexistencia digital y social. Nuestro propósito es construir una sociedad basada en la soberanía individual, la inteligencia colectiva, la armonía con el universo y el florecimiento ilimitado del potencial humano.
            </p>
            <h2 className="font-headline text-2xl text-primary">Artículo 1: Principios Fundamentales</h2>
            <ol>
                <li><strong>Soberanía del Ser:</strong> Cada individuo es dueño absoluto de su conciencia, datos y destino. La red es una herramienta para la auto-realización, no un fin en sí misma.</li>
                <li><strong>Conocimiento Libre:</strong> El acceso a la información y la educación es un derecho universal e inalienable. El conocimiento es un bien común que debe ser compartido, expandido y protegido colectivamente.</li>
                <li><strong>Gobernanza Ontocrática:</strong> El poder y la responsabilidad se otorgan en función de la sabiduría, la contribución y la integridad demostradas dentro de la red, no por acumulación de poder o riqueza.</li>
                <li><strong>Justicia Restaurativa:</strong> Nuestro sistema judicial busca la comprensión, la sanación y la reintegración, no el castigo. El objetivo es restaurar el equilibrio y aprender de los conflictos.</li>
            </ol>
            <p className="text-center text-muted-foreground mt-8">
                [ El documento completo de la Constitución estará disponible aquí, desarrollado de forma colaborativa por la comunidad. ]
            </p>
         </CardContent>
       </Card>
    </div>
  );
}
