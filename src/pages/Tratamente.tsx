import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, RefreshCcw, Percent, Info, Calendar, Clock, X } from "lucide-react";

/** Tipuri de date */
type Hospital = {
  id: string;
  name: string;
  address: string;
  distanceKm?: number;
  priceRON?: number;
  hasDiscount?: boolean;
  discountPercent?: number;
  mapsQuery?: string;
};

type Treatment = {
  id: string;
  name: string;
  provider: string;
  distanceKm?: number;
  priceRON?: number;
  hasDiscount?: boolean;
  discountPercent?: number;
  mapsQuery?: string;
};

type AppointmentForm = {
  serviceName: string;
  provider: string;
  date: string;
  time: string;
  notes: string;
};

/** Utilitare – generator determinist de prețuri / reduceri (mock) */
const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const seededRandom = (seed: string) => {
  const x = Math.sin(hashCode(seed)) * 10000;
  return x - Math.floor(x);
};

const mockPrice = (name: string, min: number, max: number) => {
  const r = seededRandom(name);
  const price = Math.round(min + r * (max - min));
  return price;
};

const maybeDiscount = (name: string): { hasDiscount: boolean; percent: number } => {
  const r = seededRandom(name + "::discount");
  const has = r > 0.7;
  const percent = has ? (5 + Math.round(seededRandom(name + "::p") * 20)) : 0;
  return { hasDiscount: has, percent };
};

/** Formatare */
const ron = (n: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(n);

const km = (d?: number) => (d == null ? "–" : `${d.toFixed(1)} km`);

/** Link Google Maps */
const mapsUrl = (q?: string) =>
  q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : undefined;

/** Mock "API" spitale */
async function fetchNearbyHospitals(lat: number, lng: number): Promise<Hospital[]> {
  await new Promise((r) => setTimeout(r, 650));

  const base: Hospital[] = [
    {
      id: "h1",
      name: "Spitalul Clinic Sanador",
      address: "Str. Sevastopol 9, București",
      distanceKm: 1.2,
      mapsQuery: "Spitalul Clinic Sanador, Strada Sevastopol 9, București",
    },
    {
      id: "h2",
      name: "Regina Maria – Policlinica Dorobanți",
      address: "Calea Dorobanți 140, București",
      distanceKm: 2.8,
      mapsQuery: "Regina Maria Policlinica Dorobanți, Calea Dorobanți 140, București",
    },
    {
      id: "h3",
      name: "MedLife Grivița",
      address: "Șos. Nicolae Titulescu 52, București",
      distanceKm: 3.5,
      mapsQuery: "MedLife Grivița, Șoseaua Nicolae Titulescu 52, București",
    },
  ];

  return base.map((h) => {
    const price = h.priceRON ?? mockPrice(h.name, 180, 500);
    const d = maybeDiscount(h.name);
    return {
      ...h,
      priceRON: price,
      hasDiscount: d.hasDiscount,
      discountPercent: d.percent,
    };
  });
}

/** Mock "API" tratamente */
async function fetchNearbyTreatments(lat: number, lng: number): Promise<Treatment[]> {
  await new Promise((r) => setTimeout(r, 700));

  const base: Treatment[] = [
    {
      id: "t1",
      name: "Consultație medicină internă",
      provider: "Regina Maria – Policlinica Dorobanți",
      distanceKm: 2.7,
      mapsQuery: "Regina Maria Policlinica Dorobanți",
    },
    {
      id: "t2",
      name: "Detartraj & igienizare",
      provider: "Smile Studio",
      distanceKm: 3.1,
      mapsQuery: "Smile Studio București",
    },
    {
      id: "t3",
      name: "Psihoterapie individuală",
      provider: "MindCare Center",
      distanceKm: 2.2,
      mapsQuery: "MindCare Center București",
    },
  ];

  return base.map((t) => {
    let min = 150;
    let max = 450;
    if (/detartraj|stoma/i.test(t.name)) {
      min = 180;
      max = 600;
    }
    if (/psihoterapie|terapie/i.test(t.name)) {
      min = 180;
      max = 350;
    }
    const price = t.priceRON ?? mockPrice(`${t.provider}::${t.name}`, min, max);
    const d = maybeDiscount(`${t.provider}::${t.name}`);
    return {
      ...t,
      priceRON: price,
      hasDiscount: d.hasDiscount,
      discountPercent: d.percent,
    };
  });
}

/** Componentă utilă pentru preț + discount */
function PriceTag({
  priceRON,
  hasDiscount,
  discountPercent,
}: {
  priceRON?: number;
  hasDiscount?: boolean;
  discountPercent?: number;
}) {
  if (!priceRON) return <span className="text-sm text-muted-foreground">preț indisponibil</span>;

  if (hasDiscount && discountPercent && discountPercent > 0) {
    const reduced = Math.round(priceRON * (1 - discountPercent / 100));
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 text-green-700 px-2 py-0.5 text-xs">
          <Percent className="w-3 h-3" />
          Reducere {discountPercent}%
        </span>
        <div className="flex items-baseline gap-2">
          <span className="line-through text-muted-foreground">{ron(priceRON)}</span>
          <span className="font-semibold text-primary">{ron(reduced)}</span>
        </div>
      </div>
    );
  }

  return <span className="font-semibold text-primary">{ron(priceRON)}</span>;
}

/** Popup pentru programare */
function AppointmentPopup({
  isOpen,
  onClose,
  serviceName,
  provider,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  provider: string;
  onSubmit: (data: AppointmentForm) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onSubmit({
      serviceName,
      provider,
      date,
      time,
      notes,
    });
    setDate("");
    setTime("");
    setNotes("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 relative animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <h2 className="text-2xl font-bold mb-4">Programează-te</h2>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-md">
            <div className="font-semibold">{serviceName}</div>
            <div className="text-sm text-muted-foreground">{provider}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                Dată
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                Oră
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Notițe (opțional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mențiuni speciale sau informații adiționale..."
              className="w-full px-3 py-2 border rounded-md bg-background min-h-[80px]"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Anulează
            </Button>
            <Button onClick={handleSubmit}>
              Confirmă Programarea
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Tratamente() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [activeTab, setActiveTab] = useState<"hospitals" | "treatments">("hospitals");
  const [appointmentPopup, setAppointmentPopup] = useState<{
    isOpen: boolean;
    serviceName: string;
    provider: string;
  }>({
    isOpen: false,
    serviceName: "",
    provider: "",
  });

  /** Obține locația + datele din apropiere */
  const fetchAll = (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);

    if (!navigator.geolocation) {
      Promise.all([fetchNearbyHospitals(0, 0), fetchNearbyTreatments(0, 0)]).then(([hs, ts]) => {
        setHospitals(hs.map((h) => ({ ...h, distanceKm: undefined })));
        setTreatments(ts.map((t) => ({ ...t, distanceKm: undefined })));
        setLoading(false);
        toast({
          title: "Locația nu este disponibilă",
          description: "Afișăm rezultate aproximative și prețuri estimative.",
        });
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const [hs, ts] = await Promise.all([
            fetchNearbyHospitals(latitude, longitude),
            fetchNearbyTreatments(latitude, longitude),
          ]);
          setHospitals(hs);
          setTreatments(ts);
        } catch {
          toast({
            title: "Eroare la încărcare",
            description: "Nu am putut încărca datele. Încearcă din nou.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      async () => {
        const [hs, ts] = await Promise.all([fetchNearbyHospitals(0, 0), fetchNearbyTreatments(0, 0)]);
        setHospitals(hs.map((h) => ({ ...h, distanceKm: undefined })));
        setTreatments(ts.map((t) => ({ ...t, distanceKm: undefined })));
        setLoading(false);
        toast({
          title: "Locația este dezactivată",
          description: "Afișăm rezultate aproximative și prețuri estimative.",
        });
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAppointmentPopup = (serviceName: string, provider: string) => {
    setAppointmentPopup({
      isOpen: true,
      serviceName,
      provider,
    });
  };

  const closeAppointmentPopup = () => {
    setAppointmentPopup({
      isOpen: false,
      serviceName: "",
      provider: "",
    });
  };

  const handleAppointmentSubmit = (data: AppointmentForm) => {
    if (!data.date || !data.time) {
      toast({
        title: "Eroare",
        description: "Te rog completează data și ora programării.",
        variant: "destructive",
      });
      return;
    }

    // Salvăm programarea în localStorage
    const existingAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const newAppointment = {
      id: Date.now(), // ID unic bazat pe timestamp
      type: data.serviceName,
      doctor: data.provider,
      date: data.date,
      time: data.time,
      location: data.provider,
    };
    
    const updatedAppointments = [...existingAppointments, newAppointment];
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    
    // Declanșăm un event pentru a notifica componenta Appointments
    window.dispatchEvent(new Event("storage"));

    toast({
      title: "Programare confirmată!",
      description: `Programarea ta la ${data.provider} pe ${data.date} la ora ${data.time} a fost confirmată.`,
    });
    closeAppointmentPopup();
  };

  const hasResults = useMemo(() => {
    if (activeTab === "hospitals") return hospitals.length > 0;
    return treatments.length > 0;
  }, [activeTab, hospitals, treatments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-6 flex justify-center">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold">În apropierea ta</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "hospitals" ? "default" : "outline"}
              onClick={() => setActiveTab("hospitals")}
            >
              Spitale
            </Button>
            <Button
              variant={activeTab === "treatments" ? "default" : "outline"}
              onClick={() => setActiveTab("treatments")}
            >
              Tratamente
            </Button>
            <Button variant="outline" onClick={() => fetchAll()} disabled={loading}>
              <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Recăutare
            </Button>
          </div>
        </div>

        {/* Mesaj informativ */}
        <Card className="p-4 mb-4 bg-accent/40">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 mt-0.5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Prețurile afișate sunt orientative. Dacă un preț nu este disponibil public, afișăm un preț
              „mock" estimativ. Poți verifica detaliile finale direct la clinică.
            </p>
          </div>
        </Card>

        {/* Loader */}
        {loading && <Card className="p-6 text-center">Se caută opțiunile din apropiere...</Card>}

        {!loading && !hasResults && (
          <Card className="p-6 text-center">
            Nu am găsit rezultate momentan. Încearcă o <strong>recăutare</strong> sau verifică permisiunile de
            <em> locație</em>.
          </Card>
        )}

        {/* Liste */}
        {!loading && hasResults && activeTab === "hospitals" && (
          <div className="space-y-4">
            {hospitals.map((h) => {
              const url = mapsUrl(h.mapsQuery);
              return (
                <Card key={h.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-semibold text-lg">{h.name}</div>
                    <div className="text-sm text-muted-foreground">{h.address}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{km(h.distanceKm)}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <PriceTag priceRON={h.priceRON} hasDiscount={h.hasDiscount} discountPercent={h.discountPercent} />
                    <div className="flex gap-2">
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            Vezi pe hartă
                          </Button>
                        </a>
                      )}
                      <Button
                        size="sm"
                        onClick={() => openAppointmentPopup("Consultație", h.name)}
                      >
                        Programează-te
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && hasResults && activeTab === "treatments" && (
          <div className="space-y-4">
            {treatments.map((t) => {
              const url = mapsUrl(t.mapsQuery);
              return (
                <Card key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-semibold text-lg">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.provider}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{km(t.distanceKm)}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <PriceTag
                      priceRON={t.priceRON}
                      hasDiscount={t.hasDiscount}
                      discountPercent={t.discountPercent}
                    />
                    <div className="flex gap-2">
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            Vezi pe hartă
                          </Button>
                        </a>
                      )}
                      <Button
                        size="sm"
                        onClick={() => openAppointmentPopup(t.name, t.provider)}
                      >
                        Programează-te
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Popup pentru programare */}
        <AppointmentPopup
          isOpen={appointmentPopup.isOpen}
          onClose={closeAppointmentPopup}
          serviceName={appointmentPopup.serviceName}
          provider={appointmentPopup.provider}
          onSubmit={handleAppointmentSubmit}
        />
      </div>
    </div>
  );
}