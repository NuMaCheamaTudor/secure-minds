  const [isTyping, setIsTyping] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [response, setResponse] = useState("");
  const [showAppointments, setShowAppointments] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number|null>(null);
  // Location state will be set from onboarding and can be changed from Sidebar
  const [city, setCity] = useState(() => localStorage.getItem("user_city") || "");
  const [coords, setCoords] = useState<{lat: number; lng: number} | null>(null);
  const [locError, setLocError] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  // Helper: Geocode city to coordinates using OpenStreetMap Nominatim
  async function geocodeCity(city: string): Promise<{lat: number; lng: number} | null> {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const data = await resp.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    } catch {
      return null;
    }
  }

  // Fetch nearby clinics/doctors using Overpass API
  async function fetchPlaces() {
    setLoadingPlaces(true);
    let location = coords;
    if (!location && city) {
      location = await geocodeCity(city);
      setCoords(location);
    }
    if (!location) {
      setLocError("Please provide a city or use geolocation.");
      setLoadingPlaces(false);
      return;
    }
    // Overpass QL: find hospitals, clinics, doctors within 5km
    const query = `[out:json];(
      node["amenity"~"hospital|clinic|doctors"](around:5000,${location.lat},${location.lng});
      way["amenity"~"hospital|clinic|doctors"](around:5000,${location.lat},${location.lng});
      relation["amenity"~"hospital|clinic|doctors"](around:5000,${location.lat},${location.lng});
    );out center;`;
    try {
      const resp = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        headers: { "Content-Type": "text/plain" }
      });
      const data = await resp.json();
      setPlaces(data.elements || []);
    } catch (e) {
      setLocError("Failed to fetch places.");
    }
    setLoadingPlaces(false);
  }
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocError("");
      },
      (err) => {
        setLocError("Could not get location: " + err.message);
      }
    );
  };
  
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

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setIsTyping(true);
    setInputDisabled(true);
    const lower = prompt.toLowerCase();
    setPrompt("");
    setTimeout(() => {
      if (lower.includes("doctor") || lower.includes("talk to a doctor") || lower.includes("online doctor")) {
        setResponse("Based on your message, we recommend talking to an online doctor. Click below to start a chat.");
        setIsTyping(false);
        setInputDisabled(false);
      } else if (lower.includes("appointment")) {
        setResponse("Here are some clinics/doctors near you. Please select one:");
        fetchPlaces()
          .catch(() => {})
          .finally(() => {
            setIsTyping(false);
            setInputDisabled(false);
          });
      } else {
        setResponse("Thank you for sharing. If you need advice or want to book an appointment, just let me know!");
        setIsTyping(false);
        setInputDisabled(false);
      }
    }, 1200); // Simulate model thinking for 1.2s
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Your Dashboard</h1>
        <Card className="p-6 mb-6">
          {/* Results only after 'appointment' is mentioned */}
          {response && response.includes("clinics/doctors") && (
            <div className="mt-4">
              <div className="font-semibold mb-2">Nearby Clinics/Doctors:</div>
              {loadingPlaces ? (
                <div className="text-muted-foreground animate-pulse">Loading clinics...</div>
              ) : places.length > 0 ? (
                <ul className="space-y-2">
                  {places.slice(0, 5).map((place, idx) => (
                    <li key={place.id || idx} className="p-2 border rounded">
                      <div className="font-medium">{place.tags?.name || place.tags?.operator || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">{place.tags?.address || place.tags?.addr_full || place.tags?.addr_street || ""}</div>
                      {place.tags?.amenity && (
                        <div className="text-xs">Type: {place.tags.amenity}</div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground">No clinics found.</div>
              )}
            </div>
          )}
          <form onSubmit={handlePromptSubmit} className="space-y-4">
            <Input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Write your thoughts or requests..."
              className="w-full"
              disabled={inputDisabled}
            />
            <Button type="submit" className="w-full" disabled={inputDisabled}>Submit</Button>
          </form>
          {/* Hide 'try these prompts' after submit */}
          {!hasSubmitted && (
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
          {(isTyping || response) && (
            <div className="mt-4 p-4 bg-muted rounded-lg min-h-[48px] flex items-center">
              {isTyping ? (
                <span className="animate-pulse text-muted-foreground">Model is thinking...</span>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
