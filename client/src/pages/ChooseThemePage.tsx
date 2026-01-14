import React from "react";
import { useLocation } from "wouter";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Check, Palette, ArrowRight, Sparkles, Moon, Briefcase, Star } from "lucide-react";
import { motion } from "framer-motion";
import InvoicePreview from "@/components/InvoicePreview";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Theme Interface ---
interface Theme {
  name: string;
  primary: string;
  accent: string;
  secondary: string;
}

interface ThemeCategory {
  name: string;
  icon: React.ReactNode;
  keys: string[];
  description: string;
}

// --- Theme Data ---
const THEMES: Record<string, Theme> = {
  oceanBlue: {
    name: "Ocean Blue",
    primary: "#1E293B",
    accent: "#3B82F6",
    secondary: "#64748B",
  },
  sunsetRed: {
    name: "Sunset Red",
    primary: "#1E293B",
    accent: "#EF4444",
    secondary: "#64748B",
  },
  forestGreen: {
    name: "Forest Green",
    primary: "#1E293B",
    accent: "#22C55E",
    secondary: "#64748B",
  },
  royalPurple: {
    name: "Royal Purple",
    primary: "#312E81",
    accent: "#8B5CF6",
    secondary: "#6B7280",
  },
  slateGray: {
    name: "Slate Gray",
    primary: "#0F172A",
    accent: "#94A3B8",
    secondary: "#475569",
  },
  warmOrange: {
    name: "Warm Orange",
    primary: "#1E293B",
    accent: "#F97316",
    secondary: "#64748B",
  },
  teal: {
    name: "Teal",
    primary: "#1E293B",
    accent: "#14B8A6",
    secondary: "#64748B",
  },
  indigo: {
    name: "Indigo",
    primary: "#312E81",
    accent: "#6366F1",
    secondary: "#6B7280",
  },
};

const THEME_CATEGORIES: ThemeCategory[] = [
  {
    name: "Popular",
    icon: <Sparkles className="h-4 w-4" />,
    keys: ["oceanBlue", "forestGreen", "sunsetRed"],
    description: "Most loved by our users",
  },
  {
    name: "Dark Mode",
    icon: <Moon className="h-4 w-4" />,
    keys: ["slateGray", "indigo"],
    description: "Elegant dark themes",
  },
  {
    name: "Professional",
    icon: <Briefcase className="h-4 w-4" />,
    keys: ["teal", "royalPurple"],
    description: "Perfect for business",
  },
  {
    name: "Creative",
    icon: <Star className="h-4 w-4" />,
    keys: ["warmOrange"],
    description: "Stand out with bold colors",
  },
];

// -----------------------------------------------
// Theme Card Component
// -----------------------------------------------
function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative group rounded-xl overflow-hidden transition-all duration-200 ${isSelected
        ? "ring-2 ring-indigo-500 ring-offset-2 shadow-md"
        : "border border-slate-200 dark:border-slate-700 hover:border-indigo-300"
        }`}
    >
      {/* Color Preview */}
      <div className="h-20 relative">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full" style={{ backgroundColor: theme.accent }} />
          <div className="w-1/4 h-full" style={{ backgroundColor: theme.primary }} />
          <div className="w-1/4 h-full" style={{ backgroundColor: theme.secondary }} />
        </div>

        {/* Selected Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <Check className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
        )}
      </div>

      {/* Theme Name */}
      <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <p className={`font-medium text-sm ${isSelected ? "text-indigo-600" : "text-foreground"}`}>
          {theme.name}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-slate-200" style={{ backgroundColor: theme.primary }} />
          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-slate-200" style={{ backgroundColor: theme.accent }} />
          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-slate-200" style={{ backgroundColor: theme.secondary }} />
        </div>
      </div>
    </button>
  );
}

// -----------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------
function ChooseThemePage(): JSX.Element {
  const { theme: currentTheme, setTheme, template } = useInvoice();
  const [, navigate] = useLocation();

  const handleSelect = (theme: Theme) => setTheme(theme);

  // Page header for AppLayout
  const pageHeader = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
        Choose Your Theme
      </h1>
      <p className="text-muted-foreground">
        Select a color scheme that matches your brand identity.
      </p>
    </div>
  );

  return (
    <AppLayout pageHeader={pageHeader}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left - Theme Selection */}
        <div className="xl:col-span-2 space-y-8">

          {/* Current Selection Banner */}
          {currentTheme && (
            <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg shadow-md"
                      style={{ backgroundColor: currentTheme.accent }}
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Theme</p>
                      <p className="font-semibold text-foreground">{currentTheme.name}</p>
                    </div>
                  </div>
                  <Badge className="bg-indigo-600 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Theme Categories */}
          {THEME_CATEGORIES.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.keys.map((key) => (
                  <ThemeCard
                    key={key}
                    theme={THEMES[key]}
                    isSelected={currentTheme?.name === THEMES[key].name}
                    onSelect={() => handleSelect(THEMES[key])}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right - Live Preview */}
        <div className="xl:sticky xl:top-24 space-y-4">
          <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Live Preview</h3>
                  <p className="text-xs text-muted-foreground">
                    {template ? `${template} template` : "Default template"}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-4 bg-slate-50 dark:bg-slate-900/30">
              <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <div style={{ transform: "scale(0.55)", transformOrigin: "top left", width: "181.8%" }}>
                  <InvoicePreview />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            onClick={() => navigate("/create-invoice")}
            disabled={!currentTheme}
            size="lg"
            className={`w-full ${currentTheme
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
          >
            {currentTheme ? (
              <>
                Continue with {currentTheme.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Select a theme to continue"
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

export default ChooseThemePage;
