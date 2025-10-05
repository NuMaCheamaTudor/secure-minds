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
    specialty: "Terapeut",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Dr. Ana Dumitrescu",
    specialty: "Stomatolog",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Dr. Ioana Ionescu",
    specialty: "Psihiatru",
    status: "offline",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
  },
];

export default function OnlineDoctors() {
  const navigate = useNavigate();

  const goToDoctorProfile = (doc: Doc) => {
    navigate(`/doctor/profile/${doc.id}`, {
      state: { doctor: doc },
      replace: false,
    });
  };

  const openChatInNewTab = (e: React.MouseEvent, doc: Doc) => {
    // NU lăsăm click-ul să ajungă la onClick-ul containerului
    e.stopPropagation();
    e.preventDefault();

    const url = new URL(`/chat/${doc.id}`, window.location.origin);
    url.searchParams.set("name", doc.name);
    url.searchParams.set("specialty", doc.specialty);

    window.open(url.toString(), "_blank", "noopener,noreferrer");
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Doctori Online</h1>

        <Card className="p-6 mb-6">
          <p className="mb-4">Aici poți vorbi în timp real cu doctorii disponibili.</p>

          <div className="grid gap-4">
            {doctors.map((doc) => {
              const isOnline = doc.status === "online";
              return (
                <div
                  key={doc.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isOnline ? "bg-green-50 hover:bg-green-100" : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => goToDoctorProfile(doc)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goToDoctorProfile(doc);
                  }}
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-transparent"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold hover:underline">{doc.name}</div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          isOnline ? "bg-green-600/10 text-green-700" : "bg-gray-500/10 text-gray-600"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{doc.specialty}</div>
                  </div>

                  {isOnline ? (
                    <Button
                      type="button"
                      onClick={(e) => openChatInNewTab(e, doc)}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="shrink-0"
                    >
                      Începe Chat
                    </Button>
                  ) : (
                    <Button type="button" disabled className="shrink-0">
                      Indisponibil
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
