import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MessageCircle,
  Stethoscope,
  Calendar,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HamburgerMenuProps {
  role: "patient" | "doctor";
}

export default function HamburgerMenu({ role }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/", { replace: true });
    setIsOpen(false);
  };

  const patientLinks = [
    { to: "/dashboard", icon: MessageCircle, label: "Chatbot" },
    { to: "/online-doctors", icon: Stethoscope, label: "Doctori Online" },
    { to: "/appointments", icon: Calendar, label: "Programări" },
    { to: "/account", icon: User, label: "Cont" },
  ];

  const doctorLinks = [
    { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/doctor/appointments", icon: Calendar, label: "Programări" },
    { to: "/doctor/details", icon: User, label: "Profil" },
  ];

  const links = role === "patient" ? patientLinks : doctorLinks;

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Închide meniu" : "Deschide meniu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 h-full w-64 bg-card border-r shadow-xl z-40 flex flex-col"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-primary">MindCare</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {role === "patient" ? "Pacient" : "Doctor"}
              </p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted"
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Deconectare</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
