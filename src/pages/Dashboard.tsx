import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatMedical, nearbyDoctors, ChatMsg } from "@/lib/chatApi";
import { withPrice, formatPrice } from "@/lib/pricing";
import { AlertTriangle, MapPin, Phone, Shield, Stethoscope, Calendar } from "lucide-react";

export default function Dashboard() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Bună! Sunt asistentul tău virtual pentru sprijin medical general. Povestește-mi pe scurt ce te supără. *Nu ofer diagnostice, doar ghidare generală.*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [nearby, setNearby] = useState<
    { id: string; name: string; address?: string | null; phone?: string | null; lat: number; lon: number }[]
  >([]);
  const [topClinics, setTopClinics] = useState<
    { id: string; name: string; address?: string | null; phone?: string | null; lat: number; lon: number }[]
  >([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, urgent, nearby.length]);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    setHasSubmitted(true);

    const next: ChatMsg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Check for "appointment" keyword
    if (/appointment/i.test(content)) {
      // Helper to fetch clinics and update state
      const fetchClinics = async (lat: number, lon: number) => {
        try {
          const data = await nearbyDoctors(lat, lon);
          const clinics = data.results.slice(0, 5);
          setTopClinics(clinics);
        } catch {
          setTopClinics([]);
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            await fetchClinics(pos.coords.latitude, pos.coords.longitude);
          },
          async () => {
            // fallback: Bucharest coordinates
            await fetchClinics(44.4268, 26.1025);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        // fallback: Bucharest coordinates
        fetchClinics(44.4268, 26.1025);
      }
    } else {
      setTopClinics([]);
    }

    try {
      // nu retrimitem primul mesaj (intro assistant) către API
      const history = next[0].role === "assistant" ? next.slice(1) : next;
      const resp = await chatMedical(history);

      // răspuns assistant
      setMessages((prev) => [...prev, { role: "assistant", content: resp.reply }]);

      if (resp.severity === "urgent") {
        setUrgent(true);
        // încearcă să sugerezi medici apropiați (cerem geolocația)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const { latitude, longitude } = pos.coords;
                const data = await nearbyDoctors(latitude, longitude);
                setNearby(data.results.slice(0, 8));
              } catch {
                /* silențios */
              }
            },
            () => {
              /* user a refuzat locația */
            },
            { enableHighAccuracy: true, timeout: 8000 }
          );
        }
      } else {
        setUrgent(false);
        setNearby([]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Îmi pare rău, a apărut o eroare la conversație. Încearcă din nou puțin mai târziu.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // prompt-uri rapide
  const quick = [
    "Am nas înfundat și durere ușoară în gât. Ce pot face acasă?",
    "Simt durere puternică în piept și respir greu.",
    "Mi-am scrântit glezna aseară, e umflată. Ce ar trebui să fac?",
    "Am o durere de măsea deranjantă. Cum pot să gestionez până ajung la medic?",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Asistent Medical</h1>

        {/* Banner siguranță */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 mb-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Acesta este un asistent pentru ghidare generală. <strong>Nu</strong> oferă diagnostice sau prescripții. Pentru
            urgențe, sună imediat <strong>112</strong>.
          </p>
        </div>

        {/* Alert urgent */}
        {urgent && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-100 border border-amber-300 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5" />
            <div className="text-sm text-amber-800">
              Posibilă situație urgentă. Ia în considerare să contactezi <strong>112</strong> sau un medic cât mai repede.
              {nearby.length > 0 && <div className="mt-2 font-medium">Unități medicale din apropiere:</div>}
            </div>
          </div>
        )}

        {/* Medici din apropiere */}
        {nearby.length > 0 && (
          <Card className="p-3 mb-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {withPrice(nearby, "consult").map((p) => (
                <div key={p.id} className="rounded-lg border p-3">
                  <div className="font-medium">{p.name}</div>
                  {p.address && <div className="text-xs text-muted-foreground">{p.address}</div>}
                  <div className="text-xs text-primary font-semibold mt-1">
                    de la {formatPrice(p.priceRON)}
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <MapPin className="w-4 h-4" />
                    <a
                      className="underline"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps?q=${p.lat},${p.lon}`}
                    >
                      Deschide în Maps
                    </a>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Phone className="w-4 h-4" />
                      <a className="underline" href={`tel:${p.phone}`}>
                        {p.phone}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Top clinici pentru programare */}
        {topClinics.length > 0 && (
          <Card className="p-3 mb-4">
            <div className="font-semibold mb-2">Top clinici pentru programare:</div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {withPrice(topClinics, "procedure").map((c) => (
                <div key={c.id} className="rounded-lg border p-3">
                  <div className="font-medium">{c.name}</div>
                  {c.address && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <span className="font-semibold">Adresă:</span> {c.address}
                    </div>
                  )}
                  <div className="text-xs text-primary font-semibold mt-1">
                    ~ {formatPrice(c.priceRON)}
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <MapPin className="w-4 h-4" />
                    <a
                      className="underline"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps?q=${c.lat},${c.lon}`}
                    >
                      Vezi pe hartă
                    </a>
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Phone className="w-4 h-4" />
                      <a className="underline" href={`tel:${c.phone}`}>
                        {c.phone}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Fereastra de chat */}
        <Card className="p-4 h-[60vh] overflow-auto">
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm shadow ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                  }`}
                >
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-muted-foreground">Se scrie…</div>}
            <div ref={endRef} />
          </div>
        </Card>

        {/* Input + acțiuni rapide */}
        <Card className="p-3 mt-3">
          <form onSubmit={onSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descrie pe scurt ce te supără (fără date personale)…"
              className="h-12"
            />
            <Button className="h-12 px-6" disabled={!input.trim() || loading} type="submit">
              Trimite
            </Button>
          </form>

          {!hasSubmitted && (
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-2">Sugestii rapide:</div>
              <div className="flex flex-wrap gap-2">
                {quick.map((q, idx) => (
                  <Button key={idx} variant="outline" size="sm" onClick={() => setInput(q)}>
                    {q}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/online-doctors")}
                  className="flex items-center gap-1"
                >
                  <Stethoscope className="w-4 h-4" />
                  Găsește un doctor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/appointments")}
                  className="flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4" />
                  Programează-te
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
       
