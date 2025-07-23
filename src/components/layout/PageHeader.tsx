
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Gavel,
  GraduationCap,
  Sparkles,
  Users,
  PlusCircle,
  Folder,
  Store,
  Library,
} from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { PanelLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionType?: "network" | "profile" | "library";
  currentNetwork?: "politics" | "education" | "culture";
  currentLibrary?: "hub" | "my-library" | "templates";
  actionButton?: React.ReactNode;
}

const networkLinks = [
  { href: "/politics", label: "Política", icon: Gavel },
  { href: "/education", label: "Educación", icon: GraduationCap },
  { href: "/culture", label: "Cultura", icon: Sparkles },
];

const profileLinks = [
  { href: "#", label: "Cambiar Perfil" },
  { href: "/profile/create", label: "Crear Nuevo Perfil" },
];

const libraryLinks = [
  { href: "/library", label: "Hub de la Biblioteca", icon: Library },
  { href: "/library/my-library", label: "Mi Biblioteca", icon: Folder },
  { href: "/library/templates", label: "Tienda Virtual", icon: Store },
];

const getLinks = (
  type?: "network" | "profile" | "library",
  current?: string
) => {
  switch (type) {
    case "network":
      return networkLinks.filter((l) => l.href.includes(current || ""));
    case "library":
      return libraryLinks.filter((l) => l.href.includes(current || ""));
    default:
      return [];
  }
};

export function PageHeader({
  title,
  subtitle,
  actionType,
  currentNetwork,
  currentLibrary,
  actionButton,
}: PageHeaderProps) {
  const { isMobile, toggleSidebar } = useSidebar();

  const renderNetworkDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-2xl md:text-3xl font-bold font-headline p-0 h-auto">
          {title}
          <ChevronDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card">
        {networkLinks.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
            <Users className="mr-2 h-4 w-4" />
            Gestionar Perfiles
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card">
        <DropdownMenuLabel>Perfiles de la Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Starlight (Actual)</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir/Crear Perfil
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderLibraryDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-2xl md:text-3xl font-bold font-headline p-0 h-auto">
          {title}
          <ChevronDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card">
        {libraryLinks.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderTitle = () => {
    switch (actionType) {
      case "network":
        return renderNetworkDropdown();
      case "library":
        return renderLibraryDropdown();
      default:
        return <h1 className="text-2xl md:text-3xl font-bold font-headline">{title}</h1>;
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="-ml-2">
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          {renderTitle()}
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{subtitle}</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {actionType === 'profile' ? renderProfileDropdown() : actionButton}
      </div>
    </div>
  );
}
