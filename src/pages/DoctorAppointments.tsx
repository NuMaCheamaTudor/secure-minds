import { Card } from "@/components/ui/card";

const mockAppointments = [
  {
    id: 1,
    patient: "Maria Popescu",
    date: "2024-06-18",
    time: "10:00",
    notes: "Anxietate, prima ședință",
  },
  {
    id: 2,
    patient: "Ion Ionescu",
    date: "2024-06-19",
    time: "14:00",
    notes: "Follow-up depresie",
  },
];

export default function DoctorAppointments() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="w-full max-w-lg animate-fade-in-scale">
        <Card className="calm-card p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Programările tale</h2>
          <div className="space-y-4">
            {mockAppointments.map((appt) => (
              <div key={appt.id} className="p-4 rounded-lg border bg-background shadow-sm">
                <div className="font-semibold">{appt.patient}</div>
                <div className="text-sm text-muted-foreground">
                  {appt.date} • {appt.time}
                </div>
                <div className="mt-2 text-sm">{appt.notes}</div>
              </div>
            ))}
            {mockAppointments.length === 0 && (
              <div className="text-center text-muted-foreground">Nu ai programări momentan.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
