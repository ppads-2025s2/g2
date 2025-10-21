import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Agendar from "./pages/Agendar";
import Reservas from "./pages/Reservas";
import Impressao3D from "./pages/Impressao3D";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex w-full">
          <AppSidebar />
          <main className="flex-1 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agendar" element={<Agendar />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/impressao3d" element={<Impressao3D />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
