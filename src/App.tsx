import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Splash from "./pages/Splash";
import Triage from "./pages/Triage";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import TherapistDetails from "./pages/TherapistDetails";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import Dashboard from "./pages/Dashboard";
import OnlineDoctors from "./pages/OnlineDoctors";
import Appointments from "./pages/Appointments";
import Account from "./pages/Account";
import Sidebar from "@/components/Sidebar";

const queryClient = new QueryClient();

function AppShell() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">("patient");
  const isLoggedIn = Boolean(user);
  const role = isLoggedIn ? user?.role : selectedRole;

  const location = useLocation();
  const hideSidebar = ["/splash", "/triage"].includes(location.pathname); // ascunde sidebar pe onboarding

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {isLoggedIn && !hideSidebar && <Sidebar key={user?.role} role={role} />}
      <main className="flex-1 w-full">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* Onboarding – accesibil indiferent dacă ești logat sau nu */}
          <Route path="/splash" element={<Splash />} />
          <Route path="/triage" element={<Triage />} />

          {/* Shared chat */}
          <Route path="/chat/:therapistId" element={<Chat />} />

          {/* Doctor */}
          {isLoggedIn && role === "doctor" && (
            <>
              <Route path="/doctor/details" element={<TherapistDetails />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            </>
          )}

          {/* Patient */}
          {isLoggedIn && role === "patient" && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/online-doctors" element={<OnlineDoctors />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/account" element={<Account />} />
            </>
          )}

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
