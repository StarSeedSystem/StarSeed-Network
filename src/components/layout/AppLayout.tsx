

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
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
  LayoutDashboard,
  User,
  MessageSquare,
  Users,
  Network,
  Gavel,
  GraduationCap,
  Sparkles,
  PenSquare,
  Library,
  Settings,
  LogOut,
  ChevronDown,
  Info,
  Clapperboard,
  Bot,
  ArrowLeft,
  Bell,
  Store,
  LayoutTemplate,
  Folder,
  BrainCircuit,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Perfil", icon: User },
    { href: "/messages", label: "Mensajes", icon: MessageSquare },
    { href: "/notifications", label: "Notificaciones", icon: Bell },
    { href: "/participations", label: "Hub de Conexiones", icon: Users },
    { href: "/agent", label: "Agente de IA", icon: BrainCircuit },
    {
      label: "Red",
      icon: Network,
      subItems: [
        { href: "/politics", label: "Política", icon: Gavel },
        { href: "/education", label: "Educación", icon: GraduationCap },
        { href: "/culture", label: "Cultura", icon: Sparkles },
      ],
    },
    { href: "/publish", label: "Publicar", icon: PenSquare },
    {
      href: "/library",
      label: "Biblioteca",
      icon: Library,
      subItems: [
        { href: "/library/my-library", label: "Mi Biblioteca", icon: Folder },
        { href: "/library/templates", label: "Tienda Virtual", icon: Store },
      ],
    },
    {
      label: "Información",
      icon: Info,
      subItems: [
        { href: "/info/constitution", label: "Constitución" },
        { href: "#", label: "Fundamentos y Visión" },
        { href: "#", label: "Funcionamiento de la Red" },
        { href: "#", label: "Diccionario y Guías" },
      ],
    },
];

function AppSidebar() {
  const pathname = usePathname();
  const { state, setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  const renderNavItems = () => (
    navItems.map((item) =>
      item.subItems ? (
        <Collapsible key={item.label} className="w-full" asChild>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
              <SidebarMenuButton
                  variant="default"
                  className="w-full justify-between"
                  asChild
                  isActive={item.href && pathname.startsWith(item.href)}
              >
                 <Link href={item.href ?? '#'} prefetch={false}>
                  <div className="flex items-center gap-3">
                      <Tooltip>
                          <TooltipTrigger asChild>
                            <item.icon className="glowing-icon h-5 w-5" />
                          </TooltipTrigger>
                          {state === "collapsed" && <TooltipContent side="right">{item.label}</TooltipContent>}
                      </Tooltip>
                      <span className={cn(state === 'collapsed' && 'hidden')}>{item.label}</span>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180", state === 'collapsed' && "hidden")} />
                 </Link>
              </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
              <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                  <SidebarMenuItem key={`${subItem.label}-${subItem.href}`}>
                      <SidebarMenuSubButton
                      asChild
                      isActive={pathname === subItem.href}
                      >
                      <Link href={subItem.href ?? '#'} prefetch={false} onClick={handleLinkClick}>
                          {subItem.icon && <subItem.icon className="h-4 w-4" />}
                          <span>{subItem.label}</span>
                      </Link>
                      </SidebarMenuSubButton>
                  </SidebarMenuItem>
                  ))}
              </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
        </Collapsible>
      ) : (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname === item.href}>
            <Link href={item.href ?? '#'} prefetch={false} onClick={handleLinkClick}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {item.icon && <item.icon className="glowing-icon h-5 w-5" />}
                    </TooltipTrigger>
                    {state === "collapsed" && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              <span className={cn(state === 'collapsed' && 'hidden')}>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    )
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {renderNavItems()}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="justify-start w-full text-left p-2 h-auto">
                <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="glowing astronaut" />
                    <AvatarFallback>SN</AvatarFallback>
                    </Avatar>
                    <div className={cn("flex flex-col truncate transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0 hidden')}>
                        <span className="font-semibold text-sm">Starlight</span>
                        <span className="text-xs text-muted-foreground">Nexus Pioneer</span>
                    </div>
                </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56 glass-card rounded-xl mb-2">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center w-full" prefetch={false} onClick={handleLinkClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ajustes</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center w-full" prefetch={false} onClick={handleLinkClick}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
    const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex-1 text-center md:text-left">
        {/* Potentially add breadcrumbs or page title here */}
      </div>
    </header>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
    const { state, isMobile } = useSidebar();
    return (
        <div className={cn(
            "flex flex-col flex-1 transition-[margin-left] duration-300 ease-in-out",
            !isMobile && (state === 'expanded' ? "ml-[18rem]" : "ml-[4.5rem]")
        )}>
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (authRoutes.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-screen overflow-hidden">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
