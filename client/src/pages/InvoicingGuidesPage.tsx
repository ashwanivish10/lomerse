import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Send,
    Settings,
    Download,
    Edit,
    Users,
    Clock,
    CheckCircle,
    ArrowRight,
    Lightbulb,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";

// Guide card data
const guides = [
    {
        icon: FileText,
        title: "Creating Your First Invoice",
        description: "Step-by-step guide to create a professional invoice from scratch.",
        steps: [
            "Click 'Create Invoice' from the dashboard",
            "Choose a template that fits your brand",
            "Select a color theme",
            "Fill in your business and client details",
            "Add line items and quantities",
        ],
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Edit,
        title: "Customizing Invoice Details",
        description: "Learn how to personalize every aspect of your invoice.",
        steps: [
            "Upload your company logo",
            "Set custom invoice numbers and dates",
            "Add tax rates and discounts",
            "Include payment terms and notes",
            "Save your settings for future invoices",
        ],
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: Send,
        title: "Sending Invoices to Clients",
        description: "Different ways to deliver your invoices efficiently.",
        steps: [
            "Download as PDF for email attachments",
            "Share invoice preview link (coming soon)",
            "Print directly from the editor",
            "Track sent invoices from dashboard",
        ],
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: Settings,
        title: "Managing Invoice Settings",
        description: "Configure default settings to speed up your workflow.",
        steps: [
            "Set default tax rates",
            "Configure your business details",
            "Choose preferred templates and themes",
            "Customize currency and number formats",
        ],
        gradient: "from-amber-500 to-orange-500",
    },
    {
        icon: Users,
        title: "Working with Clients",
        description: "Efficiently manage your client database for faster invoicing.",
        steps: [
            "Add new clients from the Clients page",
            "Store client billing addresses",
            "View invoice history per client",
            "Quick-select saved clients when invoicing",
        ],
        gradient: "from-indigo-500 to-violet-500",
    },
    {
        icon: Download,
        title: "Downloading & Exporting",
        description: "Export your invoices in various formats.",
        steps: [
            "Download high-quality PDF invoices",
            "Choose paper size (A4, Letter)",
            "Access download history",
            "Re-download past invoices anytime",
        ],
        gradient: "from-rose-500 to-red-500",
    },
];

// Quick tips
const tips = [
    {
        icon: Clock,
        tip: "Save time by setting up your business details in Settings once.",
    },
    {
        icon: CheckCircle,
        tip: "Double-check client email addresses before sending invoices.",
    },
    {
        icon: Lightbulb,
        tip: "Use consistent invoice numbering for easier tracking.",
    },
];

interface GuideCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    steps: string[];
    gradient: string;
}

function GuideCard({ icon: Icon, title, description, steps, gradient }: GuideCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
            <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <CardDescription className="mt-1">{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ol className="space-y-2">
                    {steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                                {index + 1}
                            </span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
            </CardContent>
        </Card>
    );
}

export default function InvoicingGuidesPage() {
    const pageHeader = (
        <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Invoicing Guides
            </h1>
            <p className="text-lg text-muted-foreground">
                Learn how to create, send, and manage your invoices like a pro.
            </p>
        </div>
    );

    return (
        <AppLayout pageHeader={pageHeader}>
            {/* Quick Start CTA */}
            <Card className="max-w-3xl mx-auto mb-10 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                Ready to create your first invoice?
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Jump right in and start invoicing in minutes.
                            </p>
                        </div>
                        <Link href="/choose-template">
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                                Create Invoice
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Guides Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {guides.map((guide, index) => (
                    <GuideCard key={index} {...guide} />
                ))}
            </div>

            {/* Quick Tips Section */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-center mb-6">Quick Tips</h2>
                <Card>
                    <CardContent className="p-6">
                        <div className="grid sm:grid-cols-3 gap-6">
                            {tips.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.tip}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

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
