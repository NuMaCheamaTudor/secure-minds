import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// fallback local (în lipsa state-ului)
const REGISTRY = {
  1: {
    id: 1,
    name: "Dr. Andrei Popescu",
    specialty: "Therapist",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  },
  2: {
    id: 2,
    name: "Dr. Ana Dumitrescu",
    specialty: "Dentist",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop",
  },
  3: {
    id: 3,
    name: "Dr. Ioana Ionescu",
    specialty: "Psychiatrist",
    status: "offline",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
  },
} as const;

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1) Încercăm să luăm doctorul din state (trimis din OnlineDoctors)
  // 2) Fallback: din registrul local de mai sus
  const doctor =
    (location.state as any)?.doctor ||
    (id ? (REGISTRY as any)[Number(id)] : null);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 text-center">
          <div className="text-lg font-semibold mb-2">Doctor not found</div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-6">
      <Card className="p-8 w-full max-w-2xl shadow-lg animate-fade-in">
        <div className="flex items-start gap-6">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-28 h-28 rounded-full object-cover shadow-md border"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{doctor.name}</h1>
            <div className="text-muted-foreground">{doctor.specialty}</div>
            <div
              className={`text-xs mt-1 ${
                doctor.status === "online" ? "text-green-600" : "text-gray-400"
              }`}
            >
              {doctor.status}
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Dr. {doctor.name} este un specialist dedicat. Profilul public poate
              include descriere, competențe, oraș, ani de experiență și link-uri
              utile. (Mock de prezentare.)
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={() => window.open(`/chat/${doctor.id}`, "_blank")}>
                Start Chat
              </Button>
              <Button variant="outline" onClick={() => navigate("/appointments")}>
                Programează-te
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
