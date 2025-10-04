import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// UI din proiectul tău (shadcn)
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";

// Utils
import { useToast } from "../hooks/use-toast";
import {
  MessageCircle,
  Video,
  Phone,
  Shield,
  Stethoscope,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Grafica & animații
import LottieHeroStep from "../components/graphics/LottieHeroStep";
import LottieBadge from "../components/graphics/LottieBadge";
import AnimatedBlobs from "../components/graphics/AnimatedBlobs";

// Lottie data – EXACT din src/assets/loottie (nume cu spații)
import doctorAndHealth from "../assets/loottie/Doctor and health symbols.json";
import doctor from "../assets/loottie/Doctor.json";
import healthInsurance from "../assets/loottie/health insurance.json";
import medicineOnline from "../assets/loottie/medicine online.json";
import mentalTherapy from "../assets/loottie/Mental Therapy.json";

// Text animat doar în header (nu în chestionar)
import { SplitTextTitle, ShinySubtitle } from "../components/ui/AnimatedText";
import ShinyButton from "../components/ui/ShinyButton";

export default function Splash() {
  const [step, setStep] = useState(0);
  const [anxietyLevel, setAnxietyLevel] = useState([3]);
  const [communicationPrefs, setCommunicationPrefs] = useState<string[]>(["chat"]);
  const [visitPurpose, setVisitPurpose] = useState("");
  const [specialistType, setSpecialistType] = useState<"medic" | "terapeut" | "nu_stiu">("nu_stiu");
  const [consent, setConsent] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // 👉 nextPath: dacă vii din înregistrare ca pacient, trimite către /dashboard
  // altfel păstrează comportamentul vechi (/triage)
  const nextPath = (location.state as any)?.next ?? "/dashboard";

  const steps = useMemo(
    () => [
      { key: "intro", title: "Bine ai venit!", subtitle: "Pornim încet, blând, cu pași mici." },
      { key: "comfort", title: "Cum te simți când discuți cu specialiști?", subtitle: "Alege nivelul tău de confort." },
      { key: "comms", title: "Cum preferi să comunici?", subtitle: "Poți selecta una sau mai multe opțiuni." },
      { key: "context", title: "Spune-ne pe scurt ce te aduce aici", subtitle: "Vom sugera medicul sau terapeutul potrivit." },
      { key: "safety", title: "Siguranța ta este prioritară", subtitle: "Câteva informații importante înainte de a continua." },
      { key: "review", title: "Gata!", subtitle: "Revizuiește, apoi începem triajul." },
    ],
    []
  );
  const total = steps.length;

  // 🔁 animație per pas
  const animByStep: object[] = [
    mentalTherapy,     // 0 – intro
    doctorAndHealth,   // 1 – comfort
    medicineOnline,    // 2 – comms
    doctor,            // 3 – context & tip specialist
    healthInsurance,   // 4 – safety & consent
    doctorAndHealth,   // 5 – review
  ];

  const canGoNext = useMemo(() => {
    if (step === 1) return anxietyLevel[0] >= 1;
    if (step === 2) return communicationPrefs.length > 0;
    if (step === 3) return true;
    if (step === 4) return consent;
    return true;
  }, [step, anxietyLevel, communicationPrefs, consent]);

  const goNext = () => {
    if (!canGoNext) {
      if (step === 4) {
        toast({
          title: "Consimțământ necesar",
          description: "Te rugăm să accepți termenii pentru a continua.",
          variant: "destructive",
        });
      }
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const togglePref = (pref: string) => {
    setCommunicationPrefs((prev) => (prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]));
  };

  const handleFinish = () => {
    if (!consent) {
      toast({
        title: "Consimțământ necesar",
        description: "Te rugăm să accepți termenii pentru a continua.",
        variant: "destructive",
      });
      return;
    }
    const preferences = {
      comfortLevel: anxietyLevel[0],
      communicationPrefs,
      visitPurpose,
      consent,
      preferredSpecialist: specialistType,
    };
    localStorage.setItem("patientPreferences", JSON.stringify(preferences));
    toast({ title: "Preferințe salvate!", description: "Te ghidăm către specialistul potrivit." });

    // 🔀 redirecționează conform flow-ului
    navigate(nextPath);
  };

  const variants = {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-mesh relative">
      <AnimatedBlobs />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* HEADER – animații doar aici */}
          <div className="text-center mb-6 relative">
            <div className="mx-auto max-w-[520px] h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-border bg-card shadow-soft">
              {/* key={step} ⇒ remount ⇒ animația se reia când schimbi pasul */}
              <LottieHeroStep key={step} data={animByStep[step]} loop={false} className="w-full h-full" />
            </div>

            <SplitTextTitle text={steps[step].title} className="text-3xl font-bold mt-4" />
            <ShinySubtitle className="text-muted-foreground">{steps[step].subtitle}</ShinySubtitle>

            {/* Badges doar la Pasul 0 */}
            {step === 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LottieBadge data={doctorAndHealth as object} label="Medici & terapeuți" />
                <LottieBadge data={medicineOnline as object} label="Asistență online, în siguranță" />
                <LottieBadge data={healthInsurance as object} label="Decizii informate & suport" />
              </div>
            )}
          </div>

          {/* indicator progres – centrat */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-center gap-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx <= step ? "bg-primary" : "bg-muted"
                    } ${idx === step ? "w-12" : "w-6"}`}
                  />
                ))}
              </div>
              <span className="ml-4 text-xs text-muted-foreground whitespace-nowrap">
                Pasul {step + 1} / {total}
              </span>
            </div>
          </div>

          {/* CARD – chestionar (fără animații pe textul de form) */}
          <Card className="calm-card overflow-hidden">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="intro" variants={variants} initial="initial" animate="animate" exit="exit">
                    <div className="grid gap-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Discuția începe cu <strong>agentul AI al unui specialist</strong> (medic sau terapeut).
                        Dacă este nevoie, specialistul poate interveni live. Totul este gândit să fie blând și fără presiune.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="calm-card p-4">
                          <Stethoscope className="w-6 h-6 mb-2" />
                          <div className="font-medium">Specialiști reali</div>
                          <div className="text-xs text-muted-foreground">găsim profilul potrivit pentru tine</div>
                        </div>
                        <div className="calm-card p-4">
                          <MessageCircle className="w-6 h-6 mb-2" />
                          <div className="font-medium">Start cu agent AI</div>
                          <div className="text-xs text-muted-foreground">conversații empatice, fără judecată</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="comfort" variants={variants} initial="initial" animate="animate" exit="exit">
                    <div className="space-y-4">
                      <Label className="text-base">Cum te simți în legătură cu interacțiunea cu specialiști?</Label>
                      <div className="space-y-2">
                        <Slider value={anxietyLevel} onValueChange={setAnxietyLevel} min={1} max={5} step={1} />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Confortabil</span>
                          <span className="font-medium text-primary">Nivel: {anxietyLevel[0]}/5</span>
                          <span>Foarte anxios(ă)</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="comms" variants={variants} initial="initial" animate="animate" exit="exit">
                    <div className="space-y-4">
                      <Label className="text-base">Alege canalele preferate</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => togglePref("chat")}
                          className={`calm-card p-4 hover-lift cursor-pointer ${communicationPrefs.includes("chat") ? "ring-2 ring-primary" : ""}`}
                        >
                          <MessageCircle className={`w-6 h-6 mb-2 ${communicationPrefs.includes("chat") ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="text-sm font-medium">Chat</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => togglePref("audio")}
                          className={`calm-card p-4 hover-lift cursor-pointer ${communicationPrefs.includes("audio") ? "ring-2 ring-primary" : ""}`}
                        >
                          <Phone className={`w-6 h-6 mb-2 ${communicationPrefs.includes("audio") ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="text-sm font-medium">Audio</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => togglePref("video")}
                          className={`calm-card p-4 hover-lift cursor-pointer ${communicationPrefs.includes("video") ? "ring-2 ring-primary" : ""}`}
                        >
                          <Video className={`w-6 h-6 mb-2 ${communicationPrefs.includes("video") ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="text-sm font-medium">Video</div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="context" variants={variants} initial="initial" animate="animate" exit="exit">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="purpose" className="text-base">Ce te-a adus aici? (opțional)</Label>
                        <textarea
                          id="purpose"
                          value={visitPurpose}
                          onChange={(e) => setVisitPurpose(e.target.value)}
                          placeholder="Poți împărtăși cu noi ce te preocupă (simptome, durată, obiectiv)…"
                          className="w-full min-h-28 p-3 rounded-lg border bg-background resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base">Ai o preferință de specialist?</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setSpecialistType("medic")}
                            className={`calm-card p-4 hover-lift cursor-pointer ${specialistType === "medic" ? "ring-2 ring-primary" : ""}`}
                          >
                            <Stethoscope className={`w-6 h-6 mb-2 ${specialistType === "medic" ? "text-primary" : ""}`} />
                            <div className="text-sm font-medium">Medic</div>
                            <p className="text-xs text-muted-foreground">ex. medic de familie, specialist</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSpecialistType("terapeut")}
                            className={`calm-card p-4 hover-lift cursor-pointer ${specialistType === "terapeut" ? "ring-2 ring-primary" : ""}`}
                          >
                            <UserCheck className={`w-6 h-6 mb-2 ${specialistType === "terapeut" ? "text-primary" : ""}`} />
                            <div className="text-sm font-medium">Terapeut</div>
                            <p className="text-xs text-muted-foreground">ex. psihoterapeut, kinetoterapeut</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSpecialistType("nu_stiu")}
                            className={`calm-card p-4 hover-lift cursor-pointer ${specialistType === "nu_stiu" ? "ring-2 ring-primary" : ""}`}
                          >
                            <MessageCircle className={`w-6 h-6 mb-2 ${specialistType === "nu_stiu" ? "text-primary" : ""}`} />
                            <div className="text-sm font-medium">Nu știu</div>
                            <p className="text-xs text-muted-foreground">recomandați voi pe baza răspunsurilor</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="safety" variants={variants} initial="initial" animate="animate" exit="exit">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-sm space-y-2">
                          <p className="font-medium">Informații importante despre siguranța ta</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Agentul AI nu oferă diagnostice medicale.</li>
                            <li>• Pentru urgențe, sună 112.</li>
                            <li>• Conversațiile pot fi analizate automat pentru a semnala cuvinte-cheie riscante.</li>
                            <li>• Un specialist (medic sau terapeut) poate interveni live când este necesar.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent"
                          checked={consent}
                          onCheckedChange={(checked) => setConsent(!!checked)}
                          className="mt-1"
                        />
                        <Label htmlFor="consent" className="text-sm cursor-pointer">
                          Înțeleg și accept că serviciul nu înlocuiește o consultație profesională. Sunt de acord cu
                          procesarea datelor mele conform politicii de confidențialitate și cu interacțiunea inițială prin
                          agent AI al specialistului.
                        </Label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="review" variants={variants} initial="initial" animate="animate" exit="exit">
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="calm-card p-4">
                          <div className="text-xs text-muted-foreground">Confort</div>
                          <div className="font-medium">{anxietyLevel[0]} / 5</div>
                        </div>
                        <div className="calm-card p-4">
                          <div className="text-xs text-muted-foreground">Preferințe comunicare</div>
                          <div className="font-medium">{communicationPrefs.join(", ")}</div>
                        </div>
                        <div className="calm-card p-4 sm:col-span-2">
                          <div className="text-xs text-muted-foreground">Tip specialist preferat</div>
                          <div className="font-medium">
                            {specialistType === "nu_stiu" ? "Recomandare automată" : specialistType}
                          </div>
                        </div>
                        {visitPurpose?.trim() && (
                          <div className="calm-card p-4 sm:col-span-2">
                            <div className="text-xs text-muted-foreground">Motiv vizită</div>
                            <div className="text-sm">{visitPurpose}</div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4" />
                        Poți modifica oricând aceste preferințe din profil.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER – butoane shiny */}
            <div className="border-t px-4 py-3 flex items-center justify-between bg-background/60">
              <Button variant="ghost" onClick={goBack} disabled={step === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi
              </Button>

              {step < total - 1 ? (
                <ShinyButton onClick={goNext} disabled={!canGoNext} className="group">
                  Continuă
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </ShinyButton>
              ) : (
                <ShinyButton onClick={handleFinish} className="group">
                  Pornește triajul
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </ShinyButton>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
