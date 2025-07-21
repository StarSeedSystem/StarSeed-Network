"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Home,
  User,
  Star,
  Settings,
  LogOut,
  BotMessageSquare,
  Users,
  Sun,
  Moon,
  Clapperboard,
  PenSquare,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const authRoutes = ["/login", "/signup"];

function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
          </linearGradient>
        </defs>
        <path
          fill="url(#g)"
          d="M50,5 L61.8,38.2 L98.1,38.2 L68.1,59.5 L79.9,92.7 L50,71.4 L20.1,92.7 L31.9,59.5 L1.9,38.2 L38.2,38.2 Z"
          transform="rotate(10 50 50)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="10 50 50"
            to="370 50 50"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <h1 className="text-xl font-headline font-bold text-foreground truncate">
        StarSeed Nexus
      </h1>
    </Link>
  );
}

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/publish", label: "Publicar", icon: PenSquare },
  { href: "/video-generator", label: "Video Generator", icon: Clapperboard },
  { href: "/achievements", label: "Achievements", icon: Star },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "/tutorials", label: "AI Tutorials", icon: BotMessageSquare },
];

function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} prefetch={false}>
                  <item.icon className="glowing-icon" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="justify-start w-full text-left p-2 h-auto">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="glowing astronaut" />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="font-semibold text-sm">Starlight</span>
                  <span className="text-xs text-muted-foreground">Nexus Pioneer</span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 glass-card rounded-xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/login" className="flex items-center w-full" prefetch={false}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl md:justify-end">
      {isMobile && <AppLogo />}
      <SidebarTrigger />
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (authRoutes.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
