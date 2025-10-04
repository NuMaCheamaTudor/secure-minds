import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Appointment = {
  id: number;
  type: string;
  doctor: string;
  date: string;
  time: string;
  location: string;
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    type: "Stomatolog",
    doctor: "Dr. Ana Dumitrescu",
    date: "2025-10-10",
    time: "14:00",
    location: "Clinica Dentară, București",
  },
  {
    id: 2,
    type: "Terapeut",
    doctor: "Dr. Andrei Popescu",
    date: "2025-10-12",
    time: "10:00",
    location: "MindCare Center, București",
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : initialAppointments;
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
    window.dispatchEvent(new Event("storage"));
  }, [appointments]);

  const handleCancel = (id: number) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
    toast({
      title: "Programare anulată",
      description: "Programarea a fost eliminată cu succes.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Programările Tale</h1>
        <Card className="p-6 mb-6">
          <p className="mb-4">Aici poți vedea și gestiona programările tale.</p>
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nu ai programări active momentan.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((app) => (
                <div key={app.id} className="p-4 bg-muted rounded-lg flex flex-col gap-1">
                  <div className="font-semibold">
                    {app.type} cu {app.doctor}
                  </div>
                  <div>Dată: {app.date} la ora {app.time}</div>
                  <div>Locație: {app.location}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 self-end"
                    onClick={() => handleCancel(app.id)}
                  >
                    Anulează
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
