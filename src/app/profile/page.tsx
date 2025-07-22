
"use client";

import { ProfileClient } from "@/components/profile/ProfileClient";
import { useUser } from "@/context/UserContext";
import { CreateProfileForm } from "@/components/profile/CreateProfileForm";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { profile, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is authenticated but has no profile document, show the creation form.
  if (!profile) {
    return <CreateProfileForm />;
  }

  // Once the profile is loaded, render the client component.
  return <ProfileClient />;
}
