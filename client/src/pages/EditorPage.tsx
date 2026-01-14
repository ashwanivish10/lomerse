import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { useInvoice } from "../contexts/InvoiceContext";
import InvoicePreview from "../components/InvoicePreview";
import {
  Download,
  Loader2,
  ArrowLeft,
  FileText,
  Palette,
  User,
  Building2,
  Plus,
  Trash2,
  Receipt,
  Calendar,
  Hash,
  Percent,
  Package
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Dock from "@/components/Dock";
import type { DockItemData } from "@/components/Dock";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Crown,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  UserIcon
} from "lucide-react";

function EditorPage() {
  const { invoiceData, setInvoiceData, template, theme } = useInvoice();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Dock items
  const isSubscribed = user?.subscriptionStatus === 'active';
  const dockItems: DockItemData[] = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5" />, onClick: () => navigate("/") },
    { href: "/choose-template", label: "New Invoice", icon: <FileText className="size-5" />, onClick: () => navigate("/choose-template") },
    { href: "/clients", label: "Clients", icon: <Users className="size-5" />, onClick: () => navigate("/clients") },
    { href: "/profile", label: "Profile", icon: <UserIcon className="size-5" />, onClick: () => navigate("/profile") },
    { href: "/settings", label: "Settings", icon: <Settings className="size-5" />, onClick: () => navigate("/settings") },
    { href: "/help", label: "Help", icon: <HelpCircle className="size-5" />, onClick: () => navigate("/help") },
    isSubscribed
      ? { href: "/subscription", label: "Subscription", icon: <CreditCard className="size-5" />, onClick: () => navigate("/subscription") }
      : { href: "/subscription", label: "Upgrade", icon: <Crown className="size-5 text-yellow-500" />, onClick: () => navigate("/subscription") },
    { href: "/auth/logout", label: "Sign Out", icon: <LogOut className="size-5 text-red-500" />, onClick: () => { window.location.href = "/auth/logout"; } },
  ];

  // Handler functions
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "invoice_nr" || name === "taxRate") {
      setInvoiceData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setInvoiceData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      customer: { ...prev.customer, [name]: value },
    }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newItems = invoiceData.items.map((item, i) => {
      if (i === index) {
        if (name === "quantity" || name === "unit_price") {
          return { ...item, [name]: parseFloat(value) || 0 };
        }
        return { ...item, [name]: value };
      }
      return item;
    });
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { item: "", description: "", quantity: 1, unit_price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    const filtered = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prev) => ({ ...prev, items: filtered }));
  };

  // Calculate totals
  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const tax = subtotal * invoiceData.taxRate;
  const total = subtotal + tax;

  const handleDownload = async () => {
    setIsLoading(true);

    const transformed = {
      from: {
        name: "Your Company",
        address: "Company Address",
        email: "company@email.com",
      },
      to: {
        name: invoiceData.customer.name,
        address: invoiceData.customer.address,
      },
      invoiceNumber: invoiceData.invoice_nr,
      invoiceDate: invoiceData.date,
      dueDate: invoiceData.date,
      items: invoiceData.items.map((item) => ({
        description: item.description || item.item,
        quantity: item.quantity,
        price: item.unit_price,
      })),
      subtotal,
      taxRate: invoiceData.taxRate,
      tax,
      total,
      notes: "Thank you for your business.",
    };

    const dataToSend = {
      templateName: template,
      theme: theme,
      data: transformed,
    };

    try {
      // Try Puppeteer endpoint first (pixel-perfect matching browser preview)
      let response;
      try {
        response = await axios.post("/api/invoice/generate-puppeteer", dataToSend, {
          responseType: "blob",
          timeout: 35000, // 35s timeout for Puppeteer
        });
        console.log("✅ PDF generated with Puppeteer (pixel-perfect)");
      } catch (puppeteerError: any) {
        // If Puppeteer fails, fallback to PDFKit
        console.warn("⚠️ Puppeteer failed, falling back to PDFKit:", puppeteerError.message);

        // Don't fallback on auth/permission errors
        if (puppeteerError.response?.status === 401 || puppeteerError.response?.status === 403) {
          throw puppeteerError;
        }

        response = await axios.post("/api/invoice/generate", dataToSend, {
          responseType: "blob",
        });
        console.log("✅ PDF generated with PDFKit (fallback)");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `invoice-${invoiceData.invoice_nr}.pdf`);

      await queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });

      toast({
        title: "PDF Downloaded!",
        description: "Your invoice has been downloaded successfully.",
      });
    } catch (err: any) {
      console.error("PDF Error:", err);

      if (err.response?.status === 403) {
        toast({
          title: "Upgrade Required",
          description: "You need a subscription or credits to download premium templates.",
          variant: "destructive",
        });
        navigate("/subscription");
      } else if (err.response?.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to download premium templates.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Download Failed",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Dock Navigation */}
      <div className="hidden md:block">
        <Dock items={dockItems} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 md:pl-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>

              <div>
                <h1 className="text-xl font-bold text-foreground">Create Invoice</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {template || "Modern"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    {theme?.name || "Default"}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {isLoading ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:pl-24">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* Left - Editor */}
          <div className="space-y-6">

            {/* Invoice Details */}
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <Receipt className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice_nr" className="flex items-center gap-2 text-sm font-medium">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      Invoice Number
                    </Label>
                    <Input
                      id="invoice_nr"
                      type="number"
                      name="invoice_nr"
                      value={invoiceData.invoice_nr}
                      onChange={handleDataChange}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Invoice Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={invoiceData.date}
                      onChange={handleDataChange}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bill To */}
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Bill To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name" className="text-sm font-medium">Customer Name</Label>
                  <Input
                    id="customer-name"
                    type="text"
                    name="name"
                    placeholder="Enter customer name"
                    value={invoiceData.customer.name}
                    onChange={handleCustomerChange}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-address" className="text-sm font-medium">Address</Label>
                  <Input
                    id="customer-address"
                    type="text"
                    name="address"
                    placeholder="Enter customer address"
                    value={invoiceData.customer.address}
                    onChange={handleCustomerChange}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-city" className="text-sm font-medium">City, State, ZIP</Label>
                  <Input
                    id="customer-city"
                    type="text"
                    name="city"
                    placeholder="City, State, ZIP"
                    value={invoiceData.customer.city}
                    onChange={handleCustomerChange}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                      <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    Line Items
                  </CardTitle>
                  <Button onClick={addItem} size="sm" variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoiceData.items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No items yet. Click "Add Item" to get started.</p>
                  </div>
                ) : (
                  invoiceData.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Item {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-3 sm:col-span-1">
                          <Input
                            type="text"
                            name="item"
                            placeholder="Item name"
                            value={item.item}
                            onChange={(e) => handleItemChange(index, e)}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            min="1"
                            name="quantity"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            min="0"
                            name="unit_price"
                            placeholder="Price"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, e)}
                            className="h-10"
                          />
                        </div>
                      </div>
                      <Input
                        type="text"
                        name="description"
                        placeholder="Description (optional)"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, e)}
                        className="h-10"
                      />
                      <div className="text-right text-sm font-medium text-foreground">
                        Line Total: ₹{(item.quantity * item.unit_price).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Tax & Totals */}
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Percent className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Tax & Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate" className="text-sm font-medium">
                    Tax Rate (e.g., 0.18 for 18%)
                  </Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    name="taxRate"
                    value={invoiceData.taxRate}
                    onChange={handleDataChange}
                    className="h-11 max-w-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-600 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({(invoiceData.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200 dark:border-slate-600">
                    <span>Total</span>
                    <span className="text-indigo-600 dark:text-indigo-400">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Preview */}
          <div className="xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)]">
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 h-full ring-1 ring-slate-100 dark:ring-slate-700">
              <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 overflow-auto bg-slate-50 dark:bg-slate-900/30" style={{ maxHeight: "calc(100vh - 12rem)" }}>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 transform scale-75 origin-top-left" style={{ width: "133%" }}>
                  <InvoicePreview />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Download Button */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700">
        <Button
          onClick={handleDownload}
          disabled={isLoading}
          size="lg"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Download className="h-5 w-5 mr-2" />
          )}
          {isLoading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}

export default EditorPage;
