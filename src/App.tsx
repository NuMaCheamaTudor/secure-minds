import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import InitialSplash from "./pages/InitialSplash";
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
import DoctorProfile from "./pages/DoctorProfile";
import Tratamente from "./pages/Tratamente"; // dacă ai adăugat pagina nouă

import HamburgerMenu from "@/components/HamburgerMenu";

const queryClient = new QueryClient();

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showInitialSplash, setShowInitialSplash] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const isLoggedIn = Boolean(user);
  const role: "patient" | "doctor" | undefined = user?.role;

  // ascundem meniul pe ecranele publice/onboarding
  const hideMenu = ["/", "/splash", "/triage"].includes(location.pathname);

  // Splash inițial: după timeout mergem la "/" DOAR dacă NU există user
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialSplash(false);
      const stored = localStorage.getItem("user");
      if (!stored) {
        navigate("/", { replace: true }); // Login/Register — flow vechi
      }
      // Dacă există user, NU facem navigate aici — lăsăm restul flow-ului să decidă
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  // ținem userul sincronizat
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

  if (showInitialSplash) {
    return <InitialSplash />;
  }

  return (
    // Important: layout pe coloană, nu pe rând
    <div className="min-h-screen w-full flex flex-col">
      {/* Topbar + Drawer nu mai ocupă spațiu lateral; nu shift-ează conținutul */}
      {isLoggedIn && !hideMenu && <HamburgerMenu role={role || "patient"} />}

      {/* Conținutul rămâne centrat pe pagină, cu lățime maximă controlată */}
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-5xl px-4">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />

            {/* Onboarding — accesibil oricând */}
            <Route path="/splash" element={<Splash />} />
            <Route path="/triage" element={<Triage />} />

            {/* Profil public doctor (pacienți) */}
            <Route path="/doctor/profile/:id" element={<DoctorProfile />} />

            {/* Chat comun */}
            <Route path="/chat/:therapistId" element={<Chat />} />

            {/* Doctor */}
            {isLoggedIn && role === "doctor" && (
              <>
                <Route path="/doctor/details" element={<TherapistDetails />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              </>
            )}

            {/* Pacient */}
            {isLoggedIn && role === "patient" && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/online-doctors" element={<OnlineDoctors />} />
                <Route path="/appointments" element={<Appointments />} />
                {/* Include Tratamente doar dacă ai pagina creată */}
                <Route path="/tratamente" element={<Tratamente />} />
                <Route path="/account" element={<Account />} />
              </>
            )}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
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
