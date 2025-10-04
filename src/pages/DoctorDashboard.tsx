import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle2, CalendarDays } from "lucide-react";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-xl animate-fade-in-scale">
        <Card className="calm-card p-10 space-y-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-2 text-center text-primary">
            Bine ai venit, doctor!
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Alege una dintre opțiunile de mai jos pentru a-ți gestiona contul și
            programările.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-background p-6 flex flex-col items-center gap-4 shadow hover:shadow-lg transition">
              <UserCircle2 className="w-10 h-10 text-primary" />
              <div className="font-semibold text-lg text-center">
                Editează detaliile contului
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Actualizează informațiile personale și profesionale afișate
                pacienților.
              </p>
              <Button
                className="w-full mt-2"
                onClick={() => navigate("/doctor/details")}
              >
                Editează contul
              </Button>
            </div>
            <div className="rounded-xl border bg-background p-6 flex flex-col items-center gap-4 shadow hover:shadow-lg transition">
              <CalendarDays className="w-10 h-10 text-primary" />
              <div className="font-semibold text-lg text-center">
                Vezi programările cu pacienți
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Consultă lista programărilor tale și detalii despre pacienți.
              </p>
              <Button
                className="w-full mt-2"
                variant="secondary"
                onClick={() => navigate("/doctor/appointments")}
              >
                Vezi programări
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
