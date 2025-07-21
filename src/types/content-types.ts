
export interface Author {
    name: string;
    avatar: string;
    avatarHint: string;
}

export interface BaseContent {
    id: string;
    title: string;
    type: string;
    author: Author;
    image: string;
    imageHint: string;
    description: string;
}

export interface CulturalContent extends BaseContent {
    // Cultural-specific properties can go here
}

export interface EducationalContent extends BaseContent {
    category: string;
    level: "Principiante" | "Intermedio" | "Avanzado";
}
