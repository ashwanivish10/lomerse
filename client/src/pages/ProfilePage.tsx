import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import {
  Save,
  User,
  Building2,
  Mail,
  AlertTriangle,
  Loader2,
  Shield,
  Crown,
  Calendar,
  CreditCard,
  ChevronRight,
  Camera,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AppLayout from "@/components/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Get user data with fallbacks
  const displayName = user?.name || user?.firstName || "";
  const email = user?.email || "";
  const avatarUrl = user?.avatarUrl || user?.profileImageUrl || "";
  const companyName = user?.companyName || "";
  const isSubscribed = user?.subscriptionStatus === "active";
  const subscriptionTier = user?.subscriptionTier;

  const [name, setName] = useState(displayName);
  const [company, setCompany] = useState(companyName);

  useEffect(() => {
    if (user) {
      setName(user.name || user.firstName || "");
      setCompany(user.companyName || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (updatedProfile: { name: string; companyName: string }) =>
      apiRequest("PUT", "/api/profile", updatedProfile),
    onSuccess: () => {
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
      queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/account");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete account");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Account deleted", description: "Your account has been permanently deleted." });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete account", description: error.message, variant: "destructive" });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name, companyName: company });
  };

  // Page Header
  const ProfileHeader = (
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
        <User className="w-7 h-7" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your personal information and account settings
        </p>
      </div>
    </div>
  );

  return (
    <AppLayout pageHeader={ProfileHeader}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Overview Card */}
        <Card className="rounded-2xl border shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <CardContent className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-12 left-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="pt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  {displayName || "Your Name"}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isSubscribed ? (
                  <Badge className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 font-semibold">
                    <Crown className="w-3.5 h-3.5 mr-1.5" />
                    {subscriptionTier === "yearly" ? "Yearly Pro" : "Monthly Pro"}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-3 py-1.5 font-medium">
                    Free Plan
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={email}
                          disabled
                          className="pl-10 h-11 bg-muted/50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email is linked to your login and cannot be changed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your company or business name"
                        className="pl-10 h-11"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This will appear on your invoices
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 h-11 px-6"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete your account and all associated data. This cannot be undone.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="gap-2 shrink-0"
                          disabled={deleteAccountMutation.isPending}
                        >
                          {deleteAccountMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete Account"
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data including invoices, clients, and payment history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteAccountMutation.mutate()}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Links */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <span className="font-semibold">
                    {isSubscribed ? (subscriptionTier === "yearly" ? "Yearly Pro" : "Monthly Pro") : "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Invoice Credits</span>
                  <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {user?.invoiceCredits || 0}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl h-11"
                  onClick={() => setLocation("/subscription")}
                >
                  {isSubscribed ? "Manage Subscription" : "Upgrade to Pro"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="p-2 rounded-lg bg-emerald-500">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Account Secured
                    </p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">
                      OAuth authentication enabled
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your account is protected with secure OAuth authentication through Google.
                </p>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account ID</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {user?.id?.slice(0, 8)}...
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">Jan 2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
