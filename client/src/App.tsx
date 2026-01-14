import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Subscription from "@/pages/subscription";
import NotFound from "@/pages/not-found";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";
import InvoicingGuidesPage from "./pages/InvoicingGuidesPage";
import AccountBillingPage from "./pages/AccountBillingPage";
import DocumentationPage from "./pages/DocumentationPage";
import ReportsPage from "./pages/ReportsPage";

// Settings context
import { SettingsProvider } from "./contexts/SettingsContext";

// --- Invoice Imports ---
import { InvoiceProvider } from "./contexts/InvoiceContext";
import InvoiceEditorPage from "./pages/InvoiceEditorPage";
import "./Editor.css"; // Import the main stylesheet

/**
 * Main application router. Handles protected and public routes.
 */
function Router(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Routes - only when NOT authenticated */}
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          {/* Redirect all other unknown routes to signin */}
          <Route>
            <Redirect to="/signin" />
          </Route>
        </>
      ) : (
        // Authenticated Routes
        <>
          {/* --- Core App Routes --- */}
          <Route path="/" component={Dashboard} />
          <Route path="/clients" component={ClientsPage} />
          <Route path="/clients/:id" component={ClientDetailPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/calendar" component={CalendarPage} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/reports" component={ReportsPage} />

          {/* --- Invoice Editor (New Unified Flow) --- */}
          <Route path="/create-invoice" component={InvoiceEditorPage} />

          {/* --- Old routes redirect to new editor --- */}
          <Route path="/choose-template">
            <Redirect to="/create-invoice" />
          </Route>
          <Route path="/choose-theme">
            <Redirect to="/create-invoice" />
          </Route>

          {/* --- Documentation Routes --- */}
          <Route path="/docs/invoicing" component={InvoicingGuidesPage} />
          <Route path="/docs/billing" component={AccountBillingPage} />
          <Route path="/docs" component={DocumentationPage} />
        </>
      )}
      {/* 404 Not Found page always last */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root application component. Sets up all global providers.
 */
export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          {/* Wrap the Router with InvoiceProvider.
            This makes the invoice context (template, theme, data) 
            available to all authenticated pages.
          */}
          <InvoiceProvider>
            <Router />
          </InvoiceProvider>
        </SettingsProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
