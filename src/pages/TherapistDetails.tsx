import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserCircle2 } from "lucide-react";

export default function TherapistDetails() {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details = { name, specialization, experience, bio, city };
    localStorage.setItem("doctorDetails", JSON.stringify(details));
    toast({
      title: "Profil salvat!",
      description: "Detaliile tale au fost salvate cu succes.",
    });
    navigate("/doctor/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="w-full max-w-lg animate-fade-in-scale">
        <Card className="calm-card p-8 space-y-8 shadow-xl">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-primary rounded-full p-4 mb-2">
              <UserCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-center">
              Editează detaliile contului
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              Completează sau actualizează informațiile tale pentru ca pacienții să
              te poată găsi mai ușor.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nume complet</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Numele tău"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specializare</Label>
              <Input
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                placeholder="Ex: Psihoterapie cognitiv-comportamentală"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Oraș</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Ex: București"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Ani de experiență</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                placeholder="Ex: 5"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Descriere scurtă</Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Scrie câteva cuvinte despre tine"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
            >
              Salvează modificările
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

