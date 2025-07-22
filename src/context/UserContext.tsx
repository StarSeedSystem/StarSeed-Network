
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { auth, db } from "@/data/firebase";

type UserContextType = {
    user: FirebaseUser | null;
    profile: DocumentData | null;
    loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                // If no user is logged in, reset profile and stop loading
                setProfile(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) {
            // No need to fetch profile if user is not logged in
            return;
        }

        // Set up a real-time listener for the user's profile document
        const docRef = doc(db, "users", user.uid);
        const unsubscribeProfile = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setProfile({ id: doc.id, ...doc.data() });
            } else {
                // User is authenticated but has no profile document yet
                setProfile(null);
            }
            setLoading(false); // Stop loading once we have profile info (or lack thereof)
        }, (error) => {
            console.error("Error fetching user profile:", error);
            setLoading(false); // Stop loading on error as well
        });

        return () => unsubscribeProfile();
    }, [user]); // This effect runs whenever the user object changes

    const value = { user, profile, loading };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
