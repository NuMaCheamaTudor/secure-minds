import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HamburgerMenuProps {
  role: "patient" | "doctor";
}

export default function HamburgerMenu({ role }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setOpen(!open);

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/", { replace: true });
  };

  const menuItems =
    role === "doctor"
      ? [
          { name: "Dashboard", path: "/doctor/dashboard" },
          { name: "Programări", path: "/doctor/appointments" },
          { name: "Profilul meu", path: "/doctor/details" },
        ]
      : [
          { name: "Chatbot", path: "/dashboard" },
          { name: "Doctori Online", path: "/online-doctors" },
          { name: "Programări", path: "/appointments" },
          { name: "Tratamente", path: "/tratamente" },
          { name: "Contul meu", path: "/account" },
        ];

  return (
    <div className="relative z-50">
      {/* Butonul hamburger fix în colț */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="rounded-full bg-white/80 shadow-lg backdrop-blur-md hover:scale-105 transition-all"
        >
          {open ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-md shadow-xl border-r border-gray-200 p-6 flex flex-col justify-between"
          >
            {/* Meniu principal */}
            <div>
              <h2 className="text-xl font-bold mb-6 text-primary">Secure Minds</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-base font-medium transition-all ${
                      location.pathname === item.path
                        ? "bg-blue-100 text-primary font-semibold"
                        : "hover:bg-blue-50 text-gray-700"
                    }`}
                    whileHover={{ x: 6 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Logout fix jos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 border-t border-gray-200 pt-4"
            >
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
