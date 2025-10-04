import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Heart } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication
    const user = {
      id: Math.random().toString(),
      email,
      role,
    };

    localStorage.setItem("user", JSON.stringify(user));

    toast({
      title: "Bine ai venit!",
      description: "Te-ai autentificat cu succes.",
    });

    // Redirect based on role
    if (role === "patient") {
      navigate("/splash");
    } else if (role === "doctor") {
      if (!isLogin) {
        navigate("/doctor/details");
      } else {
        navigate("/doctor/dashboard");
      }
      navigate("/dashboard");
    } else if (role === "therapist") {
      navigate("/therapist/dashboard");
    } else {
      navigate("/admin");
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
                isLogin
                  ? "bg-card shadow-md text-primary"
                  : "hover:bg-card/50 text-muted-foreground"
              }`}
            >
              Autentificare
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg soft-transition font-semibold text-base ${
                !isLogin
                  ? "bg-card shadow-md text-primary"
                  : "hover:bg-card/50 text-muted-foreground"
              }`}
            >
              Înregistrare
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
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
              <Label htmlFor="password" className="font-semibold">
                Parolă
              </Label>
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

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role" className="font-semibold">
                  Tipul contului
                </Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-12 px-3 rounded-lg border bg-background text-base"
                >
                  <option value="patient">Pacient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-md"
            >
              {isLogin ? "Intră în cont" : "Creează cont"}
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
