import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  BookOpen,
  Search,
  FileText,
  CreditCard,
  ChevronRight,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";

const faqs = [
  {
    question: "How do I create a new invoice?",
    answer: "Click the 'Create Invoice' icon in the dock. You'll first select a template, then a theme, and finally edit your invoice in the editor.",
  },
  {
    question: "How can I add my company logo?",
    answer: "In the invoice editor, click the 'Upload Logo' button in the header to add your company logo to all invoices.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and UPI payments through our secure Razorpay integration.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription anytime from the Subscription page. You'll retain access until the end of your billing period.",
  },
  {
    question: "How do I download my invoice as PDF?",
    answer: "After creating your invoice in the editor, click the 'Download PDF' button to save it to your device.",
  },
];

interface HelpCategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
  href: string;
  gradient: string;
}

function HelpCategoryCard({ icon: Icon, title, description, linkText, href, gradient }: HelpCategoryCardProps) {
  return (
    <Card className="flex flex-col rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full justify-between rounded-xl">
            {linkText}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function HelpPage() {
  // Consistent page header with gradient icon
  const HelpPageHeader = (
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
        <HelpCircle className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Help Center</h1>
        <p className="text-sm text-muted-foreground">Find answers, guides, and contact support</p>
      </div>
    </div>
  );

  return (
    <AppLayout pageHeader={HelpPageHeader}>
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for answers (e.g., 'how to add logo')"
            className="w-full pl-12 h-12 text-base rounded-xl border-2 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <HelpCategoryCard
          icon={FileText}
          title="Invoicing Guides"
          description="Learn how to create, send, and manage your invoices."
          linkText="See all guides"
          href="/docs/invoicing"
          gradient="from-blue-500 to-indigo-600"
        />
        <HelpCategoryCard
          icon={CreditCard}
          title="Account & Billing"
          description="Manage your subscription, payment methods, and profile."
          linkText="Manage billing"
          href="/subscription"
          gradient="from-emerald-500 to-teal-600"
        />
        <HelpCategoryCard
          icon={BookOpen}
          title="Documentation"
          description="Browse the complete user documentation."
          linkText="Read the docs"
          href="/docs"
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
          Frequently Asked Questions
        </h2>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b last:border-0">
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Contact CTA */}
      <Card className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-dashed">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">Still Need Help?</CardTitle>
          <CardDescription>
            Can't find the answer you're looking for? Our team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <a href="mailto:support@lomerse.com">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
              <Mail className="w-5 h-5" />
              Email Support
            </Button>
          </a>
        </CardContent>
      </Card>
    </AppLayout>
  );
}