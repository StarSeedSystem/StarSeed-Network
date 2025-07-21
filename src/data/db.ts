
import { User, NatalChartData, Community } from '@/types/content-types';

// Let's create a mock database for our users.
// In a real application, this would be a database like Firestore, PostgreSQL, etc.
const users: Record<string, User> = {
  "1": {
    id: "1",
    name: "Starlight",
    handle: "starlight.eth",
    bio: "Pioneering the new digital frontier. Building a decentralized future, one block at a time.",
    avatarUrl: "/avatars/starlight.png",
    bannerUrl: "/banners/starlight-banner.jpg",
    birthData: {
        date: "1990-04-15T00:00:00.000Z",
        time: "14:30",
        location: "New York, USA"
    },
    badges: {
      verified: true,
      pioneer: true,
      aiSymbiote: false,
    },
    natalChart: {
      sun: { sign: 'Aries', house: 4 },
      moon: { sign: 'Leo', house: 8 },
      rising: { sign: 'Sagittarius' }
    },
    privacySettings: {
        profileVisibility: 'public',
        showBadges: 'public',
        showNatalChart: 'friends',
        showLibrary: 'private',
    }
  },
  // We can add more users here
};

const communities: Record<string, Community> = {
    'innovacion-sostenible': {
        name: "Innovación Sostenible",
        slug: "innovacion-sostenible",
        description: "Comunidad dedicada a encontrar e implementar soluciones ecológicas en la red.",
        longDescription: "Somos un colectivo de ingenieros, diseñadores, biólogos y entusiastas de la tecnología que trabajamos juntos para construir un futuro más sostenible. Nuestros proyectos se centran en energías renovables, economía circular y biomimética aplicada a la arquitectura digital. ¡Únete a nosotros para co-crear un nexo más verde!",
        members: 125,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "green leaf",
        banner: "https://placehold.co/1200x400.png",
        bannerHint: "sustainable city"
    },
    'arte-ciberdelico': {
        name: "Arte Ciberdélico",
        slug: "arte-ciberdelico",
        members: 342,
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "abstract art",
        description: "Explorando la intersección del arte, la tecnología y la consciencia.",
        banner: "https://placehold.co/1200x400.png",
        bannerHint: "psychedelic art"
    },
};

export const db = {
  users: {
    findUnique: async (userId: string): Promise<User | null> => {
      return users[userId] || null;
    },
    update: async (userId: string, data: Partial<User>): Promise<User | null> => {
        if (!users[userId]) {
            return null;
        }
        // Deep merge for nested objects
        const currentUser = users[userId];
        const updatedUser = {
            ...currentUser,
            ...data,
            badges: { ...currentUser.badges, ...data.badges },
            privacySettings: { ...currentUser.privacySettings, ...data.privacySettings },
            birthData: { ...currentUser.birthData, ...data.birthData },
            natalChart: data.natalChart ? { ...currentUser.natalChart, ...data.natalChart } : currentUser.natalChart
        };
        
        users[userId] = updatedUser;
        return users[userId];
    }
  },
  communities: {
      find: async (): Promise<Community[]> => {
          return Object.values(communities);
      },
      findUnique: async (slug: string): Promise<Community | null> => {
          return communities[slug] || null;
      },
      create: async (data: Community): Promise<Community> => {
          if (communities[data.slug]) {
              throw new Error("Community with this slug already exists.");
          }
          communities[data.slug] = data;
          return data;
      }
  }
};
