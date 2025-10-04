import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Doc = {
  id: number;
  name: string;
  specialty: string;
  status: "online" | "offline";
  image: string;
};

const doctors: Doc[] = [
  {
    id: 1,
    name: "Dr. Andrei Popescu",
    specialty: "Therapist",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Dr. Ana Dumitrescu",
    specialty: "Dentist",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Dr. Ioana Ionescu",
    specialty: "Psychiatrist",
    status: "offline",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
  },
];

export default function OnlineDoctors() {
  const navigate = useNavigate();

  const openChatInNewTab = (doc: Doc) => {
    const url = new URL(`${window.location.origin}/chat/${doc.id}`);
    url.searchParams.set("name", doc.name);
    url.searchParams.set("specialty", doc.specialty);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const goToDoctorProfile = (doc: Doc) => {
    navigate(`/doctor/profile/${doc.id}`, {
      state: { doctor: doc }, // trimitem datele către pagina de profil
      replace: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Online Doctors</h1>
        <Card className="p-6 mb-6">
          <p className="mb-4">Here you can talk in real time with available doctors.</p>

          <div className="grid gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  doc.status === "online"
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {/* Click pe poză → profil */}
                <img
                  src={doc.image}
                  alt={doc.name}
                  onClick={() => goToDoctorProfile(doc)}
                  className="w-16 h-16 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                />

                {/* Click pe nume/descriere → profil */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => goToDoctorProfile(doc)}
                  role="button"
                  aria-label={`Open profile for ${doc.name}`}
                >
                  <div className="font-semibold hover:underline">{doc.name}</div>
                  <div className="text-sm text-muted-foreground">{doc.specialty}</div>
                  <div
                    className={`text-xs mt-1 ${
                      doc.status === "online" ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {doc.status}
                  </div>
                </div>

                {doc.status === "online" ? (
                  <Button size="sm" onClick={() => openChatInNewTab(doc)}>
                    Start Chat
                  </Button>
                ) : (
                  <Button size="sm" disabled>
                    Unavailable
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
