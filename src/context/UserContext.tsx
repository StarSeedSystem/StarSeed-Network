
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
    name: string;
    handle: string;
    title: string;
    avatarUrl: string;
    bannerUrl: string;
    bio: string;
    badges: { [key: string]: boolean };
}

interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const defaultUser: User = {
    name: "Starlight",
    handle: "@starlight.eth",
    title: "Nexus Pioneer",
    avatarUrl: "https://placehold.co/128x128.png",
    bannerUrl: "https://placehold.co/1200x400.png",
    bio: "Digital nomad exploring the intersections of consciousness and technology. Co-creating the future in the StarSeed Nexus.",
    badges: {
        nexusPioneer: true,
        aiSymbiote: false,
    },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(defaultUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
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
