
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

export interface NatalChartData {
    sun: { sign: string; house: number };
    moon: { sign: string; house: number };
    rising: { sign: string; };
    // We can add more planets and aspects here later
}

export interface User {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  birthData?: {
    date: string; // ISO 8601 format
    time: string; // HH:mm format
    location: string; // "City, Country"
  };
  badges: {
    verified: boolean;
    pioneer: boolean;
    aiSymbiote: boolean;
  };
  natalChart?: NatalChartData;
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'friends';
    showBadges: 'public' | 'private' | 'friends';
    showNatalChart: 'public' | 'private' | 'friends';
    showLibrary: 'public' | 'private' | 'friends';
  };
}
