import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Settings,
    User,
    Bell,
    Palette,
    Sparkles,
    CreditCard,
    Moon,
    Sun,
    Mail,
    Building2,
    Save,
    Check,
    ChevronRight,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AppLayout from "@/components/AppLayout";
import { useAppSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

// Horizontal tab items
const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "ai", label: "AI", icon: Sparkles },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { aiSuggestionsEnabled, toggleAISuggestions, darkMode, toggleDarkMode } = useAppSettings();
    const [activeTab, setActiveTab] = useState("profile");
    const [notifications, setNotifications] = useState({
        emailOnPaid: true,
        emailReminders: false,
        weeklyReports: true,
    });

    const [profileForm, setProfileForm] = useState({
        companyName: user?.companyName || "",
    });

    const updateSettingsMutation = useMutation({
        mutationFn: (settings: { aiSuggestionsEnabled?: boolean; darkMode?: boolean }) => {
            return apiRequest("PUT", "/api/settings", settings);
        },
        onSuccess: () => {
            toast({ title: "Settings Saved!", description: "Your preferences have been updated." });
            queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
        },
        onError: () => {
            toast({ title: "Error", description: "Could not save settings.", variant: "destructive" });
        },
    });

    const handleAIToggle = () => {
        toggleAISuggestions();
        updateSettingsMutation.mutate({ aiSuggestionsEnabled: !aiSuggestionsEnabled });
    };

    const handleDarkModeToggle = () => {
        toggleDarkMode();
        updateSettingsMutation.mutate({ darkMode: !darkMode });
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const SettingsPageHeader = (
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                <Settings className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your preferences and account</p>
            </div>
        </div>
    );

    // Profile Section
    const ProfileSection = () => (
        <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={user?.name || ""} className="pl-10 bg-muted/50" disabled />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={user?.email || ""} className="pl-10 bg-muted/50" disabled />
                    </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-medium">Company Name</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={profileForm.companyName}
                            onChange={(e) => setProfileForm((p) => ({ ...p, companyName: e.target.value }))}
                            className="pl-10"
                            placeholder="Your company name"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button onClick={() => setLocation("/profile")} variant="outline" className="gap-2">
                    <User className="w-4 h-4" /> View Full Profile
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
                    <Save className="w-4 h-4" /> Save Changes
                </Button>
            </div>
        </div>
    );

    // Appearance Section
    const AppearanceSection = () => (
        <div className="space-y-6">
            {/* Theme Toggle Card */}
            <div className="p-5 rounded-2xl border bg-gradient-to-br from-background to-muted/30">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${darkMode ? 'bg-slate-800' : 'bg-amber-100'}`}>
                            {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-600" />}
                        </div>
                        <div>
                            <p className="font-semibold">Theme Mode</p>
                            <p className="text-sm text-muted-foreground">
                                {darkMode ? "Dark mode enabled" : "Light mode enabled"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/50 px-3 py-2 rounded-full">
                        <Sun className="w-4 h-4 text-muted-foreground" />
                        <Switch
                            checked={darkMode}
                            onCheckedChange={handleDarkModeToggle}
                            disabled={updateSettingsMutation.isPending}
                        />
                        <Moon className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Color Accent */}
            <div className="p-5 rounded-2xl border">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                        <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold">Accent Color</p>
                        <p className="text-sm text-muted-foreground">Customize your brand color</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {[
                        { color: "#6366F1", name: "Indigo" },
                        { color: "#8B5CF6", name: "Purple" },
                        { color: "#EC4899", name: "Pink" },
                        { color: "#10B981", name: "Green" },
                        { color: "#F59E0B", name: "Amber" },
                        { color: "#EF4444", name: "Red" },
                    ].map((item) => (
                        <button
                            key={item.color}
                            className="w-10 h-10 rounded-xl border-2 border-transparent hover:border-white/50 transition-all hover:scale-110 shadow-lg"
                            style={{ backgroundColor: item.color }}
                            title={item.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    // AI Section
    const AISection = () => (
        <div className="space-y-6">
            <div className="p-5 rounded-2xl border bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/25">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">AI Suggestions</p>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white uppercase tracking-wide">
                                    Beta
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Smart suggestions for invoice descriptions & pricing
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={aiSuggestionsEnabled}
                        onCheckedChange={handleAIToggle}
                        disabled={updateSettingsMutation.isPending}
                    />
                </div>

                {aiSuggestionsEnabled && (
                    <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <p className="text-sm text-green-700 dark:text-green-400">
                            AI suggestions are active for invoice creation
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    // Notifications Section
    const NotificationsSection = () => (
        <div className="space-y-4">
            {[
                { id: "emailOnPaid", title: "Payment Received", desc: "Get notified when a client pays", icon: CreditCard },
                { id: "emailReminders", title: "Payment Reminders", desc: "Auto-remind clients about overdue invoices", icon: Bell, isPro: true },
                { id: "weeklyReports", title: "Weekly Reports", desc: "Summary of your invoice activity", icon: Mail },
            ].map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-muted">
                            <item.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{item.title}</p>
                                {item.isPro && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications[item.id as keyof typeof notifications]}
                        onCheckedChange={(checked) => setNotifications((p) => ({ ...p, [item.id]: checked }))}
                    />
                </div>
            ))}
        </div>
    );

    // Billing Section
    const BillingSection = () => (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl border bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-bold">
                                {user?.subscriptionStatus === "active" ? "Pro Plan" : "Free Plan"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {user?.subscriptionStatus === "active"
                                    ? "Unlimited invoices & premium templates"
                                    : "Upgrade to unlock all features"}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setLocation("/subscription")}
                        className={
                            user?.subscriptionStatus === "active"
                                ? ""
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
                        }
                        variant={user?.subscriptionStatus === "active" ? "outline" : "default"}
                    >
                        {user?.subscriptionStatus === "active" ? "Manage Plan" : "Upgrade to Pro"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>

            {user?.invoiceCredits !== undefined && user.invoiceCredits > 0 && (
                <div className="p-5 rounded-2xl border flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Invoice Credits</p>
                        <p className="text-sm text-muted-foreground">For premium templates</p>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        {user.invoiceCredits}
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "profile": return <ProfileSection />;
            case "appearance": return <AppearanceSection />;
            case "ai": return <AISection />;
            case "notifications": return <NotificationsSection />;
            case "billing": return <BillingSection />;
            default: return <ProfileSection />;
        }
    };

    return (
        <AppLayout pageHeader={SettingsPageHeader}>
            {/* Horizontal Tabs */}
            <div className="mb-8 -mx-2 px-2 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-card rounded-2xl border p-6 lg:p-8">
                {renderContent()}
            </div>
        </AppLayout>
    );
}
