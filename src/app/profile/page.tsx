
"use client";

import { useEffect } from "react";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { useUser } from "@/context/UserContext";
import { CreateProfileForm } from "@/components/profile/CreateProfileForm";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ProfilePage() {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect only after the loading is complete and we confirm there's no user.
    // This prevents trying to navigate during the initial render.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);


  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center -m-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is logged in, but their profile is still loading or doesn't exist,
  // we can show the appropriate UI. The useEffect will not run the redirect.
  if (user) {
      // If user is authenticated but has no profile document, show the creation form.
      if (!profile) {
        return <CreateProfileForm />;
      }
      // Once the profile is loaded, render the client component.
      return (
        <div className="space-y-4">
           <PageHeader
                title="Mi Perfil"
                subtitle="Tu identidad y presencia en la red StarSeed."
                actionType="profile"
            />
          <ProfileClient />
        </div>
      );
  }

  // If there's no user and we are not loading, the useEffect will handle the redirect.
  // We can return a loader or null here to prevent rendering anything briefly before redirect.
  return (
      <div className="flex h-screen w-full items-center justify-center -m-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
  );
}
