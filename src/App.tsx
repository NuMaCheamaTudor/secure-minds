import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Splash from "./pages/Splash";
import Triage from "./pages/Triage";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import OnlineDoctors from "./pages/OnlineDoctors";
import Appointments from "./pages/Appointments";

const queryClient = new QueryClient();

import Sidebar from "@/components/Sidebar";

const App = () => {
  const isLoggedIn = Boolean(localStorage.getItem("user"));
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Login />} />
                {isLoggedIn ? (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/online-doctors" element={<OnlineDoctors />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/chat/:therapistId" element={<Chat />} />
                    <Route path="*" element={<Dashboard />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Login />} />
                    <Route path="/splash" element={<Splash />} />
                    <Route path="/triage" element={<Triage />} />
                    <Route path="*" element={<Login />} />
                  </>
                )}
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
