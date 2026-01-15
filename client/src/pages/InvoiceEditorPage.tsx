import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { useInvoice } from "@/contexts/InvoiceContext";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
    Download,
    Loader2,
    FileText,
    Check,
    LayoutDashboard,
    Users,
    Crown,
    CreditCard,
    Settings,
    HelpCircle,
    LogOut,
    UserIcon,
    Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Dock from "@/components/Dock";
import type { DockItemData } from "@/components/Dock";
import type { InvoiceData } from "@/components/invoice-templates/types";

// Import ALL template components
import TemplateModern from "@/components/invoice-templates/TemplateModern";
import TemplateClassic from "@/components/invoice-templates/TemplateClassic";
import TemplateMinimal from "@/components/invoice-templates/TemplateMinimal";
import TemplateProfessional from "@/components/invoice-templates/TemplateProfessional";
import TemplateExecutive from "@/components/invoice-templates/TemplateExecutive";
import TemplateCreative from "@/components/invoice-templates/TemplateCreative";

const TEMPLATES = [
    { id: "modern", name: "Modern", premium: false },
    { id: "classic", name: "Classic", premium: false },
    { id: "professional", name: "Professional", premium: false },
    { id: "minimal", name: "Minimal", premium: false },
    { id: "executive", name: "Executive", premium: true },
    { id: "creative", name: "Creative", premium: true },
];

const THEMES = [
    { key: "oceanBlue", accent: "#3B82F6", name: "Ocean Blue" },
    { key: "slateGray", accent: "#64748B", name: "Slate Gray" },
    { key: "forestGreen", accent: "#22C55E", name: "Forest Green" },
    { key: "warmOrange", accent: "#F97316", name: "Warm Orange" },
    { key: "sunsetRed", accent: "#EF4444", name: "Sunset Red" },
    { key: "royalPurple", accent: "#8B5CF6", name: "Royal Purple" },
];

export default function InvoiceEditorPage() {
    const { invoiceData, setInvoiceData, template, setTemplate, theme, setTheme } = useInvoice();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [, navigate] = useLocation();
    const { user } = useAuth();

    // Mobile tab state: "preview" or "settings"
    const [mobileTab, setMobileTab] = useState<"preview" | "settings">("preview");

    // Calculate totals
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const tax = subtotal * invoiceData.taxRate;
    const total = subtotal + tax;

    const [templateData, setTemplateData] = useState<InvoiceData>({
        from: { name: "Your Company", address: "123 Business Street, City 12345", email: "contact@company.com" },
        to: { name: invoiceData.customer.name || "Client Name", address: `${invoiceData.customer.address || ""}, ${invoiceData.customer.city || ""}` },
        invoiceNumber: invoiceData.invoice_nr,
        invoiceDate: invoiceData.date,
        dueDate: invoiceData.date,
        items: invoiceData.items.map((item) => ({
            description: item.description || item.item || "Item",
            quantity: item.quantity,
            price: item.unit_price
        })),
        subtotal,
        taxRate: invoiceData.taxRate,
        tax,
        total,
        notes: "Thank you for your business.",
    });

    const handleTemplateDataChange = (newData: InvoiceData) => {
        setTemplateData(newData);
        setInvoiceData((prev) => ({
            ...prev,
            invoice_nr: newData.invoiceNumber,
            date: newData.invoiceDate,
            taxRate: newData.taxRate,
            customer: {
                name: newData.to.name,
                address: newData.to.address.split(',')[0] || "",
                city: newData.to.address.split(',').slice(1).join(',').trim() || "",
            },
            items: newData.items.map((item) => ({
                item: item.description,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.price,
            })),
        }));
    };

    const isSubscribed = user?.subscriptionStatus === "active";
    const dockItems: DockItemData[] = [
        { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" />, onClick: () => navigate("/") },
        { href: "/create-invoice", label: "New Invoice", icon: <FileText className="size-5" />, onClick: () => navigate("/create-invoice") },
        { href: "/clients", label: "Clients", icon: <Users className="size-5" />, onClick: () => navigate("/clients") },
        { href: "/profile", label: "Profile", icon: <UserIcon className="size-5" />, onClick: () => navigate("/profile") },
        { href: "/settings", label: "Settings", icon: <Settings className="size-5" />, onClick: () => navigate("/settings") },
        { href: "/help", label: "Help", icon: <HelpCircle className="size-5" />, onClick: () => navigate("/help") },
        isSubscribed
            ? { href: "/subscription", label: "Subscription", icon: <CreditCard className="size-5" />, onClick: () => navigate("/subscription") }
            : { href: "/subscription", label: "Upgrade", icon: <Crown className="size-5 text-yellow-500" />, onClick: () => navigate("/subscription") },
        { href: "/auth/logout", label: "Sign Out", icon: <LogOut className="size-5 text-red-500" />, onClick: () => { window.location.href = "/auth/logout"; } },
    ];

    const handleThemeSelect = (t: typeof THEMES[0]) => {
        setTheme({ name: t.name, primary: "#1E293B", accent: t.accent, secondary: "#64748B" });
    };

    const themeClasses = {
        accentColor: theme.accent,
        primary: theme.primary,
        secondary: theme.secondary,
        borderAccent: theme.accent,
        bgAccent: theme.accent + "20",
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Prepare invoice data for the backend
            const invoicePayload = {
                userId: user?.id || "",
                invoiceNumber: String(templateData.invoiceNumber),
                theme: template,
                companyName: templateData.from.name,
                companyTagline: "",
                logoUrl: "",
                clientName: templateData.to.name,
                invoiceDate: templateData.invoiceDate,
                items: templateData.items.map((item) => ({
                    description: item.description,
                    quantity: item.quantity,
                    rate: item.price,
                    amount: item.quantity * item.price,
                })),
                totalAmount: templateData.total,
                amountPaid: 0,
                tax: `${(templateData.taxRate * 100).toFixed(0)}%`,
                address: templateData.from.address,
                phone: "",
            };

            await axios.post("/api/invoices", invoicePayload);

            // Invalidate queries to refresh the dashboard
            await queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
            await queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });

            toast({
                title: "Invoice Saved!",
                description: "Your invoice has been saved and will appear in your dashboard."
            });

            // Optionally navigate to dashboard after save
            // navigate("/");
        } catch (err: any) {
            console.error("Save error:", err);
            if (err.response?.status === 403) {
                toast({
                    title: "Upgrade Required",
                    description: "You need a subscription or credits to save invoices.",
                    variant: "destructive"
                });
                navigate("/subscription");
            } else if (err.response?.status === 401) {
                toast({ title: "Please sign in", variant: "destructive" });
                navigate("/signin");
            } else {
                toast({
                    title: "Save Failed",
                    description: err.response?.data?.message || "Could not save invoice.",
                    variant: "destructive"
                });
            }
        }
        setIsSaving(false);
    };

    const handleDownload = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/invoice/generate", {
                templateName: template,
                theme,
                data: templateData
            }, { responseType: "blob" });

            const blob = new Blob([response.data], { type: "application/pdf" });
            saveAs(blob, `invoice-${templateData.invoiceNumber}.pdf`);
            await queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
            toast({ title: "Downloaded!", description: `Invoice PDF saved.` });
        } catch (err: any) {
            toast({ title: err.response?.status === 403 ? "Upgrade Required" : "Download Failed", variant: "destructive" });
            if (err.response?.status === 403) navigate("/subscription");
        }
        setIsLoading(false);
    };

    // Render the correct template based on selection - ALL are editable
    const renderTemplate = () => {
        const props = {
            data: templateData,
            logoUrl: null,
            themeClasses,
            editable: true,
            onDataChange: handleTemplateDataChange
        };

        switch (template) {
            case "classic":
                return <TemplateClassic {...props} />;
            case "minimal":
                return <TemplateMinimal {...props} />;
            case "professional":
                return <TemplateProfessional {...props} />;
            case "executive":
                return <TemplateExecutive {...props} />;
            case "creative":
                return <TemplateCreative {...props} />;
            case "modern":
            default:
                return <TemplateModern {...props} />;
        }
    };

    const currentThemeKey = THEMES.find(t => t.accent === theme.accent)?.key || "oceanBlue";

    // Settings Panel Component (reused for desktop sidebar and mobile view)
    const SettingsPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`${isMobile ? "p-4 pb-32" : "p-6"} space-y-6`}>
            <h2 className="text-lg font-semibold">Customize Invoice</h2>

            {/* Themes */}
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Theme</p>
                <div className="flex gap-2 flex-wrap">
                    {THEMES.map((t) => (
                        <button key={t.key} onClick={() => handleThemeSelect(t)}
                            className={`w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${currentThemeKey === t.key ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                            style={{ backgroundColor: t.accent }} title={t.name}>
                            {currentThemeKey === t.key && <Check className="w-4 h-4 text-white" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates */}
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Template</p>
                <div className="grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-3">
                    {TEMPLATES.map((t) => (
                        <button key={t.id} onClick={() => setTemplate(t.id)}
                            className={`relative p-2 border-2 rounded-lg transition-all ${template === t.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                            {/* Premium Badge */}
                            {t.premium && (
                                <div className="absolute top-1 left-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                                    <Crown className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                                </div>
                            )}
                            <div className="h-8 md:h-12 bg-gray-100 dark:bg-gray-700 rounded mb-1 md:mb-2 flex items-center justify-center">
                                <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <p className="text-[10px] md:text-xs font-medium capitalize">{t.name}</p>
                                {t.premium && <span className="text-[8px] md:text-[10px] text-amber-600 font-bold">PRO</span>}
                            </div>
                            {template === t.id && <div className="absolute top-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-indigo-500 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" /></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons - Only show on desktop */}
            {!isMobile && (
                <div className="space-y-3 pt-4">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        {isSaving ? "Saving..." : "Save Invoice"}
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white" onClick={handleDownload} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        Download PDF
                    </Button>
                </div>
            )}

            <p className="text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                💡 Click different templates to see their unique designs. Each template has its own layout and style!
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
            {/* Desktop Dock - Hidden on mobile */}
            <div className="hidden md:block"><Dock items={dockItems} /></div>

            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-20 bg-white dark:bg-slate-800 border-b shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </button>
                    <span className="text-sm font-semibold capitalize">{template} Invoice</span>
                    <div className="w-20" /> {/* Spacer for centering */}
                </div>

                {/* Mobile Tab Navigation */}
                <div className="flex border-t dark:border-slate-700">
                    <button
                        onClick={() => setMobileTab("preview")}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mobileTab === "preview"
                                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Preview
                    </button>
                    <button
                        onClick={() => setMobileTab("settings")}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mobileTab === "settings"
                                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </div>
            </div>

            <div className="md:pl-20 flex flex-col lg:flex-row">
                {/* LEFT - Template Preview */}
                <div className={`flex-1 p-3 md:p-6 overflow-auto ${mobileTab === "settings" ? "hidden lg:block" : ""}`} style={{ maxHeight: "100vh" }}>
                    <div className="max-w-4xl mx-auto pb-24 lg:pb-0">
                        {/* Header - Hidden on mobile (info shown in mobile header instead) */}
                        <div className="hidden md:flex bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl px-6 py-4 items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <FileText className="h-5 w-5" />
                                <span className="font-semibold capitalize">{template} Template</span>
                                <span className="text-white/70 text-sm">• Click fields to edit</span>
                            </div>
                            <span className="text-sm text-white/80 bg-white/20 px-3 py-1 rounded-full">{theme?.name}</span>
                        </div>

                        {/* Mobile Header for Preview */}
                        <div className="md:hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-white text-sm font-medium">Tap fields to edit</span>
                            <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">{theme?.name}</span>
                        </div>

                        {/* TEMPLATE - Shows different design based on selection */}
                        <div className="bg-white shadow-2xl rounded-b-xl overflow-hidden overflow-x-auto">
                            <div className="min-w-[320px]">
                                {renderTemplate()}
                            </div>
                        </div>

                        <p className="text-center text-xs md:text-sm text-gray-500 mt-4">
                            {template === "modern"
                                ? "💡 Click any field above to edit it directly"
                                : "👆 Select Modern template for inline editing"}
                        </p>
                    </div>
                </div>

                {/* Mobile Settings View */}
                <div className={`lg:hidden bg-white dark:bg-slate-800 ${mobileTab === "preview" ? "hidden" : ""}`}>
                    <SettingsPanel isMobile={true} />
                </div>

                {/* RIGHT - Desktop Sidebar */}
                <div className="w-80 bg-white dark:bg-slate-800 border-l sticky top-0 h-screen overflow-auto hidden lg:block">
                    <SettingsPanel isMobile={false} />
                </div>
            </div>

            {/* Mobile Floating Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t shadow-lg p-3 flex gap-3 z-30">
                <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-sm"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-12 text-sm"
                    onClick={handleDownload}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    Download
                </Button>
            </div>
        </div>
    );
}
