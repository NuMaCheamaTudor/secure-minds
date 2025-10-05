import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Calendar, User, Stethoscope, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  role: "patient" | "doctor" | undefined;
};

export default function HamburgerMenu({ role = "patient" }: Props) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const close = () => setOpen(false);

  const patientItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/online-doctors", label: "Doctori online", icon: Stethoscope },
    { to: "/appointments", label: "Programări", icon: Calendar },
    { to: "/tratamente", label: "Tratamente", icon: ClipboardList }, // 👈 NOU
    { to: "/account", label: "Contul meu", icon: User },
  ];

  const doctorItems = [
    { to: "/doctor/dashboard", label: "Dashboard", icon: Home },
    { to: "/doctor/appointments", label: "Programări", icon: Calendar },
    { to: "/doctor/details", label: "Editează profil", icon: User },
  ];

  const items = role === "doctor" ? doctorItems : patientItems;

  return (
    <>
      {/* Topbar */}
      <div className="w-full h-14 border-b flex items-center px-3 gap-3 bg-background/80 backdrop-blur sticky top-0 z-30">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Deschide meniul">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="font-semibold">MindCare</div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r z-50 p-3 flex flex-col"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="flex items-center justify-between h-12">
                <div className="font-semibold">Meniu</div>
                <Button variant="ghost" size="icon" onClick={close} aria-label="Închide meniul">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="mt-2 space-y-1">
                {items.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={close}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        active ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="mt-auto p-2 text-xs text-muted-foreground">
                © {new Date().getFullYear()} MindCare
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
