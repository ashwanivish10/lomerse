import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    BookOpen,
    FileText,
    Code,
    Palette,
    Users,
    CreditCard,
    Settings,
    Zap,
    Search,
    ArrowRight,
    ExternalLink,
    Layers,
    Calendar,
    Globe,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";

// Documentation sections
const sections = [
    {
        title: "Getting Started",
        icon: Zap,
        description: "Quick start guide for new users",
        gradient: "from-emerald-500 to-teal-500",
        articles: [
            { title: "Creating Your Account", href: "#" },
            { title: "Dashboard Overview", href: "#" },
            { title: "Your First Invoice", href: "/docs/invoicing" },
            { title: "Understanding Templates", href: "#" },
        ],
    },
    {
        title: "Invoice Creation",
        icon: FileText,
        description: "Everything about creating invoices",
        gradient: "from-blue-500 to-cyan-500",
        articles: [
            { title: "Template Selection", href: "/choose-template" },
            { title: "Theme Customization", href: "/choose-theme" },
            { title: "Adding Line Items", href: "#" },
            { title: "Tax & Discount Settings", href: "#" },
        ],
    },
    {
        title: "Client Management",
        icon: Users,
        description: "Organize and manage your clients",
        gradient: "from-violet-500 to-purple-500",
        articles: [
            { title: "Adding New Clients", href: "/clients" },
            { title: "Client Profiles", href: "#" },
            { title: "Invoice History by Client", href: "#" },
            { title: "Bulk Import Clients", href: "#" },
        ],
    },
    {
        title: "Templates & Themes",
        icon: Palette,
        description: "Customize your invoice appearance",
        gradient: "from-pink-500 to-rose-500",
        articles: [
            { title: "Available Templates", href: "/choose-template" },
            { title: "Color Themes", href: "/choose-theme" },
            { title: "Custom Branding", href: "#" },
            { title: "Logo Upload Guide", href: "#" },
        ],
    },
    {
        title: "Billing & Subscription",
        icon: CreditCard,
        description: "Plans, payments, and account billing",
        gradient: "from-amber-500 to-orange-500",
        articles: [
            { title: "Subscription Plans", href: "/subscription" },
            { title: "Payment Methods", href: "/docs/billing" },
            { title: "Invoice Credits", href: "#" },
            { title: "Billing FAQ", href: "/docs/billing" },
        ],
    },
    {
        title: "Settings & Preferences",
        icon: Settings,
        description: "Configure your workspace",
        gradient: "from-slate-500 to-slate-700",
        articles: [
            { title: "Business Details", href: "/settings" },
            { title: "Default Values", href: "#" },
            { title: "Notification Settings", href: "#" },
            { title: "Export Preferences", href: "#" },
        ],
    },
];

// Feature highlights
const features = [
    {
        icon: Layers,
        title: "Multiple Templates",
        description: "Choose from professional invoice templates for any business.",
    },
    {
        icon: Palette,
        title: "Beautiful Themes",
        description: "Customize colors to match your brand identity.",
    },
    {
        icon: Calendar,
        title: "Calendar Integration",
        description: "Track due dates and invoice timelines easily.",
    },
    {
        icon: Globe,
        title: "Multi-Currency",
        description: "Create invoices in any currency for global clients.",
    },
];

interface DocSectionCardProps {
    title: string;
    icon: React.ElementType;
    description: string;
    gradient: string;
    articles: { title: string; href: string }[];
}

function DocSectionCard({ title, icon: Icon, description, gradient, articles }: DocSectionCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <CardDescription className="text-sm">{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {articles.map((article, index) => (
                        <li key={index}>
                            <Link href={article.href}>
                                <a className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-md hover:bg-muted/50">
                                    <span>{article.title}</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

export default function DocumentationPage() {
    const pageHeader = (
        <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Documentation
            </h1>
            <p className="text-lg text-muted-foreground">
                Browse the complete developer and user documentation.
            </p>
        </div>
    );

    return (
        <AppLayout pageHeader={pageHeader}>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search documentation..."
                        className="w-full pl-10 h-12 text-base"
                    />
                </div>
            </div>

            {/* Popular Links Banner */}
            <Card className="max-w-5xl mx-auto mb-10 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span className="text-sm font-medium text-foreground">Popular:</span>
                        <Link href="/docs/invoicing">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Creating Invoices
                            </Button>
                        </Link>
                        <Link href="/subscription">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Pricing Plans
                            </Button>
                        </Link>
                        <Link href="/settings">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Settings
                            </Button>
                        </Link>
                        <Link href="/clients">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Managing Clients
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Documentation Sections Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {sections.map((section, index) => (
                    <DocSectionCard key={index} {...section} />
                ))}
            </div>

            {/* Features Overview */}
            <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold text-center mb-6">Platform Features</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center p-6">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* API Documentation (Future) */}
            <Card className="max-w-3xl mx-auto bg-muted/30 border-dashed mb-8">
                <CardContent className="p-6 text-center">
                    <Code className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">API Documentation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Developer API docs coming soon. Build custom integrations with Lomerse.
                    </p>
                    <Button variant="outline" disabled>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Coming Soon
                    </Button>
                </CardContent>
            </Card>

            {/* Back to Help Link */}
            <div className="text-center mt-10">
                <Link href="/help">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                        ← Back to Help Center
                    </Button>
                </Link>
            </div>
        </AppLayout>
    );
}
