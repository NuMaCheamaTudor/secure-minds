import { Shield, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SafetyDisclaimer() {
  return (
    <Card className="border-primary/20 bg-primary-soft p-4">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="space-y-2 text-sm">
          <p className="font-medium text-primary-foreground">
            Ești în siguranță aici
          </p>
          <ul className="space-y-1 text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Acest agent AI nu oferă diagnostice medicale</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Pentru urgențe, sună imediat <strong className="text-destructive">112</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Terapeutul tău poate interveni oricând dacă este necesar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Conversația este monitorizată pentru siguranța ta</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
