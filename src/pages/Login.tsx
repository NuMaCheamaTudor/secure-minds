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
  const [role, setRole] = useState<"patient" | "therapist" | "admin">("patient");
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
      navigate("/dashboard");
    } else if (role === "therapist") {
      navigate("/therapist/dashboard");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="w-full max-w-md animate-fade-in-scale">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-calm mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">MindCare</h1>
          <p className="text-muted-foreground">Sprijin psihologic accesibil pentru toți</p>
        </div>

        <Card className="calm-card p-6 space-y-6">
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg soft-transition ${
                isLogin ? "bg-card shadow-sm" : "hover:bg-card/50"
              }`}
            >
              Autentificare
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg soft-transition ${
                !isLogin ? "bg-card shadow-sm" : "hover:bg-card/50"
              }`}
            >
              Înregistrare
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Tipul contului</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-lg border bg-background"
                >
                  <option value="patient">Pacient</option>
                  <option value="therapist">Terapeut</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            <Button type="submit" className="w-full h-11">
              {isLogin ? "Intră în cont" : "Creează cont"}
            </Button>
          </form>

          <div className="flex items-center gap-2 p-3 bg-primary-soft rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
            <p className="text-sm text-primary-foreground/80">
              Datele tale sunt protejate și confidențiale
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
