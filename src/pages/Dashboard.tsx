import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
  const [response, setResponse] = useState("");
  const [showAppointments, setShowAppointments] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number|null>(null);
  
  const appointmentOptions = [
    {
      id: 1,
      type: "Dentist",
      doctor: "Dr. Ana Dumitrescu",
      date: "2025-10-10",
      time: "14:00",
      location: "Dental Clinic, Bucharest"
    },
    {
      id: 2,
      type: "Dentist",
      doctor: "Dr. Mihai Ionescu",
      date: "2025-10-11",
      time: "11:00",
      location: "Smile Studio, Bucharest"
    }
  ];
  const navigate = useNavigate();

  const [medicalPlaces, setMedicalPlaces] = useState([]);
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lower = prompt.toLowerCase();
    if (lower.includes("doctor") || lower.includes("talk to a doctor") || lower.includes("online doctor")) {
      setResponse("Based on your message, we recommend talking to an online doctor. Click below to start a chat.");
      setMedicalPlaces([]);
    } else if (lower.includes("appointment")) {
      // Get location from localStorage
      let locationStr = localStorage.getItem("locationInput") || "";
      let lat = null, lon = null;
      if (locationStr.match(/^-?\d+\.\d+,\s*-?\d+\.\d+$/)) {
        [lat, lon] = locationStr.split(/,\s*/);
      }
      if (lat && lon) {
        const minLat = parseFloat(lat) - 0.01;
        const maxLat = parseFloat(lat) + 0.01;
        const minLon = parseFloat(lon) - 0.01;
        const maxLon = parseFloat(lon) + 0.01;
        const queries = ["hospital", "clinic", "pharmacy"];
        let results = [];
        for (const q of queries) {
          const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${q}&limit=5&viewbox=${minLon},${minLat},${maxLon},${maxLat}&bounded=1`;
          try {
            const resp = await fetch(url);
            const data = await resp.json();
            results = results.concat(data);
          } catch {}
        }
        if (results.length > 0) {
          setResponse("Here are medical places near you:");
          setMedicalPlaces(results);
        } else {
          setResponse("No medical places found near your location.");
          setMedicalPlaces([]);
        }
      } else {
        setResponse("Please set your location in the sidebar (coordinates recommended). Then try again.");
        setMedicalPlaces([]);
      }
      setShowAppointments(false);
    } else if (lower.includes("appointment") && lower.includes("dentist")) {
      setResponse("Here are some available dentist appointments. Please select one:");
      setShowAppointments(true);
      setMedicalPlaces([]);
    } else {
      setResponse("Thank you for sharing. If you need advice or want to book an appointment, just let me know!");
      setMedicalPlaces([]);
    }
    setPrompt("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Your Dashboard</h1>
        <Card className="p-6 mb-6">
          <form onSubmit={handlePromptSubmit} className="space-y-4">
            <Input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Write your thoughts or requests..."
              className="w-full"
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
            {showSuggestions && (
              <div className="mt-6">
                <div className="font-semibold mb-2">Try these prompts:</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "I want an appointment to the dentist",
                    "Show me my appointments",
                    "I want to talk to a doctor",
                    "I feel anxious lately"
                  ].map((p, i) => (
                    <Button key={i} variant="outline" size="sm" onClick={() => setPrompt(p)}>{p}</Button>
                  ))}
                </div>
              </div>
            )}
            {response && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                {response}
                {response.includes("online doctor") && (
                  <Button className="mt-4 w-full" onClick={() => navigate("/online-doctors")}>Go to Online Doctors</Button>
                )}
                {response.includes("dentist appointment") && (
                  <Button className="mt-4 w-full" onClick={() => navigate("/appointments")}>Go to Appointments</Button>
                )}
                {response.includes("show your appointments") && (
                  <Button className="mt-4 w-full" onClick={() => navigate("/appointments")}>View Appointments</Button>
                )}
                {medicalPlaces.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {medicalPlaces.map((place, idx) => (
                      <li key={idx} className="border rounded p-2 bg-white text-black">
                        <div className="font-semibold">{place.display_name}</div>
                        <div className="text-xs">Lat: {place.lat}, Lon: {place.lon}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
        </Card>
      </div>
    </div>
  );
}
