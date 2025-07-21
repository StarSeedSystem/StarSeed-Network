
import { User, NatalChartData, Community, FederatedEntity, StudyGroup, PoliticalParty } from '@/types/content-types';
import fs from 'node:fs';
import path from 'node:path';

// Helper function to get file path in a way that works with Next.js bundling
const getDbPath = (fileName: string) => {
    // In development, process.cwd() is the project root.
    // In production, it might be different, so we adjust.
    const baseDir = process.env.NODE_ENV === 'production' ? path.join(process.cwd(), '.next/server/app') : process.cwd();
    return path.join(baseDir, 'src/data', fileName);
};


// Helper function to read data from a JSON file
const readData = <T>(fileName: string): Record<string, T> => {
    try {
        const filePath = getDbPath(fileName);
        if (!fs.existsSync(filePath)) {
            writeData(fileName, {}); // Create the file if it doesn't exist
            return {};
        }
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(jsonString) as Record<string, T>;
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return {};
    }
};

// Helper function to write data to a JSON file
const writeData = <T>(fileName: string, data: Record<string, T>): void => {
    try {
        const filePath = getDbPath(fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing to ${fileName}:`, error);
    }
};

// Initial data load from files
let users: Record<string, User> = readData<User>('users.json');
let communities: Record<string, Community> = readData<Community>('communities.json');
let federations: Record<string, FederatedEntity> = readData<FederatedEntity>('federations.json');
let studyGroups: Record<string, StudyGroup> = readData<StudyGroup>('study-groups.json');
let politicalParties: Record<string, PoliticalParty> = readData<PoliticalParty>('political-parties.json');


// Initialize with some default data if the files are empty
if (Object.keys(users).length === 0) {
    users = {
        "1": {
            id: "1",
            name: "Starlight",
            handle: "starlight.eth",
            bio: "Pioneering the new digital frontier. Building a decentralized future, one block at a time.",
            avatarUrl: "https://placehold.co/100x100.png",
            bannerUrl: "https://placehold.co/1200x400.png",
            birthData: { date: "1990-04-15T00:00:00.000Z", time: "14:30", location: "New York, USA" },
            badges: { verified: true, pioneer: true, aiSymbiote: false },
            natalChart: { sun: { sign: 'Aries', house: 4 }, moon: { sign: 'Leo', house: 8 }, rising: { sign: 'Sagittarius' } },
            privacySettings: { profileVisibility: 'public', showBadges: 'public', showNatalChart: 'friends', showLibrary: 'private' }
        }
    };
    writeData('users.json', users);
}

if (Object.keys(communities).length === 0) {
    communities = {
        'innovacion-sostenible': {
            type: 'community', name: "Innovación Sostenible", slug: "innovacion-sostenible",
            description: "Comunidad dedicada a encontrar e implementar soluciones ecológicas en la red.",
            longDescription: "Somos un colectivo de ingenieros, diseñadores, biólogos y entusiastas de la tecnología que trabajamos juntos para construir un futuro más sostenible. Nuestros proyectos se centran en energías renovables, economía circular y biomimética aplicada a la arquitectura digital. ¡Únete a nosotros para co-crear un nexo más verde!",
            members: 125, avatar: "https://placehold.co/100x100.png", avatarHint: "green leaf",
            banner: "https://placehold.co/1200x400.png", bannerHint: "sustainable city"
        },
        'arte-ciberdelico': {
            type: 'community', name: "Arte Ciberdélico", slug: "arte-ciberdelico", members: 342,
            avatar: "https://placehold.co/100x100.png", avatarHint: "abstract art",
            description: "Explorando la intersección del arte, la tecnología y la consciencia.",
            banner: "https://placehold.co/1200x400.png", bannerHint: "psychedelic art"
        },
    };
    writeData('communities.json', communities);
}

// ... Similar initial data checks for federations, studyGroups, politicalParties ...

export const db = {
  users: {
    findUnique: async (userId: string): Promise<User | null> => {
      return users[userId] || null;
    },
    update: async (userId: string, data: Partial<User>): Promise<User | null> => {
        if (!users[userId]) return null;
        const currentUser = users[userId];
        const updatedUser = {
            ...currentUser, ...data,
            badges: { ...currentUser.badges, ...data.badges },
            privacySettings: { ...currentUser.privacySettings, ...data.privacySettings },
            birthData: { ...currentUser.birthData, ...data.birthData },
            natalChart: data.natalChart ? { ...currentUser.natalChart, ...data.natalChart } : currentUser.natalChart
        };
        users[userId] = updatedUser;
        writeData('users.json', users);
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
      create: async (data: Omit<Community, 'type'>): Promise<Community> => {
          if (communities[data.slug]) {
              throw new Error("Community with this slug already exists.");
          }
          const newCommunity: Community = { ...data, type: 'community' };
          communities[data.slug] = newCommunity;
          writeData('communities.json', communities); // Write to file
          return newCommunity;
      }
  },
  federations: {
      find: async (): Promise<FederatedEntity[]> => {
          return Object.values(federations);
      },
      findUnique: async (slug: string): Promise<FederatedEntity | null> => {
          return federations[slug] || null;
      }
  },
  studyGroups: {
      find: async (): Promise<StudyGroup[]> => {
          return Object.values(studyGroups);
      },
      findUnique: async (slug: string): Promise<StudyGroup | null> => {
          return studyGroups[slug] || null;
      }
  },
  politicalParties: {
      find: async (): Promise<PoliticalParty[]> => {
          return Object.values(politicalParties);
      },
      findUnique: async (slug: string): Promise<PoliticalParty | null> => {
          return politicalParties[slug] || null;
      }
  }
};
