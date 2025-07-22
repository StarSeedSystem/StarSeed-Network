
// src/app/study-group/[slug]/page.tsx
import { StudyGroupPage } from "@/components/education/StudyGroupPage";

interface StudyGroupPageProps {
  params: {
    slug: string;
  };
}

// Esta página recibe el slug de la URL y lo pasa al componente de cliente.
// El componente de cliente maneja toda la lógica para obtener y mostrar los datos.
export default function StudyGroupProfilePage({ params }: StudyGroupPageProps) {
    return <StudyGroupPage slug={params.slug} />;
}
