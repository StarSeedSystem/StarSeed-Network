
"use client";

import { ProfileClient } from "@/components/profile/ProfileClient";

export default function ProfilePage() {
  // ProfileClient now handles its own data fetching and logic based on the authenticated user.
  // We no longer need to pass any props here.
  return <ProfileClient />;
}
