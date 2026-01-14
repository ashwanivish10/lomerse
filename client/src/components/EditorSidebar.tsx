import React from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Check, Eye, Palette, Layout, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import InvoicePreview from "@/components/InvoicePreview";

// --- Template Data ---
interface Template {
    id: string;
    name: string;
    isPremium: boolean;
    color: string;
}

const TEMPLATES: Template[] = [
    { id: "modern", name: "Modern", isPremium: false, color: "from-indigo-500 to-purple-600" },
    { id: "classic", name: "Classic", isPremium: false, color: "from-blue-500 to-blue-700" },
    { id: "professional", name: "Professional", isPremium: false, color: "from-blue-600 to-indigo-700" },
    { id: "executive", name: "Executive", isPremium: true, color: "from-slate-700 to-slate-900" },
    { id: "creative", name: "Creative", isPremium: true, color: "from-pink-500 to-rose-600" },
    { id: "minimal", name: "Minimal", isPremium: false, color: "from-gray-700 to-gray-900" },
];

// --- Theme Data ---
interface Theme {
    key: string;
    name: string;
    primary: string;
    accent: string;
    secondary: string;
}

const THEMES: Theme[] = [
    { key: "oceanBlue", name: "Ocean Blue", primary: "#1E293B", accent: "#3B82F6", secondary: "#64748B" },
    { key: "sunsetRed", name: "Sunset Red", primary: "#1E293B", accent: "#EF4444", secondary: "#64748B" },
    { key: "forestGreen", name: "Forest Green", primary: "#1E293B", accent: "#22C55E", secondary: "#64748B" },
    { key: "royalPurple", name: "Royal Purple", primary: "#312E81", accent: "#8B5CF6", secondary: "#6B7280" },
    { key: "slateGray", name: "Slate Gray", primary: "#0F172A", accent: "#94A3B8", secondary: "#475569" },
    { key: "warmOrange", name: "Warm Orange", primary: "#1E293B", accent: "#F97316", secondary: "#64748B" },
    { key: "teal", name: "Teal", primary: "#1E293B", accent: "#14B8A6", secondary: "#64748B" },
    { key: "indigo", name: "Indigo", primary: "#312E81", accent: "#6366F1", secondary: "#6B7280" },
];

interface EditorSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function EditorSidebar({ isOpen, onToggle }: EditorSidebarProps) {
    const { template, setTemplate, theme, setTheme } = useInvoice();
    const [previewTemplate, setPreviewTemplate] = React.useState<string | null>(null);

    const handleTemplateSelect = (templateId: string) => {
        setTemplate(templateId);
    };

    const handleThemeSelect = (selectedTheme: Theme) => {
        setTheme({
            name: selectedTheme.name,
            primary: selectedTheme.primary,
            accent: selectedTheme.accent,
            secondary: selectedTheme.secondary,
        });
    };

    const currentThemeKey = THEMES.find(t => t.accent === theme.accent)?.key || "oceanBlue";

    return (
        <>
            {/* Toggle Button (when sidebar is closed) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-800 shadow-lg rounded-l-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-r-0 border-slate-200 dark:border-slate-700"
                >
                    <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full bg-white dark:bg-slate-800 shadow-2xl border-l border-slate-200 dark:border-slate-700 z-50 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                style={{ width: "320px" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                            <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="font-semibold text-foreground">Customize</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onToggle} className="rounded-full">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                <ScrollArea className="h-[calc(100%-65px)]">
                    <div className="p-4 space-y-6">
                        {/* Templates Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Layout className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold text-sm text-foreground">Templates</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {TEMPLATES.map((t) => {
                                    const isSelected = template === t.id;
                                    return (
                                        <div key={t.id} className="relative group">
                                            <button
                                                onClick={() => handleTemplateSelect(t.id)}
                                                className={`w-full rounded-xl overflow-hidden transition-all duration-200 ${isSelected
                                                        ? "ring-2 ring-indigo-500 ring-offset-2 shadow-md"
                                                        : "border border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                                                    }`}
                                            >
                                                {/* Template Preview */}
                                                <div className={`h-16 bg-gradient-to-br ${t.color} relative`}>
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                                <Check className="h-3 w-3 text-indigo-600" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t.isPremium && (
                                                        <Badge className="absolute top-1 right-1 text-[10px] px-1.5 py-0 bg-amber-400 text-amber-900 border-0">
                                                            PRO
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="p-2 bg-white dark:bg-slate-800 text-center">
                                                    <p className={`text-xs font-medium ${isSelected ? "text-indigo-600" : "text-foreground"}`}>
                                                        {t.name}
                                                    </p>
                                                </div>
                                            </button>

                                            {/* Preview Button */}
                                            <button
                                                onClick={() => setPreviewTemplate(t.id)}
                                                className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 rounded-md p-1"
                                            >
                                                <Eye className="h-3 w-3 text-slate-600" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Themes Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Palette className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold text-sm text-foreground">Colors</h3>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {THEMES.map((t) => {
                                    const isSelected = currentThemeKey === t.key;
                                    return (
                                        <button
                                            key={t.key}
                                            onClick={() => handleThemeSelect(t)}
                                            className="group flex flex-col items-center gap-1"
                                            title={t.name}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full shadow-md transition-all duration-200 flex items-center justify-center ${isSelected ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
                                                    }`}
                                                style={{ backgroundColor: t.accent }}
                                            >
                                                {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
                                            </div>
                                            <span className={`text-[10px] ${isSelected ? "text-indigo-600 font-medium" : "text-muted-foreground"}`}>
                                                {t.name.split(" ")[0]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Selection Summary */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-muted-foreground mb-2">Current Selection</p>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-6 h-6 rounded-full shadow-sm"
                                    style={{ backgroundColor: theme.accent }}
                                />
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {TEMPLATES.find(t => t.id === template)?.name || "Modern"} Template
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {THEMES.find(t => t.key === currentThemeKey)?.name || "Ocean Blue"} Theme
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Preview Modal */}
            <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0">
                    <DialogHeader className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-indigo-600" />
                            {TEMPLATES.find(t => t.id === previewTemplate)?.name} Template Preview
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto max-h-[calc(85vh-80px)] bg-slate-100 dark:bg-slate-900 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
                            {previewTemplate && <InvoicePreview templateId={previewTemplate} />}
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => {
                                if (previewTemplate) {
                                    handleTemplateSelect(previewTemplate);
                                    setPreviewTemplate(null);
                                }
                            }}
                        >
                            Use Template
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Backdrop when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}
        </>
    );
}
