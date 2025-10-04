import { Link, useLocation } from "react-router-dom";

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <aside className="h-screen w-64 bg-card shadow-lg flex flex-col p-6 gap-4 fixed left-0 top-0 z-20">
      <h2 className="text-2xl font-bold mb-6">Secure Minds</h2>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`py-2 px-4 rounded-lg transition-colors font-medium ${location.pathname === item.path ? "bg-primary text-white" : "hover:bg-muted"}`}
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
    </aside>
  );
}
