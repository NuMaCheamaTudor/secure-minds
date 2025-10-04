
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
const navItems = [
  { path: "/dashboard", label: "Chatbot" },
  { path: "/online-doctors", label: "Online Doctors" },
  { path: "/appointments", label: "Appointments" },
];
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/");
  };

  // Sidebar content
  const sidebarContent = (
    <>
      <h2 className="text-2xl font-bold mb-6">Secure Minds</h2>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`py-2 px-4 rounded-lg transition-colors font-medium ${location.pathname === item.path ? "bg-primary text-white" : "hover:bg-muted"}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-center">
        {isLoggedIn ? (
          <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={handleLogin}>Login</Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Burger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-card p-2 rounded-lg shadow-lg"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg>
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar itself */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-card shadow-lg flex flex-col p-6 gap-4 z-40 transition-transform duration-300 md:static md:translate-x-0 md:flex md:h-screen md:w-64
          ${open ? "translate-x-0" : "-translate-x-full"} md:block`}
        style={{ minWidth: "16rem" }}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-muted"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
