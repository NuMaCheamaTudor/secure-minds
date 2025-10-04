import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RiskBadgeProps {
  level: "ok" | "warn" | "critical";
  flags?: string[];
}

export default function RiskBadge({ level, flags = [] }: RiskBadgeProps) {
  const config = {
    ok: {
      icon: CheckCircle,
      label: "Siguranță activă",
      color: "bg-secondary text-secondary-foreground",
      iconColor: "text-secondary-foreground",
    },
    warn: {
      icon: AlertTriangle,
      label: "Atenție",
      color: "bg-warning/10 text-warning border-warning/20",
      iconColor: "text-warning",
    },
    critical: {
      icon: AlertCircle,
      label: "Alert",
      color: "bg-destructive/10 text-destructive border-destructive/20",
      iconColor: "text-destructive",
    },
  };

  const { icon: Icon, label, color, iconColor } = config[level];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${color} px-3 py-1.5 font-medium`}>
            <Icon className={`w-3.5 h-3.5 mr-1.5 ${iconColor}`} />
            {label}
          </Badge>
        </TooltipTrigger>
        {flags.length > 0 && (
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-medium mb-1">Indicatori detectați:</p>
            <ul className="space-y-0.5 text-xs">
              {flags.map((flag, i) => (
                <li key={i}>• {flag}</li>
              ))}
            </ul>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
