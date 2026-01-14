import React, { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useInvoice } from "../contexts/InvoiceContext";
import { useAuth } from "@/hooks/useAuth";
import InvoicePreview from "../components/InvoicePreview";
import {
  Lock,
  Eye,
  Search,
  X,
  Star,
  Zap,
  Sparkles,
  Grid3X3,
  LayoutGrid,
  ArrowRight,
  Crown,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";

interface Template {
  id: string;
  name: string;
  description: string;
  category: "Business" | "Creative" | "Minimal" | "Formal";
  imageUrl: string;
  isPremium: boolean;
  popularity: number;
  color: string;
}

const allTemplates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "A sleek, contemporary design with a bold accent color.",
    category: "Creative",
    imageUrl: "https://placehold.co/600x800/6366F1/white?text=Modern",
    isPremium: false,
    popularity: 90,
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "classic",
    name: "Classic",
    description: "A timeless, professional look perfect for any business.",
    category: "Business",
    imageUrl: "https://placehold.co/600x800/1d4ed8/white?text=Classic",
    isPremium: false,
    popularity: 85,
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Clean business styling with accent bars and modern layout.",
    category: "Business",
    imageUrl: "https://placehold.co/600x800/1E40AF/white?text=Professional",
    isPremium: false,
    popularity: 88,
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Elegant corporate design with dark header and serif fonts.",
    category: "Formal",
    imageUrl: "https://placehold.co/600x800/0F172A/white?text=Executive",
    isPremium: true,
    popularity: 82,
    color: "from-slate-700 to-slate-900",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Playful design with gradients and glassmorphism cards.",
    category: "Creative",
    imageUrl: "https://placehold.co/600x800/EC4899/white?text=Creative",
    isPremium: true,
    popularity: 95,
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Simple, clean, and focuses purely on the information.",
    category: "Minimal",
    imageUrl: "https://placehold.co/600x800/111827/white?text=Minimal",
    isPremium: false,
    popularity: 75,
    color: "from-gray-700 to-gray-900",
  },
];

const categories = ["all", "Business", "Creative", "Minimal", "Formal"];

function ChooseTemplatePage(): JSX.Element {
  const { setTemplate } = useInvoice();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const isSubscribed = user?.subscriptionStatus === "active";
  const hasCredits = (user?.invoiceCredits || 0) > 0;

  const filteredTemplates = useMemo(() => {
    let templates = [...allTemplates];
    if (category !== "all") {
      templates = templates.filter((t) => t.category === category);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(lowerSearch) ||
          t.description.toLowerCase().includes(lowerSearch)
      );
    }
    templates.sort((a, b) => b.popularity - a.popularity);
    return templates;
  }, [searchTerm, category]);

  const handleSelect = (templateId: string) => {
    setTemplate(templateId);
    navigate("/choose-theme");
  };

  const openPreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  // Page header for AppLayout
  const pageHeader = (
    <div className="text-center max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Choose Your Template
      </h1>
      <p className="text-muted-foreground">
        Select from our collection of {allTemplates.length} professionally designed invoice templates.
      </p>
    </div>
  );

  return (
    <AppLayout pageHeader={pageHeader}>
      <div className="space-y-8">
        {/* Search and Filter Bar */}
        <Card className="mb-8 shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={`rounded-full transition-all ${category === cat
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                      }`}
                  >
                    {cat === "all" ? (
                      <>
                        <LayoutGrid className="h-4 w-4 mr-1" />
                        All
                      </>
                    ) : (
                      cat
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Status Banner */}
        {!isSubscribed && !hasCredits && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <Crown className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">
                    Unlock Premium Templates
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Get access to all templates with a subscription or pay per invoice.
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                onClick={() => navigate("/subscription")}
              >
                View Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Credits Banner */}
        {hasCredits && !isSubscribed && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-emerald-900 dark:text-emerald-100">
                  You have {user?.invoiceCredits} invoice credit{user?.invoiceCredits !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Use them to download premium template invoices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isLocked = template.isPremium && !isSubscribed && !hasCredits;
            const isPopular = template.popularity > 85;

            return (
              <Card
                key={template.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800"
              >
                {/* Template Preview */}
                <div className={`relative h-48 bg-gradient-to-br ${template.color}`}>
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white drop-shadow-lg">
                      {template.name}
                    </span>
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => openPreview(template)}
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700 backdrop-blur-sm">
                      {template.category}
                    </Badge>
                    {isPopular && (
                      <Badge className="bg-amber-400 text-amber-900 border-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    )}
                  </div>

                  {/* Pro Badge */}
                  {template.isPremium && (
                    <div className="absolute top-3 right-3">
                      <Badge className={`border-0 ${isLocked ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white" : "bg-emerald-500 text-white"}`}>
                        {isLocked ? (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            PRO
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Unlocked
                          </>
                        )}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {template.description}
                  </p>

                  {isLocked ? (
                    <Button
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0"
                      onClick={() => navigate("/subscription")}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade to Use
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => handleSelect(template.id)}
                    >
                      Use Template
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Templates Found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter.
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setCategory("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closePreview}
          />

          <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${previewTemplate.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">
                    {previewTemplate.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {previewTemplate.name} Template
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {previewTemplate.category}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closePreview}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Preview Content */}
            <div className="max-h-[65vh] overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
                <InvoicePreview templateId={previewTemplate.id} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <Button variant="outline" onClick={closePreview}>
                Cancel
              </Button>

              {isSubscribed || hasCredits || !previewTemplate.isPremium ? (
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => handleSelect(previewTemplate.id)}
                >
                  Use {previewTemplate.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0"
                  onClick={() => navigate("/subscription")}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Upgrade to Use
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default ChooseTemplatePage;
