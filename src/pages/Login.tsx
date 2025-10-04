import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Heart } from "lucide-react";

type Role = "patient" | "doctor";
type StoredUser = {
  id: string;
  email: string;
  password: string;
  role: Role;
  fullName?: string;
};

// -- helpers simple pe localStorage -----------------
const USERS_KEY = "users";
function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function findByEmail(email: string) {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}
// ---------------------------------------------------

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (isLogin) {
        // --- AUTHENTICARE ---
        const user = findByEmail(email);
        if (!user) {
          toast({ title: "Utilizator inexistent", variant: "destructive" });
          return;
        }
        if (user.password !== password) {
          toast({ title: "Parolă incorectă", variant: "destructive" });
          return;
        }

        // persistă sesiunea curentă
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));

        toast({ title: "Bine ai revenit!" });

        if (user.role === "doctor") navigate("/doctor/dashboard");
        else navigate("/dashboard");
      } else {
        // --- ÎNREGISTRARE ---
        const exists = findByEmail(email);
        if (exists) {
          toast({ title: "Email deja folosit", variant: "destructive" });
          return;
        }

        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          email,
          password,
          role,
        };
        const list = readUsers();
        list.push(newUser);
        writeUsers(list);

        // auto-login după înregistrare
        localStorage.setItem("user", JSON.stringify(newUser));
        window.dispatchEvent(new Event("storage"));

        toast({ title: "Cont creat cu succes!" });

        // Flow-ul cerut
        if (role === "patient") {
          navigate("/splash", { state: { next: "/dashboard" } });
        } else {
          navigate("/doctor/details");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-lg animate-fade-in-scale">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-calm mb-4 shadow-lg">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 text-primary">MindCare</h1>
          <p className="text-lg text-muted-foreground font-medium">
            Sprijin psihologic accesibil pentru toți
          </p>
        </div>

        <Card className="calm-card p-8 space-y-8 shadow-2xl">
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-2">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg soft-transition font-semibold text-base ${
                isLogin ? "bg-card shadow-md text-primary" : "hover:bg-card/50 text-muted-foreground"
              }`}
            >
              Autentificare
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg soft-transition font-semibold text-base ${
                !isLogin ? "bg-card shadow-md text-primary" : "hover:bg-card/50 text-muted-foreground"
              }`}
            >
              Înregistrare
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Parolă</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="font-semibold">Tipul contului</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full h-12 px-3 rounded-lg border bg-background text-base"
                disabled={isLogin} // la login rolul este determinat de userul din baza de date
              >
                <option value="patient">Pacient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md" disabled={loading}>
              {loading ? "Se procesează..." : isLogin ? "Intră în cont" : "Creează cont"}
            </Button>
          </form>

          <div className="flex items-center gap-3 p-4 bg-primary-soft rounded-lg mt-2 shadow">
            <Shield className="w-6 h-6 text-primary" />
            <p className="text-base text-primary-foreground/80 font-medium">
              Datele tale sunt protejate și confidențiale
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
