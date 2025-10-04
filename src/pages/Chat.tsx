import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, Download, AlertCircle, AlertTriangle } from "lucide-react";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";
import RiskBadge from "@/components/RiskBadge";
import { assessRisk, getEmpathicResponse, RiskAssessment } from "@/lib/safety";
import { detectEmergency, notifyDoctor, EMERGENCY_AI_RESPONSE } from "@/lib/emergency";

interface Message {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  risk?: RiskAssessment;
  timestamp: Date;
}

const MOCK_THERAPIST = {
  id: "t1",
  name: "Dr. Andrei Popescu",
  specialty: "Psihoterapie CBT",
  status: "online",
  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
};

export default function Chat() {
  const { therapistId } = useParams();
  const [searchParams] = useSearchParams();
  const therapistName = searchParams.get("name") || "Dr. Andrei Popescu";
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: `Salut! Sunt agentul AI al ${therapistName}. Sunt aici să te ascult și să te ajut. Tot ce îmi spui este confidențial și în siguranță.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<RiskAssessment>({ level: "ok", score: 0, flags: [] });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // Detectare urgență
    const emergency = detectEmergency(input);
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Dacă e urgență, răspunde imediat și notifică
    if (emergency.urgent) {
      setEmergencyDetected(true);
      notifyDoctor(therapistId || "unknown", emergency.reason || "unknown");
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const emergencyResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: EMERGENCY_AI_RESPONSE,
        risk: { level: "critical", score: 10, flags: emergency.matchedKeywords },
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, emergencyResponse]);
      setIsTyping(false);
      setCurrentRisk({ level: "critical", score: 10, flags: emergency.matchedKeywords });
      
      toast({
        title: "Urgență detectată",
        description: "Terapeutul a fost notificat automat. Pentru urgențe imediate, sună 112.",
        variant: "destructive",
      });
      
      return;
    }

    // Evaluare risc standard
    const risk = assessRisk(input);
    setCurrentRisk(risk);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // If critical, show alert
    if (risk.level === "critical") {
      toast({
        title: "Alert de siguranță",
        description: "Terapeutul a fost notificat și va răspunde în curând.",
        variant: "destructive",
      });
    }

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: getEmpathicResponse(risk),
      risk,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const exportChat = () => {
    const chatText = messages
      .map((m) => `[${m.role.toUpperCase()}] ${m.content}`)
      .join("\n\n");
    
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${therapistId}-${Date.now()}.txt`;
    a.click();
    
    toast({
      title: "Chat exportat",
      description: "Conversația a fost salvată cu succes.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={MOCK_THERAPIST.image}
                  alt={therapistName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></span>
              </div>
              <div>
                <h2 className="font-semibold">{therapistName}</h2>
                <p className="text-sm text-muted-foreground">
                  {MOCK_THERAPIST.specialty}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={currentRisk.level} flags={currentRisk.flags} />
              <Button variant="outline" size="sm" onClick={exportChat}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <SafetyDisclaimer />
          
          {/* Alert urgență */}
          {emergencyDetected && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-100 border border-red-300 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <strong>Urgență detectată!</strong> Terapeutul a fost notificat automat. Pentru urgențe imediate, sună{" "}
                <strong>112</strong>.
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`animate-fade-in ${
                message.role === "user" ? "flex justify-end" : ""
              }`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "system"
                    ? "bg-primary-soft border-primary/20"
                    : "calm-card"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.risk && message.risk.level !== "ok" && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Conversație monitorizată pentru siguranță</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="animate-fade-in">
              <Card className="calm-card max-w-[80%] p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-sm text-muted-foreground">Scrie...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Scrie mesajul tău aici..."
              className="flex-1 min-h-[44px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="h-11 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Apasă Enter pentru a trimite, Shift+Enter pentru linie nouă
          </p>
        </div>
      </div>
    </div>
  );
}
