import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Users, CalendarDays, User, LogOut } from "lucide-react";

type Role = "patient" | "doctor";
type MenuItem = { label: string; to: string; icon?: React.FC<any> };

const container = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } };

export default function HamburgerStaggeredMenu({
  open,
  onClose,
  role = "patient",
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  role?: Role;
  onLogout?: () => void;
}) {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const patientItems: MenuItem[] = [
    { label: "Chatbot", to: "/dashboard", icon: Bot },
    { label: "Online Doctors", to: "/online-doctors", icon: Users },
    { label: "Appointments", to: "/appointments", icon: CalendarDays },
    { label: "Account", to: "/account", icon: User },
  ];
  const doctorItems: MenuItem[] = [
    { label: "Dashboard", to: "/doctor/dashboard", icon: Bot },
    { label: "Appointments", to: "/doctor/appointments", icon: CalendarDays },
    { label: "Profil", to: "/doctor/details", icon: User },
  ];
  const items = role === "doctor" ? doctorItems : patientItems;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-0 top-0 h-full w-[280px] max-w-[80vw] bg-background z-50 shadow-2xl border-r"
            initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-lg font-semibold">Secure Minds</div>
              <button className="p-2 rounded-md hover:bg-muted" onClick={onClose} aria-label="Închide">
                <X className="w-5 h-5" />
              </button>
            </div>

            <motion.nav className="px-3 py-4 space-y-1" variants={container} initial="hidden" animate="visible">
              {items.map(({ label, to, icon: Icon }, idx) => {
                const active = location.pathname === to || location.pathname.startsWith(to + "/");
                return (
                  <motion.div key={to} variants={item} custom={idx}>
                    <NavLink
                      to={to}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition
                        ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span className="text-sm font-medium">{label}</span>
                    </NavLink>
                  </motion.div>
                );
              })}

              {onLogout && (
                <motion.div variants={item}>
                  <button
                    onClick={() => { onLogout(); onClose(); }}
                    className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </motion.nav>

            <div className="mt-auto p-4 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Secure Minds
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
