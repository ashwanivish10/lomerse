import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  CreditCard,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Receipt
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AppLayout from "@/components/AppLayout";

// Razorpay script loader
const useRazorpayScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        `script[src="${script.src}"]`
      );
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  return isLoaded;
};

export default function Subscription() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const isRazorpayLoaded = useRazorpayScript();

  const handlePayment = async (plan: "monthly" | "yearly" | "single") => {
    console.log("PAYMENT BUTTON CLICKED, SENDING PLAN:", plan);
    if (!isRazorpayLoaded || !user) {
      toast({
        title: "Error",
        description: "Payment service not loaded or user not logged in.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/payment/create-order", {
        plan,
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const order = await response.json();

      if (!order?.orderId || !order?.keyId || !order?.amount) {
        toast({
          title: "Order Creation Failed",
          description: "Invalid order data from server.",
          variant: "destructive",
        });
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Lomerse",
        description:
          plan === "yearly"
            ? "Yearly Subscription"
            : plan === "monthly"
              ? "Monthly Subscription"
              : "Pay Per Invoice",
        order_id: order.orderId,
        handler: async function (paymentResponse: any) {
          try {
            await apiRequest("POST", "/api/verify-payment", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            await queryClient.invalidateQueries({
              queryKey: ["authenticatedUser"],
            });

            toast({
              title: "Payment Successful!",
              description: "Subscription activated. Redirecting...",
            });

            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.firstName || "",
          email: user.email || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (paymentFailedResponse: any) {
        console.error("Payment Failed:", paymentFailedResponse);
        toast({
          title: "Payment Failed",
          description:
            paymentFailedResponse.error?.description ||
            "Your payment could not be processed.",
          variant: "destructive",
        });
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Order Creation Failed",
        description: "Could not initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const isSubscribed = user.subscriptionStatus === "active";
  const invoiceCredits = user.invoiceCredits || 0;

  const pricingPlans = [
    {
      name: "Pay Per Invoice",
      price: "₹2",
      originalPrice: "₹19",
      savings: "Save ₹17",
      period: "per invoice",
      description: "Perfect for occasional invoicing",
      features: [
        "Access all premium themes",
        "1 Invoice Download",
        "All templates available",
        "Basic customization",
      ],
      planType: "single" as const,
      cta: "Get Started",
      icon: Receipt,
      gradient: "from-emerald-500 to-teal-600",
      popular: false,
      badge: "🎉 NEW YEAR OFFER",
    },
    {
      name: "Monthly Pro",
      price: "₹399",
      period: "per month",
      description: "Perfect for growing businesses",
      features: [
        "All Premium templates",
        "Unlimited invoices",
        "Advanced customization",
        "Priority support",
      ],
      planType: "monthly" as const,
      cta: "Subscribe Now",
      icon: Zap,
      gradient: "from-indigo-500 to-purple-600",
      popular: true,
    },
    {
      name: "Yearly Pro",
      price: "₹3,999",
      period: "per year",
      originalPrice: "₹4,788",
      savings: "Save ₹789",
      description: "Best value for professionals",
      features: [
        "Everything in Monthly Pro",
        "2 months free",
        "Early access to features",
        "Analytics (coming soon)",
      ],
      planType: "yearly" as const,
      cta: "Subscribe Now",
      icon: Crown,
      gradient: "from-amber-500 to-orange-600",
      popular: false,
      badge: "BEST VALUE",
    },
  ];

  // Page header for AppLayout
  const pageHeader = (
    <div className="text-center max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
        {isSubscribed ? "Your Subscription" : "Choose Your Plan"}
      </h1>
      <p className="text-muted-foreground">
        {isSubscribed
          ? "Manage your subscription and enjoy unlimited access to all premium features."
          : "Unlock premium templates and create unlimited professional invoices."}
      </p>
    </div>
  );

  return (
    <AppLayout pageHeader={pageHeader}>
      <div className="space-y-8">
        {isSubscribed ? (
          // Active Subscription Card
          <Card className="max-w-2xl mx-auto shadow-2xl border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <Badge className="mb-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Pro Subscription
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You have full access to all premium templates and unlimited invoice creation.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Plan</p>
                      <p className="font-semibold text-foreground">
                        {user.subscriptionTier === "yearly" ? "Yearly Pro" : "Monthly Pro"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Price</p>
                      <p className="font-semibold text-foreground">
                        {user.subscriptionTier === "yearly" ? "₹3,999/year" : "₹399/month"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Invoice Credits Banner */}
            {invoiceCredits > 0 && (
              <div className="max-w-4xl mx-auto mb-8">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <CreditCard className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">
                          {invoiceCredits} Invoice Credit{invoiceCredits !== 1 ? "s" : ""} Available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Use them to download invoices with premium templates.
                        </p>
                      </div>
                      <Badge className="text-lg px-4 py-2 bg-blue-600 text-white border-0">
                        {invoiceCredits}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Pricing Cards */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${plan.popular
                    ? "ring-2 ring-indigo-500 scale-105 bg-white dark:bg-slate-800"
                    : plan.badge
                      ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20"
                      : "border-slate-200 dark:border-slate-700"
                    }`}
                >
                  {/* Top Gradient Bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${plan.gradient}`} />

                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  {plan.popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-indigo-600 text-white border-0 text-xs">
                        POPULAR
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 pt-8">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {plan.period}
                        </span>
                      </div>
                      {plan.originalPrice && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground line-through">
                            {plan.originalPrice}
                          </span>
                          <Badge variant="secondary" className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30">
                            {plan.savings}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      className={`w-full ${plan.popular
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        : plan.planType === "yearly"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                          : ""
                        }`}
                      variant={plan.planType === "single" ? "outline" : "default"}
                      size="lg"
                      onClick={() => handlePayment(plan.planType)}
                      disabled={!isRazorpayLoaded || isLoading}
                    >
                      {isRazorpayLoaded ? (
                        <>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="max-w-3xl mx-auto mt-12">
              <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">Instant Access</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@lomerse.com"
              className="font-medium text-indigo-600 hover:underline"
            >
              support@lomerse.com
            </a>
          </p>
          <div className="flex items-center justify-center gap-2">
            <img
              src="https://razorpay.com/assets/razorpay-logo.svg"
              alt="Razorpay"
              className="h-5 opacity-50"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-xs text-muted-foreground">
              Powered by Razorpay
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}