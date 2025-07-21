
import { User, NatalChartData } from '@/types/content-types';

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
};
