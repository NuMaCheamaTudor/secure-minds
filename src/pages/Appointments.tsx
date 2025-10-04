import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const sampleAppointments = [
  {
    id: 1,
    type: "Dentist",
    doctor: "Dr. Ana Dumitrescu",
    date: "2025-10-10",
    time: "14:00",
    location: "Dental Clinic, Bucharest",
  },
  {
    id: 2,
    type: "Therapist",
    doctor: "Dr. Andrei Popescu",
    date: "2025-10-12",
    time: "10:00",
    location: "MindCare Center, Bucharest",
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(sampleAppointments);
  const { toast } = useToast();

  const handleCancel = (id: number) => {
    // eliminăm programarea selectată
    const updated = appointments.filter((app) => app.id !== id);
    setAppointments(updated);

    // feedback vizual
    toast({
      title: "Programare anulată",
      description: "Programarea a fost ștearsă cu succes.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Your Appointments</h1>
        <Card className="p-6 mb-6">
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nu ai nicio programare momentan.
            </p>
          ) : (
            <>
              <p className="mb-4">
                Here you can see and manage your appointments.
              </p>
              <div className="space-y-4">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-muted rounded-lg flex flex-col gap-1 shadow-sm"
                  >
                    <div className="font-semibold">
                      {app.type} with {app.doctor}
                    </div>
                    <div>Date: {app.date} at {app.time}</div>
                    <div>Location: {app.location}</div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2 self-end"
                      onClick={() => handleCancel(app.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
