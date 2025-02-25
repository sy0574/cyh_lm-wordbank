
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PreMatchSetup from "./pages/PreMatchSetup";
import MatchArena from "./pages/MatchArena";
import MatchSummary from "./pages/MatchSummary";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { UserNav } from "./components/UserNav";
import * as React from 'react';

function App() {
  const queryClient = React.useRef(new QueryClient());
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient.current}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated && (
            <div className="fixed top-4 right-4 z-50">
              <UserNav />
            </div>
          )}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/setup" element={<PreMatchSetup />} />
            <Route path="/match-arena" element={<MatchArena />} />
            <Route path="/match-summary" element={<MatchSummary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
