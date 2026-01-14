// src/components/AppLayout.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  Crown,
  CreditCard,
  Settings,
  BarChart3,
  HelpCircle,
  LogOut,
  FileText,
  User,
  Menu,
} from "lucide-react";

// Import components
import Dock from "@/components/Dock";
import type { DockItemData } from "@/components/Dock";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import fileIcon from "@/attached_assets/file.png"; // Mobile menu logo

// --- Navigation Items (Define them once here) ---
const mainMenuItems = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
  { href: "/create-invoice", label: "Create Invoice", icon: <FileText className="size-5" /> },
  { href: "/clients", label: "Clients", icon: <Users className="size-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="size-5" /> },
  { href: "/reports", label: "Reports", icon: <BarChart3 className="size-5" /> },
];
const footerMenuItems = [
  { href: "/settings", label: "Settings", icon: <Settings className="size-5" /> },
  { href: "/help", label: "Help", icon: <HelpCircle className="size-5" /> },
];

// --- Layout Component ---
interface AppLayoutProps {
  children: React.ReactNode;
  pageHeader: React.ReactNode; // Prop to pass in the page-specific header
}

export default function AppLayout({ children, pageHeader }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Auth & Loading Logic ---
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You have been logged out. Please sign in.",
        variant: "destructive",
      });
      setLocation("/signin");
    }
  }, [user, isLoading, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null; // Wait for redirect

  // --- Menu Item Logic ---
  const isSubscribed = user.subscriptionStatus === 'active';

  const proItem = isSubscribed ? {
    href: "/subscription", label: "Subscription", icon: <CreditCard className="size-5" />,
    onClick: () => setLocation("/subscription"),
  } : {
    href: "/subscription", label: "Upgrade to Pro", icon: <Crown className="size-5 text-yellow-500" />,
    onClick: () => setLocation("/subscription"),
  };

  const logoutItem = {
    href: "/auth/logout", label: "Sign Out", icon: <LogOut className="size-5 text-red-500" />,
    onClick: () => { window.location.href = "/auth/logout"; },
  };

  const getDockItems = (): DockItemData[] => [
    ...mainMenuItems.map(item => ({ ...item, onClick: () => setLocation(item.href) })),
    ...footerMenuItems.map(item => ({ ...item, onClick: () => setLocation(item.href) })),
    proItem,
    logoutItem,
  ];

  const dockItems = getDockItems();

  const renderMenuItems = (items: typeof mainMenuItems) => {
    return items.map((item) => (
      <SheetClose asChild key={item.href}>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-base"
          onClick={() => setLocation(item.href)}
        >
          {item.icon}
          {item.label}
        </Button>
      </SheetClose>
    ));
  };

  // --- Render Layout ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f12] text-foreground transition-colors">

      {/* 1. Desktop-only Dock */}
      <div className="hidden md:block">
        <Dock items={dockItems} />
      </div>

      {/* 2. Responsive Main Content Area */}
      <div className="md:pl-24">
        {/* 3. Responsive Header */}
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          {/* Page-specific header content (e.g., Breadcrumb or Title) */}
          <div className="flex-1">
            {pageHeader}
          </div>

          {/* Mobile-only Menu (Sheet) */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-4 w-[280px]">
                {/* Mobile Menu Header */}
                <div className="flex items-center gap-3 p-2 mb-4">
                  <img src={fileIcon} alt="Lomerse Logo" className="w-10 h-10 rounded-lg" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Lomerse
                  </h2>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 flex flex-col gap-1">
                  {renderMenuItems(mainMenuItems)}
                </nav>

                {/* Footer Links */}
                <div className="mt-auto">
                  <Separator className="my-2" />
                  {renderMenuItems(footerMenuItems)}

                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-base"
                      onClick={proItem.onClick}
                    >
                      {proItem.icon}
                      {proItem.label}
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-base text-red-500 hover:text-red-500"
                      onClick={logoutItem.onClick}
                    >
                      {logoutItem.icon}
                      {logoutItem.label}
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* 4. Page Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}