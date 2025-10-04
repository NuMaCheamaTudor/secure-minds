import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Video, Phone, Shield } from "lucide-react";

export default function Splash() {
  const [anxietyLevel, setAnxietyLevel] = useState([3]);
  const [communicationPrefs, setCommunicationPrefs] = useState<string[]>(["chat"]);
  const [visitPurpose, setVisitPurpose] = useState("");
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast({
        title: "Consimțământ necesar",
        description: "Te rugăm să accepți termenii pentru a continua.",
        variant: "destructive",
      });
      return;
    }

    const preferences = {
      anxietyLevel: anxietyLevel[0],
      communicationPrefs,
      visitPurpose,
      consent,
    };

    localStorage.setItem("patientPreferences", JSON.stringify(preferences));
    
    toast({
      title: "Preferințe salvate!",
      description: "Acum te vom ajuta să găsești specialistul potrivit.",
    });
    
    navigate("/triage");
  };

  const togglePref = (pref: string) => {
    setCommunicationPrefs(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/10 via-background to-primary/5">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bine ai venit!</h1>
          <p className="text-muted-foreground">
            Hai să te cunoaștem mai bine pentru a-ți oferi cea mai bună experiență
          </p>
        </div>

        <Card className="calm-card p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anxiety Level */}
            <div className="space-y-4">
              <Label className="text-base">
                Cum te simți astăzi în legătură cu interacțiunile sociale?
              </Label>
              <div className="space-y-2">
                <Slider
                  value={anxietyLevel}
                  onValueChange={setAnxietyLevel}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Confortabil</span>
                  <span className="font-medium text-primary">Nivel: {anxietyLevel[0]}/5</span>
                  <span>Foarte anxios</span>
                </div>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="space-y-4">
              <Label className="text-base">Cum preferi să comunici?</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => togglePref("chat")}
                  className={`calm-card p-4 hover-lift cursor-pointer ${
                    communicationPrefs.includes("chat") ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <MessageCircle className={`w-6 h-6 mb-2 ${
                    communicationPrefs.includes("chat") ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <div className="text-sm font-medium">Chat</div>
                </button>

                <button
                  type="button"
                  onClick={() => togglePref("audio")}
                  className={`calm-card p-4 hover-lift cursor-pointer ${
                    communicationPrefs.includes("audio") ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Phone className={`w-6 h-6 mb-2 ${
                    communicationPrefs.includes("audio") ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <div className="text-sm font-medium">Audio</div>
                </button>

                <button
                  type="button"
                  onClick={() => togglePref("video")}
                  className={`calm-card p-4 hover-lift cursor-pointer ${
                    communicationPrefs.includes("video") ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Video className={`w-6 h-6 mb-2 ${
                    communicationPrefs.includes("video") ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <div className="text-sm font-medium">Video</div>
                </button>
              </div>
            </div>

            {/* Visit Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-base">
                Ce te-a adus aici? (opțional)
              </Label>
              <textarea
                id="purpose"
                value={visitPurpose}
                onChange={(e) => setVisitPurpose(e.target.value)}
                placeholder="Poți împărtăși cu noi ce te preocupă..."
                className="w-full min-h-24 p-3 rounded-lg border bg-background resize-none"
              />
            </div>

            {/* Consent */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-primary-soft rounded-lg">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm space-y-2">
                  <p className="font-medium text-primary-foreground">
                    Informații importante despre siguranța ta
                  </p>
                  <ul className="space-y-1 text-primary-foreground/80">
                    <li>• Agentul AI nu oferă diagnostice medicale</li>
                    <li>• Pentru urgențe, sună 112</li>
                    <li>• Conversația este monitorizată pentru siguranța ta</li>
                    <li>• Terapeutul poate interveni oricând</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-sm cursor-pointer">
                  Înțeleg și accept că serviciul nu înlocuiește consultația medicală profesională.
                  Sunt de acord cu procesarea datelor mele conform politicii de confidențialitate.
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base">
              Continuă
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
