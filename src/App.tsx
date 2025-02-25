
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

function App() {
  // Create QueryClient instance inside component using useRef instead of useState
  const queryClient = React.useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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

