
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
import * as React from 'react';
import { supabase } from "./integrations/supabase/client";
import { Navbar } from "./components/Navbar";

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
          <div className="min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} />
            <div className="container pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/setup" element={<PreMatchSetup />} />
                <Route path="/match-arena" element={<MatchArena />} />
                <Route path="/match-summary" element={<MatchSummary />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

