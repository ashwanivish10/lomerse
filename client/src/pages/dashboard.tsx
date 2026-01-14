import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import {
  Crown,
  CreditCard,
  FileText,
  Calendar,
  Plus,
  Trash2,
  DollarSign,
  MoreHorizontal,
  Eye,
  TrendingUp,
  Users,
  ArrowUpRight,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import type { Invoice } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import AppLayout from "@/components/AppLayout";

// Page Header Component
const DashboardHeader = () => {
  const { user } = useAuth();
  const displayName = user?.firstName || "User";
  const email = user?.email || "";
  const avatarUrl = user?.profileImageUrl || "";

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
          <LayoutDashboard className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, {displayName.split(" ")[0]}! Here's your overview.
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <Avatar className="h-12 w-12 ring-2 ring-indigo-100 dark:ring-indigo-900">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

// Stat Card Component - Modern Gradient Design
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  gradient: string;
  bgGradient: string;
}

const StatCard = ({ title, value, icon, trend, trendUp, gradient, bgGradient }: StatCardProps) => (
  <div className={`relative overflow-hidden rounded-3xl ${bgGradient} p-6 min-h-[140px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer group`}>
    {/* Decorative circular pattern */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/10 blur-sm" />
    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10" />

    <div className="relative flex items-center justify-between h-full">
      {/* Left side - Text content */}
      <div className="space-y-1 z-10">
        <h3 className="text-xl font-bold text-white/95 tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-white/70">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${trendUp ? 'text-white/90' : 'text-white/70'}`}>
            <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
            {trend}
          </div>
        )}
      </div>

      {/* Right side - Icon with 3D effect */}
      <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const displayName = user?.firstName || "User";
  const isSubscribed = user?.subscriptionStatus === "active";
  const subscriptionTier = user?.subscriptionTier;

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice deleted", description: "The invoice has been removed." });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        setLocation("/signin");
        return;
      }
      toast({ title: "Error", description: "Failed to delete invoice", variant: "destructive" });
    },
  });

  // Calculate stats
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const thisMonthInvoices = invoices.filter(
    (inv) => new Date(inv.createdAt!).getMonth() === new Date().getMonth()
  ).length;
  const recentInvoices = invoices.slice(0, 5);

  return (
    <AppLayout pageHeader={<DashboardHeader />}>
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={() => setLocation("/create-invoice")}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 rounded-xl h-12 px-6"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create Invoice</span>
          </Button>
          {!isSubscribed && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/subscription")}
              className="gap-2 rounded-xl h-12 px-6 border-2 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
            >
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="font-semibold">Upgrade to Pro</span>
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            gradient="from-white/30 to-white/10"
            bgGradient="bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500"
            trend="+12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Total Invoices"
            value={invoices.length}
            icon={<FileText className="w-6 h-6 text-white" />}
            gradient="from-white/30 to-white/10"
            bgGradient="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500"
          />
          <StatCard
            title="This Month"
            value={thisMonthInvoices}
            icon={<Calendar className="w-6 h-6 text-white" />}
            gradient="from-white/30 to-white/10"
            bgGradient="bg-gradient-to-br from-rose-400 via-pink-400 to-red-400"
          />
          <StatCard
            title="Current Plan"
            value={isSubscribed ? (subscriptionTier === "yearly" ? "Yearly Pro" : "Monthly Pro") : "Free"}
            icon={<CreditCard className="w-6 h-6 text-white" />}
            gradient="from-white/30 to-white/10"
            bgGradient="bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Invoices */}
          <Card className="lg:col-span-2 rounded-2xl border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Recent Invoices
                </CardTitle>
                {invoices.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 gap-1">
                    View All <ArrowUpRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {invoicesLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : invoices.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No invoices yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first invoice to get started
                  </p>
                  <Button onClick={() => setLocation("/create-invoice")} className="gap-2">
                    <Plus className="w-4 h-4" /> Create Invoice
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setLocation(`/invoice/${invoice.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{invoice.clientName}</p>
                          <p className="text-xs text-muted-foreground">
                            #{invoice.invoiceNumber} • {new Date(invoice.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ₹{invoice.totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            Completed
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setLocation(`/invoice/${invoice.id}`); }}>
                              <Eye className="w-4 h-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(invoice.id!); }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Clients Card */}
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Active Clients</span>
                  <span className="font-semibold">{new Set(invoices.map(i => i.clientName)).size}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Avg. Invoice Value</span>
                  <span className="font-semibold">
                    ₹{invoices.length > 0 ? (totalRevenue / invoices.length).toLocaleString("en-IN", { minimumFractionDigits: 0 }) : "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Invoice Credits</span>
                  <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {user?.invoiceCredits || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            {!isSubscribed && (
              <Card className="rounded-2xl border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Crown className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Go Pro</h3>
                  </div>
                  <p className="text-sm text-white/80 mb-4">
                    Unlock unlimited invoices, premium templates, and priority support.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-indigo-600 hover:bg-white/90 font-semibold"
                    onClick={() => setLocation("/subscription")}
                  >
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}