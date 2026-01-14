import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    FileText,
    Users,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Activity,
} from "lucide-react";
import type { Invoice } from "@shared/schema";
import AppLayout from "@/components/AppLayout";

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: React.ReactNode;
    gradient: string;
}

const StatCard = ({ title, value, change, changeType, icon, gradient }: StatCardProps) => (
    <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        <CardContent className="p-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${changeType === "positive" ? "text-emerald-600" :
                                changeType === "negative" ? "text-red-500" : "text-muted-foreground"
                            }`}>
                            {changeType === "positive" ? <ArrowUpRight className="w-3 h-3" /> :
                                changeType === "negative" ? <ArrowDownRight className="w-3 h-3" /> : null}
                            {change}
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    {icon}
                </div>
            </div>
        </CardContent>
    </Card>
);

// Progress Bar Component
interface ProgressBarProps {
    label: string;
    value: number;
    total: number;
    color: string;
}

const ProgressBar = ({ label, value, total, color }: ProgressBarProps) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">₹{value.toLocaleString("en-IN")}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default function ReportsPage() {
    const { user } = useAuth();
    const [timeRange, setTimeRange] = useState("this-month");

    const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
        queryKey: ["/api/invoices"],
        enabled: !!user,
    });

    // Calculate statistics
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthInvoices = invoices.filter((inv) => {
        const date = new Date(inv.createdAt!);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthInvoices = invoices.filter((inv) => {
        const date = new Date(inv.createdAt!);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const year = currentMonth === 0 ? currentYear - 1 : currentYear;
        return date.getMonth() === lastMonth && date.getFullYear() === year;
    });

    const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
    const thisMonthRevenue = thisMonthInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
    const lastMonthRevenue = lastMonthInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

    const revenueChange = lastMonthRevenue > 0
        ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
        : thisMonthRevenue > 0 ? "+100" : "0";

    const invoiceCountChange = lastMonthInvoices.length > 0
        ? (((thisMonthInvoices.length - lastMonthInvoices.length) / lastMonthInvoices.length) * 100).toFixed(1)
        : thisMonthInvoices.length > 0 ? "+100" : "0";

    const uniqueClients = new Set(invoices.map((inv) => inv.clientName)).size;
    const avgInvoiceValue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    // Top clients by revenue
    const clientRevenue = invoices.reduce((acc, inv) => {
        acc[inv.clientName] = (acc[inv.clientName] || 0) + (inv.totalAmount || 0);
        return acc;
    }, {} as Record<string, number>);

    const topClients = Object.entries(clientRevenue)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Monthly revenue data for chart
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const month = new Date(currentYear, currentMonth - (5 - i), 1);
        const monthInvoices = invoices.filter((inv) => {
            const date = new Date(inv.createdAt!);
            return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
        });
        return {
            month: month.toLocaleDateString("en-US", { month: "short" }),
            revenue: monthInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0),
            count: monthInvoices.length,
        };
    });

    const maxMonthlyRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

    // Page Header
    const ReportsHeader = (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
                    <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Reports & Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Track your business performance and insights
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] rounded-xl">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                        <SelectItem value="all-time">All Time</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 rounded-xl">
                    <Download className="w-4 h-4" />
                    Export
                </Button>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <AppLayout pageHeader={ReportsHeader}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="rounded-2xl">
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-24 mb-3" />
                                <Skeleton className="h-8 w-32 mb-2" />
                                <Skeleton className="h-3 w-20" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout pageHeader={ReportsHeader}>
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`}
                        change={`${Number(revenueChange) >= 0 ? "+" : ""}${revenueChange}% from last month`}
                        changeType={Number(revenueChange) >= 0 ? "positive" : "negative"}
                        icon={<DollarSign className="w-5 h-5 text-white" />}
                        gradient="from-emerald-500 to-teal-600"
                    />
                    <StatCard
                        title="Total Invoices"
                        value={invoices.length}
                        change={`${Number(invoiceCountChange) >= 0 ? "+" : ""}${invoiceCountChange}% from last month`}
                        changeType={Number(invoiceCountChange) >= 0 ? "positive" : "negative"}
                        icon={<FileText className="w-5 h-5 text-white" />}
                        gradient="from-blue-500 to-indigo-600"
                    />
                    <StatCard
                        title="Active Clients"
                        value={uniqueClients}
                        icon={<Users className="w-5 h-5 text-white" />}
                        gradient="from-violet-500 to-purple-600"
                    />
                    <StatCard
                        title="Avg. Invoice Value"
                        value={`₹${avgInvoiceValue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`}
                        icon={<Activity className="w-5 h-5 text-white" />}
                        gradient="from-amber-500 to-orange-600"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <Card className="lg:col-span-2 rounded-2xl border shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                                    Revenue Overview
                                </CardTitle>
                                <Badge variant="secondary" className="font-normal">
                                    Last 6 Months
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {/* Simple Bar Chart */}
                            <div className="h-64 flex items-end justify-between gap-3">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col items-center">
                                            <span className="text-xs font-medium text-muted-foreground mb-1">
                                                ₹{(data.revenue / 1000).toFixed(0)}k
                                            </span>
                                            <div
                                                className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-purple-600 cursor-pointer"
                                                style={{
                                                    height: `${(data.revenue / maxMonthlyRevenue) * 180}px`,
                                                    minHeight: data.revenue > 0 ? "20px" : "4px",
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {data.month}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Clients */}
                    <Card className="rounded-2xl border shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-muted-foreground" />
                                Top Clients
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {topClients.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No client data yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {topClients.map(([client, revenue], index) => (
                                        <ProgressBar
                                            key={client}
                                            label={client}
                                            value={revenue}
                                            total={totalRevenue}
                                            color={[
                                                "bg-indigo-500",
                                                "bg-purple-500",
                                                "bg-pink-500",
                                                "bg-blue-500",
                                                "bg-teal-500",
                                            ][index]}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Breakdown */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            Monthly Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Month</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Invoices</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Avg. Value</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Growth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyData.slice().reverse().map((data, index, arr) => {
                                        const prevRevenue = arr[index + 1]?.revenue || 0;
                                        const growth = prevRevenue > 0
                                            ? (((data.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
                                            : data.revenue > 0 ? "100" : "0";
                                        const avgValue = data.count > 0 ? data.revenue / data.count : 0;

                                        return (
                                            <tr key={data.month} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="py-4 px-4 font-medium">{data.month} 2026</td>
                                                <td className="py-4 px-4 text-right">{data.count}</td>
                                                <td className="py-4 px-4 text-right font-medium">
                                                    ₹{data.revenue.toLocaleString("en-IN")}
                                                </td>
                                                <td className="py-4 px-4 text-right text-muted-foreground">
                                                    ₹{avgValue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${Number(growth) >= 0 ? "text-emerald-600" : "text-red-500"
                                                        }`}>
                                                        {Number(growth) >= 0 ? (
                                                            <TrendingUp className="w-3 h-3" />
                                                        ) : (
                                                            <TrendingDown className="w-3 h-3" />
                                                        )}
                                                        {Number(growth) >= 0 ? "+" : ""}{growth}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State */}
                {invoices.length === 0 && (
                    <Card className="rounded-2xl border-dashed border-2">
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No data to display</h3>
                            <p className="text-muted-foreground mb-4">
                                Create some invoices to see your reports and analytics
                            </p>
                            <Button className="gap-2">
                                <FileText className="w-4 h-4" />
                                Create Invoice
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
