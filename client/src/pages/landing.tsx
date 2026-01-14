import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/BorderBeam";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  FileText,
  Palette,
  Download,
  CreditCard,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import fileIcon from "../attached_assets/file.png";
import one from "../attached_assets/1.webp";
import two from "../attached_assets/2.webp";
import three from "../attached_assets/3.webp";
import four from "../attached_assets/4.webp";

import Marquee from "@/components/Marquee"; // Marquee component ko import kiya
// import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";
export default function Landing() {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Beautiful Templates",
      description: "Choose from 13 professionally designed invoice templates",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Brand Customization",
      description: "Customize colors, fonts, and styles to match your brand",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Instant Download",
      description: "Generate and download PDF invoices in seconds",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Flexible Pricing",
      description: "Pay per invoice or subscribe for unlimited access",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create professional invoices in under a minute",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Your data is encrypted and safely stored",
    },
  ];

  const pricingTiers = [
    {
      name: "Pay Per Invoice",
      price: "₹19",
      period: "per invoice",
      description: "Perfect for occasional invoicing",
      features: [
        "All basic themes (4 themes)",
        "PDF download",
        "Editable fields",
        "Basic customization",
      ],
      cta: "Get Started",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Monthly Pro",
      price: "₹399",
      period: "per month",
      description: "Best for growing businesses",
      features: [
        "All basic themes (4 themes)",
        "Premium dark themes (3 themes)",
        "Professional themes (4 themes)",
        "Curated themes (5 themes)",
        "Unlimited invoices",
        "Priority support",
        "Advanced customization",
      ],
      cta: "Start Free Trial",
      variant: "default" as const,
      popular: true,
    },
    {
      name: "Yearly Pro",
      price: "₹3,999",
      period: "per year",
      description: "Save ₹800 annually",
      features: [
        "Everything in Monthly Pro",
        "2 months free",
        "Priority email support",
        "Early access to new themes",
        "Invoice analytics (coming soon)",
      ],
      cta: "Get Best Value",
      variant: "default" as const,
      popular: false,
      badge: "BEST VALUE",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-2 mx-auto rounded-full z-50 w-3/4  ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <FileText className="w-8 h-8 text-primary" /> */}
              <img
                src={fileIcon}
                alt="File Icon"
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-bold font-[Poppins] text-foreground">
                Lomerse
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#themes"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Themes
              </a>
            </nav>
            <Button asChild data-testid="button-login">
              <a href="/signin">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm font-medium">
                  Trusted by 1000+ businesses
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[Poppins] text-foreground leading-tight">
                  Create Beautiful Invoices in Seconds
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Professional invoice templates with stunning designs. Choose
                  your theme, customize your brand, and download instantly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="text-base"
                  data-testid="button-hero-start"
                >
                  <a href="/signin">Start Creating Free</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base"
                  data-testid="button-hero-pricing"
                >
                  <a href="#pricing">View Pricing</a>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Free themes included</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 shadow-2xl bg-[length:100%_50%] 
  animate-gradient"
              >
                <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Sample Invoice
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Professional Theme
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Invoice #0001
                      </span>
                      <span className="text-foreground font-medium">
                        15 Oct 2025
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Client</span>
                      <span className="text-foreground font-medium">
                        Acme Corp
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹12,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] text-foreground mb-4">
              Everything You Need to Invoice Professionally
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to make invoicing fast, easy, and
              beautiful
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover-elevate transition-all duration-300"
                data-testid={`card-feature-${index}`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Showcase Section */}
      <section id="themes" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] text-foreground mb-4">
              Beautiful Themes for Every Brand
            </h2>
            <p className="text-lg text-muted-foreground">
              From free basic themes to premium curated designs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Basic Theme Preview */}
            <Card
              className="p-6 space-y-4 border-primary/50"
              data-testid="card-theme-basic"
            >
              <div
                className="aspect-[3/4] bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg flex items-center justify-center bg-[length:100%_50%] 
  animate-gradient "
              >
                {/* <FileText className="w-16 h-16 text-yellow-600" />
                
              */}
                <img
                  src={one}
                  alt="Theme Preview"
                  className="w-100% h-100% object-contain rounded-lg shadow-md "
                />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Free
                </Badge>
                <h3 className="font-semibold text-foreground">Basic Themes</h3>
                <p className="text-sm text-muted-foreground">
                  4 color variations
                </p>
              </div>
            </Card>

            {/* Premium Dark Theme Preview */}
            <Card
              className="p-6 space-y-4 border-primary/50"
              data-testid="card-theme-premium"
            >
              <div
                className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative  bg-[length:100%_50%] 
  animate-gradient"
              >
                {/* <FileText className="w-16 h-16 text-gray-200" /> */}
                <img
                  src={four}
                  alt="Theme Preview"
                  className="w-100% h-100% object-contain rounded-lg shadow-md"
                />
                <Star className="absolute top-2 right-2 w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <Badge className="mb-2">Premium</Badge>
                <h3 className="font-semibold text-foreground">Dark Themes</h3>
                <p className="text-sm text-muted-foreground">
                  3 sophisticated variants
                </p>
              </div>
            </Card>

            {/* Professional Theme Preview */}
            <Card
              className="p-6 space-y-4 border-primary/50"
              data-testid="card-theme-professional"
            >
              <div
                className="aspect-[3/4] bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg flex items-center justify-center relative bg-[length:100%_50%] 
  animate-gradient"
              >
                {/* <FileText className="w-16 h-16 text-teal-600" /> */}
                <img
                  src={two}
                  alt="Theme Preview"
                  className="w-100% h-100% object-contain rounded-lg shadow-md"
                />

                <Star className="absolute top-2 right-2 w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <Badge className="mb-2">Professional</Badge>
                <h3 className="font-semibold text-foreground">
                  Professional Themes
                </h3>
                <p className="text-sm text-muted-foreground">
                  4 elegant designs
                </p>
              </div>
            </Card>

            {/* Curated Theme Preview */}
            <Card
              className="p-6 space-y-4 border-primary/50 "
              data-testid="card-theme-curated "
            >
              <div
                className="aspect-[3/4] bg-gradient-to-br from-rose-100 via-blue-100 to-green-100 rounded-lg flex items-center justify-center relative bg-[length:200%_100%] 
  animate-gradient  "
              >
                {/* <FileText className="w-16 h-16 text-rose-600" /> */}
                <img
                  src={three}
                  alt="Theme Preview"
                  className="w-100% h-100% object-contain rounded-lg shadow-md"
                />
                <Star className="absolute top-2 right-2 w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <Badge className="mb-2">Curated</Badge>
                <h3 className="font-semibold text-foreground">
                  Curated Themes
                </h3>
                <p className="text-sm text-muted-foreground">
                  5 unique combinations
                </p>
              </div>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild data-testid="button-unlock-themes">
              <a href="/signin">Unlock All Themes</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that works best for your business
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`p-8 space-y-6 relative ${tier.popular ? "" : ""
                  }transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-xl hover:border-primary
  
  `}
                data-testid={`card-pricing-${index}`}
              >
                {tier.badge && (
                  <Badge className="absolute -top-3 left 1/2 ">
                    {tier.badge}
                  </Badge>
                )}

                {tier.popular && (
                  <Badge className="absolute -top-3 ">MOST POPULAR</Badge>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground">
                      / {tier.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.variant}
                  className="w-full"
                  size="lg"
                  asChild
                  data-testid={`button-pricing-${index}`}
                >
                  <a href="/signin">{tier.cta}</a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 md:py-32  text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] text-black mb-4">
              Loved by Freelancers & Businesses
            </h2>
            <p className="text-lg text-gray-400">
              Hear what our users are saying about Lomerse.
            </p>
          </div>
        </div>

        {/* Yahaan Marquee component ko use kiya gaya hai */}
        <Marquee />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- Top Section: Links --- */}
          <div className="grid md:grid-cols-5 gap-8">
            {/* Col 1: Brand (takes 2 columns) */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                {/* <FileText className="w-7 h-7 text-primary" /> */}
                {/* ✅ Larger, bolder logo text */}
                <img
                  src={fileIcon}
                  alt="Theme Preview"
                  className="w-7 h-7"

                />
                <span className="text-2xl font-bold font-[Poppins]">
                  Lomerse
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Professional invoice generation made simple and beautiful.
              </p>
            </div>

            {/* Col 2: Product */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {/* ✅ Hover effect now uses primary color */}
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-primary transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#themes"
                    className="hover:text-primary transition-colors"
                  >
                    Themes
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* --- Bottom Section: Copyright & Socials --- */}
          <div
            className="border-t border-border mt-12 pt-8 
      flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between 
      gap-6 text-sm text-muted-foreground"
          >
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Lomerse Company. All rights
              reserved.
            </p>

            {/* ✅ Social Icons Section */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <a href="#" aria-label="Github">
                <Button variant="ghost" size="icon">
                  <Github className="w-5 h-5" />
                </Button>
              </a>
              <a href="#" aria-label="Twitter">
                <Button variant="ghost" size="icon">
                  <Twitter className="w-5 h-5" />
                </Button>
              </a>
              <a href="#" aria-label="LinkedIn">
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
