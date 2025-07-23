




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

interface BaseEntity {
    id: string;
    slug: string;
    name: string;
    description: string;
    longDescription?: string;
    avatar: string;
    avatarHint: string;
    banner: string;
    bannerHint: string;
    members: string[]; // Now an array of user IDs
    creatorId: string;
    type: 'community' | 'federation' | 'study_group' | 'political_party' | 'chat_group';
}

export interface Community extends BaseEntity {
    type: 'community';
    rules?: string[];
}

export interface FederatedEntity extends BaseEntity {
    type: 'federation';
    scope?: 'Local' | 'Global' | 'Continental';
}

export interface StudyGroup extends BaseEntity {
    type: 'study_group';
    topic: string;
}

export interface ChatGroup extends BaseEntity {
    type: 'chat_group';
}

export interface PoliticalParty extends BaseEntity {
    type: 'political_party';
    ideology: string;
}

export interface Event {
    id: string;
    type: 'event';
    slug: string;
    name: string;
    description: string;
    longDescription?: string;
    image: string;
    imageHint: string;
    date: string;
    location: string;
    organizer: Author;
    attendees: string[]; // Array of user IDs
}

export type AnyEntity = Community | FederatedEntity | StudyGroup | PoliticalParty | ChatGroup;

export type AnyRecommendedPage = AnyEntity | Event;

export interface UserCollection {
    id: string;
    name: string;
    pageIds: string[];
    privacy: 'public' | 'private';
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
    [key: string]: boolean;
    verified: boolean;
    pioneer: boolean;
    aiSymbiote: boolean;
  };
  collections?: UserCollection[];
  natalChart?: NatalChartData;
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'friends';
    showBadges: 'public' | 'private' | 'friends';
    showNatalChart: 'public' | 'private' | 'friends';
    showLibrary: 'public' | 'private' | 'friends';
  };
}
