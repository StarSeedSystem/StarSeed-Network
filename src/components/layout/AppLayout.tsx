
"use client";

import React, { createContext, useContext, useState } from "react";
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
  PanelLeft,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const authRoutes = ["/login", "/signup", "/migrate"];

// Context for Header
type HeaderContextType = {
  headerInfo: { icon: React.ReactNode, title: string, subtitle: string } | null;
  setHeaderInfo: React.Dispatch<React.SetStateAction<{ icon: React.ReactNode, title: string, subtitle: string } | null>>;
};

const HeaderContext = createContext<HeaderContextType | null>(null);

export const useHeader = () => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
};

const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [headerInfo, setHeaderInfo] = useState<{ icon: React.ReactNode, title: string, subtitle: string } | null>(null);

    return (
        <HeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
            {children}
        </HeaderContext.Provider>
    );
};


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
  const { user } = useUser();

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
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full text-left p-2 h-auto">
                  <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User Avatar'} data-ai-hint="glowing astronaut" />
                      <AvatarFallback>{user.displayName?.substring(0, 2) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className={cn("flex flex-col truncate transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0 hidden')}>
                          <span className="font-semibold text-sm">{user.displayName || user.email}</span>
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
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
    const { isMobile, toggleSidebar } = useSidebar();
    const { headerInfo } = useHeader();
    const pathname = usePathname();

    const isSpecialPage = viewModePages.includes(pathname) || /^\/(collection|community|politics\/proposal|event|party|study-group|federated-entity|chat-group)\//.test(pathname);

    
    // A mapping from path prefixes to their header info
    const pageHeaders: { [key: string]: { icon: React.ReactNode, title: string, subtitle: string } } = {
        '/': { icon: <LayoutDashboard className="h-8 w-8 text-primary"/>, title: "Dashboard", subtitle: "Tu centro de mando personalizado y proactivo." },
        '/dashboard': { icon: <LayoutDashboard className="h-8 w-8 text-primary"/>, title: "Dashboard", subtitle: "Tu centro de mando personalizado y proactivo." },
        '/profile': { icon: <User className="h-8 w-8 text-primary"/>, title: "Perfil", subtitle: "Tu identidad digital y escaparate personal." },
        '/messages': { icon: <MessageSquare className="h-8 w-8 text-primary"/>, title: "Mensajes", subtitle: "Conversaciones directas y seguras." },
        '/notifications': { icon: <Bell className="h-8 w-8 text-primary"/>, title: "Notificaciones", subtitle: "Toda tu actividad reciente en la red, en un solo lugar." },
        '/participations': { icon: <Users className="h-8 w-8 text-primary"/>, title: "Hub de Conexiones", subtitle: "Tu centro para descubrir, crear y gestionar todas tus interacciones en la Red." },
        '/agent': { icon: <BrainCircuit className="h-8 w-8 text-primary"/>, title: "Agente de IA", subtitle: "Tu compañero de IA proactivo para la co-creación, automatización y exploración." },
        '/politics': { icon: <Gavel className="h-8 w-8 text-primary"/>, title: "Red de Política", subtitle: "El parlamento digital de la red. Aquí se proponen, debaten y gestionan las decisiones que nos afectan a todos." },
        '/education': { icon: <GraduationCap className="h-8 w-8 text-primary"/>, title: "Educación", subtitle: "La base de conocimiento libre y universal de la Red. Aprende, crea y comparte." },
        '/culture': { icon: <Sparkles className="h-8 w-8 text-primary"/>, title: "Cultura", subtitle: "El espacio para la expresión social, artística y la creación de nuevos mundos." },
        '/publish': { icon: <PenSquare className="h-8 w-8 text-primary"/>, title: "Crear Publicación", subtitle: "Forja tu mensaje en el Lienzo de Creación y difúndelo a través del Nexo." },
        '/library': { icon: <Library className="h-8 w-8 text-primary"/>, title: "Biblioteca del Nexo", subtitle: "Tu ecosistema extensible de apps, archivos, avatares y plantillas." },
        '/library/my-library': { icon: <Folder className="h-8 w-8 text-primary"/>, title: "Mi Biblioteca", subtitle: "Tu ecosistema personal de apps, archivos y creaciones de IA." },
        '/library/templates': { icon: <Store className="h-8 w-8 text-primary"/>, title: "Tienda Virtual", subtitle: "Descubre, instala y comparte activos creados por la comunidad del Nexo." },
        '/info/constitution': { icon: <Info className="h-8 w-8 text-primary"/>, title: "Constitución de la Red StarSeed", subtitle: "Las leyes fundamentales, derechos, límites y principios que guían a nuestra sociedad." },
        '/settings': { icon: <Settings className="h-8 w-8 text-primary"/>, title: "Ajustes", subtitle: "Gestiona tu cuenta, tu perfil y tus preferencias de privacidad." },
        '/avatar-generator': { icon: <Bot className="h-8 w-8 text-primary"/>, title: "Generador de Avatares con IA", subtitle: "Forja una nueva identidad virtual." },
        '/video-generator': { icon: <Clapperboard className="h-8 w-8 text-primary"/>, title: "Generador de Videos con IA", subtitle: "Crea videos cortos a partir de prompts de texto." },
    };

    const currentHeader = headerInfo || pageHeaders[pathname] || null;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl md:px-0 justify-between">
            <div className="flex items-center gap-4">
                {isMobile && <Button variant="ghost" size="icon" onClick={toggleSidebar}><PanelLeft className="h-5 w-5"/></Button>}
                {currentHeader && !isSpecialPage && (
                    <div className="flex items-center gap-3">
                         <div className="hidden sm:block">
                            {currentHeader.icon}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-headline">{currentHeader.title}</h1>
                        </div>
                    </div>
                )}
            </div>
            <div>
                 {/* Right-aligned content, e.g., action buttons, can go here */}
            </div>
        </header>
    );
}

const viewModePages = ['/library/my-library'];

function MainContent({ children }: { children: React.ReactNode }) {
    const { state, isMobile } = useSidebar();
    const { headerInfo } = useHeader();
    const pathname = usePathname();

    const isSpecialPage = viewModePages.includes(pathname) || /^\/(collection|community|politics\/proposal|event|party|study-group|federated-entity|chat-group)\//.test(pathname);
    const pageInfo = pageHeaders[pathname];

    return (
        <div className={cn(
            "flex flex-col flex-1 transition-[margin-left] duration-300 ease-in-out h-screen",
            !isMobile && (state === 'expanded' ? "ml-[18rem]" : "ml-[4.5rem]")
        )}>
           
            <main className="flex-1 overflow-y-auto">
                 <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 h-full flex flex-col">
                     <AppHeader />
                      <div className="py-8 flex-1">
                        {pageInfo && !isSpecialPage && (
                            <div className="mb-6 md:hidden">
                                <div className="flex items-center gap-3">
                                    {pageInfo.icon}
                                    <h1 className="text-3xl font-bold font-headline">{pageInfo.title}</h1>
                                </div>
                                <p className="text-lg text-muted-foreground mt-2">{pageInfo.subtitle}</p>
                            </div>
                        )}
                        {headerInfo && (
                            <div className="mb-6">
                                <div className="flex items-center gap-3">
                                    {headerInfo.icon}
                                    <h1 className="text-3xl font-bold font-headline">{headerInfo.title}</h1>
                                </div>
                                <p className="text-lg text-muted-foreground mt-2">{headerInfo.subtitle}</p>
                            </div>
                        )}
                        {children}
                      </div>
                 </div>
            </main>
        </div>
    );
}

const pageHeaders: { [key: string]: { icon: React.ReactNode, title: string, subtitle: string } } = {
    '/': { icon: <LayoutDashboard className="h-8 w-8 text-primary"/>, title: "Dashboard", subtitle: "Tu centro de mando personalizado y proactivo." },
    '/dashboard': { icon: <LayoutDashboard className="h-8 w-8 text-primary"/>, title: "Dashboard", subtitle: "Tu centro de mando personalizado y proactivo." },
    '/profile': { icon: <User className="h-8 w-8 text-primary"/>, title: "Perfil", subtitle: "Tu identidad digital y escaparate personal." },
    '/messages': { icon: <MessageSquare className="h-8 w-8 text-primary"/>, title: "Mensajes", subtitle: "Conversaciones directas y seguras." },
    '/notifications': { icon: <Bell className="h-8 w-8 text-primary"/>, title: "Notificaciones", subtitle: "Toda tu actividad reciente en la red, en un solo lugar." },
    '/participations': { icon: <Users className="h-8 w-8 text-primary"/>, title: "Hub de Conexiones", subtitle: "Tu centro para descubrir, crear y gestionar todas tus interacciones en la Red." },
    '/agent': { icon: <BrainCircuit className="h-8 w-8 text-primary"/>, title: "Agente de IA", subtitle: "Tu compañero de IA proactivo para la co-creación, automatización y exploración." },
    '/politics': { icon: <Gavel className="h-8 w-8 text-primary"/>, title: "Red de Política", subtitle: "El parlamento digital de la red. Aquí se proponen, debaten y gestionan las decisiones que nos afectan a todos." },
    '/education': { icon: <GraduationCap className="h-8 w-8 text-primary"/>, title: "Educación", subtitle: "La base de conocimiento libre y universal de la Red. Aprende, crea y comparte." },
    '/culture': { icon: <Sparkles className="h-8 w-8 text-primary"/>, title: "Cultura", subtitle: "El espacio para la expresión social, artística y la creación de nuevos mundos." },
    '/publish': { icon: <PenSquare className="h-8 w-8 text-primary"/>, title: "El Lienzo de Creación", subtitle: "Forja tu mensaje y difúndelo a través del Nexo." },
    '/library': { icon: <Library className="h-8 w-8 text-primary"/>, title: "Biblioteca del Nexo", subtitle: "Tu ecosistema extensible de apps, archivos, avatares y plantillas." },
    '/library/my-library': { icon: <Folder className="h-8 w-8 text-primary"/>, title: "Mi Biblioteca", subtitle: "Tu ecosistema personal de apps, archivos y creaciones de IA." },
    '/library/templates': { icon: <Store className="h-8 w-8 text-primary"/>, title: "Tienda Virtual", subtitle: "Descubre, instala y comparte activos creados por la comunidad del Nexo." },
    '/info/constitution': { icon: <Info className="h-8 w-8 text-primary"/>, title: "Constitución de la Red StarSeed", subtitle: "Las leyes fundamentales, derechos, límites y principios que guían a nuestra sociedad." },
    '/settings': { icon: <Settings className="h-8 w-8 text-primary"/>, title: "Ajustes", subtitle: "Gestiona tu cuenta, tu perfil y tus preferencias de privacidad." },
    '/avatar-generator': { icon: <Bot className="h-8 w-8 text-primary"/>, title: "Generador de Avatares con IA", subtitle: "Forja una nueva identidad virtual." },
    '/video-generator': { icon: <Clapperboard className="h-8 w-8 text-primary"/>, title: "Generador de Videos con IA", subtitle: "Crea videos cortos a partir de prompts de texto." },
};

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
      <HeaderProvider>
        <div className="relative flex h-screen overflow-hidden">
          <AppSidebar />
          <MainContent>{children}</MainContent>
        </div>
      </HeaderProvider>
    </SidebarProvider>
  );
}
