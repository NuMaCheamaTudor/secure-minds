import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Brain, Heart, Activity, ArrowRight } from "lucide-react";

const MOCK_THERAPISTS = [
  {
    id: "t1",
    name: "Dr. Andrei Popescu",
    specialty: "Psihoterapie CBT",
    languages: ["ro", "en"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  },
  {
    id: "t2",
    name: "Dr. Ioana Ionescu",
    specialty: "Psihiatrie",
    languages: ["ro"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
  },
  {
    id: "t3",
    name: "Dr. Maria Popa",
    specialty: "Psihoterapie Integrativă",
    languages: ["ro", "en", "fr"],
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
  },
];

export default function Triage() {
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState([5]);
  const [duration, setDuration] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast({
        title: "Completează formularul",
        description: "Te rugăm să descrii ce te preocupă.",
        variant: "destructive",
      });
      return;
    }

    setShowResults(true);
    toast({
      title: "Am găsit specialiști pentru tine",
      description: "Iată câțiva terapeuți care te pot ajuta.",
    });

    // After triage, redirect to dashboard based on role
    setTimeout(() => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.role === "doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch {
        navigate("/dashboard");
      }
    }, 1500);
  };

  if (showResults) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setShowResults(false)}
              className="mb-4"
            >
              ← Înapoi
            </Button>
            <h1 className="text-3xl font-bold mb-2">Specialiști recomandați</h1>
            <p className="text-muted-foreground">
              Pe baza informațiilor tale, am selectat acești terapeuți
            </p>
          </div>

          <div className="grid gap-4 mb-6">
            {MOCK_THERAPISTS.map((therapist) => (
              <Card
                key={therapist.id}
                className="calm-card p-6 hover-lift cursor-pointer"
                onClick={() => navigate(`/chat/${therapist.id}`)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{therapist.name}</h3>
                        <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{therapist.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span>Limbă:</span>
                      {therapist.languages.map((lang) => (
                        <span key={lang} className="px-2 py-0.5 bg-primary-soft rounded-md text-primary-foreground">
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Vorbește cu agentul AI
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="calm-card p-6">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Ai nevoie de ajutor imediat?</p>
                <p className="text-muted-foreground">
                  Pentru urgențe medicale, sună <span className="font-bold text-destructive">112</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/10 via-background to-primary/5">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-soft mb-4">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Am o problemă</h1>
          <p className="text-muted-foreground">
            Descrie-ne ce te preocupă și te vom conecta cu specialistul potrivit
          </p>
        </div>

        <Card className="calm-card p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Symptoms */}
            <div className="space-y-2">
              <Label htmlFor="symptoms" className="text-base">
                Ce simptom sau preocupare ai?
              </Label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Descrie ce te preocupă... (ex: anxietate, tristețe, stres, probleme de somn)"
                className="w-full min-h-32 p-3 rounded-lg border bg-background resize-none"
                required
              />
            </div>

            {/* Severity */}
            <div className="space-y-4">
              <Label className="text-base">Cât de intens este?</Label>
              <div className="space-y-2">
                <Slider
                  value={severity}
                  onValueChange={setSeverity}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Ușor</span>
                  <span className="font-medium text-primary">Nivel: {severity[0]}/10</span>
                  <span>Foarte intens</span>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-base">
                De cât timp te confrunți cu asta?
              </Label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border bg-background"
                required
              >
                <option value="">Selectează...</option>
                <option value="recent">Recent (câteva zile)</option>
                <option value="weeks">Câteva săptămâni</option>
                <option value="months">Câteva luni</option>
                <option value="long">Mai mult de 6 luni</option>
              </select>
            </div>

            {/* Quick suggestions */}
            <div className="space-y-3">
              <Label className="text-base">Sau alege o categorie comună:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSymptoms("Anxietate și gânduri excesive")}
                  className="calm-card p-4 hover-lift text-left"
                >
                  <Brain className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm font-medium">Anxietate</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSymptoms("Tristețe persistentă și lipsă de energie")}
                  className="calm-card p-4 hover-lift text-left"
                >
                  <Heart className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm font-medium">Depresie</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSymptoms("Stres intens și copleșire")}
                  className="calm-card p-4 hover-lift text-left"
                >
                  <Activity className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm font-medium">Stres</div>
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base">
              Găsește specialist
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
