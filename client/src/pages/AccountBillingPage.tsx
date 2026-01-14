import React from "react";
import { useAuth } from "@/hooks/useAuth";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CreditCard,
    User,
    Settings,
    Crown,
    Shield,
    Clock,
    ArrowRight,
    Receipt,
    Mail,
    Check,
    AlertCircle,
    Loader2,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";

interface QuickLinkCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    href: string;
    linkText: string;
    gradient: string;
}

function QuickLinkCard({ icon: Icon, title, description, href, linkText, gradient }: QuickLinkCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
            <CardHeader className="pb-3">
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
                <Link href={href}>
                    <Button variant="outline" className="w-full justify-between">
                        {linkText}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

export default function AccountBillingPage() {
    const { user, isLoading } = useAuth();

    const pageHeader = (
        <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Account & Billing
            </h1>
            <p className="text-lg text-muted-foreground">
                Manage your subscription, payment methods, and profile settings.
            </p>
        </div>
    );

    if (isLoading) {
        return (
            <AppLayout pageHeader={pageHeader}>
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    const isSubscribed = user?.subscriptionStatus === "active";
    const invoiceCredits = user?.invoiceCredits || 0;

    return (
        <AppLayout pageHeader={pageHeader}>
            {/* Account Overview Card */}
            <Card className="max-w-3xl mx-auto mb-8 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${isSubscribed ? "from-emerald-400 to-teal-500" : "from-slate-400 to-slate-500"}`} />
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Avatar/Icon */}
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${isSubscribed ? "bg-gradient-to-br from-emerald-400 to-teal-500" : "bg-gradient-to-br from-slate-400 to-slate-500"}`}>
                            {isSubscribed ? (
                                <Crown className="w-8 h-8 text-white" />
                            ) : (
                                <User className="w-8 h-8 text-white" />
                            )}
                        </div>

                        {/* Account Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-foreground">
                                    {user?.firstName || "User"} {user?.lastName || ""}
                                </h3>
                                <Badge className={isSubscribed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0"}>
                                    {isSubscribed ? (
                                        <>
                                            <Check className="w-3 h-3 mr-1" />
                                            Pro
                                        </>
                                    ) : (
                                        "Free"
                                    )}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{user?.email || ""}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Status</p>
                                    <p className="font-semibold text-foreground flex items-center gap-1">
                                        {isSubscribed ? (
                                            <>
                                                <Check className="w-4 h-4 text-emerald-500" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                                No Subscription
                                            </>
                                        )}
                                    </p>
                                </div>
                                {isSubscribed && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Plan</p>
                                        <p className="font-semibold text-foreground">
                                            {user?.subscriptionTier === "yearly" ? "Yearly Pro" : "Monthly Pro"}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Invoice Credits</p>
                                    <p className="font-semibold text-foreground">{invoiceCredits}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="max-w-3xl mx-auto mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <QuickLinkCard
                        icon={CreditCard}
                        title="Manage Subscription"
                        description="View plans, upgrade, or manage your current subscription."
                        href="/subscription"
                        linkText="Go to Subscription"
                        gradient="from-indigo-500 to-purple-600"
                    />
                    <QuickLinkCard
                        icon={User}
                        title="Edit Profile"
                        description="Update your name, email, and personal information."
                        href="/profile"
                        linkText="Edit Profile"
                        gradient="from-blue-500 to-cyan-500"
                    />
                    <QuickLinkCard
                        icon={Settings}
                        title="App Settings"
                        description="Configure preferences, themes, and default values."
                        href="/settings"
                        linkText="Open Settings"
                        gradient="from-slate-500 to-slate-700"
                    />
                    <QuickLinkCard
                        icon={Receipt}
                        title="Invoice History"
                        description="View all your created invoices and download history."
                        href="/"
                        linkText="View Dashboard"
                        gradient="from-emerald-500 to-teal-500"
                    />
                </div>
            </div>

            {/* Billing FAQ Section */}
            <Card className="max-w-3xl mx-auto mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Billing & Security FAQ
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">How do I upgrade my plan?</h4>
                        <p className="text-sm text-muted-foreground">
                            Visit the Subscription page and choose between Monthly Pro or Yearly Pro plans. Payment is processed securely through Razorpay.
                        </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">Can I cancel my subscription?</h4>
                        <p className="text-sm text-muted-foreground">
                            Yes, you can cancel anytime. Your access will remain active until the end of your billing period.
                        </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">What payment methods are accepted?</h4>
                        <p className="text-sm text-muted-foreground">
                            We accept all major credit/debit cards, UPI, net banking, and popular wallets through Razorpay.
                        </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">Are my payment details secure?</h4>
                        <p className="text-sm text-muted-foreground">
                            Absolutely. All payments are processed through Razorpay with industry-standard encryption. We never store your card details.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="max-w-3xl mx-auto bg-muted/30 border-dashed">
                <CardContent className="p-6 text-center">
                    <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Need billing assistance?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Our support team is here to help with any billing questions.
                    </p>
                    <a href="mailto:support@lomerse.com">
                        <Button variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Support
                        </Button>
                    </a>
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
