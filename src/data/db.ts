// This file is no longer the primary source of truth for dynamic data
// like communities, which are now stored in Firestore.
// It is kept for potentially static or less frequently changed data.

import { User, NatalChartData, Community, FederatedEntity, StudyGroup, PoliticalParty } from '@/types/content-types';

// The db object can be expanded here with other data sources if needed,
// but the core dynamic collections are now in Firebase.

// Example of how you might keep some data here:
const staticData = {
  // e.g., platform-wide settings or enumerations
  features: [
    { value: "Multi-Destination Posting", label: "Multi-Destination Posting" },
    { value: "Federated Entities", label: "Federated Entities" },
    { value: "AR/VR Templates", label: "AR/VR Templates" },
  ]
};


export const db = {
  // This structure can be used for other non-Firestore data
  static: staticData,
};
