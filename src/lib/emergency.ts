/**
 * Detectare urgență în mesaje
 */

const SOMATIC_KEYWORDS = [
  "durere severă piept",
  "durere inimă",
  "dificultăți respirație",
  "dificultati respiratie",
  "nu pot respira",
  "leșin",
  "lesin",
  "paralizie",
  "sângerare abundentă",
  "sangerare abundenta",
  "hemoragie",
  "accident",
  "traumatism sever",
];

const PSYCH_KEYWORDS = [
  "vreau să mă rănesc",
  "vreau sa ma ranesc",
  "gânduri suicidare",
  "ganduri suicidale",
  "nu mai vreau să trăiesc",
  "nu mai vreau sa traiesc",
  "mă pot omorî",
  "ma pot omori",
  "vreau să mor",
  "vreau sa mor",
  "sinucidere",
  "plan de sinucidere",
  "îmi fac rău",
  "imi fac rau",
  "automutilare",
];

export interface EmergencyDetection {
  urgent: boolean;
  reason: "somatic" | "psych" | null;
  matchedKeywords: string[];
}

export function detectEmergency(text: string): EmergencyDetection {
  const normalized = text.toLowerCase();
  const somaticMatches: string[] = [];
  const psychMatches: string[] = [];

  for (const keyword of SOMATIC_KEYWORDS) {
    if (normalized.includes(keyword.toLowerCase())) {
      somaticMatches.push(keyword);
    }
  }

  for (const keyword of PSYCH_KEYWORDS) {
    if (normalized.includes(keyword.toLowerCase())) {
      psychMatches.push(keyword);
    }
  }

  if (somaticMatches.length > 0) {
    return { urgent: true, reason: "somatic", matchedKeywords: somaticMatches };
  }

  if (psychMatches.length > 0) {
    return { urgent: true, reason: "psych", matchedKeywords: psychMatches };
  }

  return { urgent: false, reason: null, matchedKeywords: [] };
}

/**
 * Notifică doctorul (mock - doar salvează în localStorage)
 */
export function notifyDoctor(threadId: string, reason: string) {
  const alerts = JSON.parse(localStorage.getItem("doctorAlerts") || "[]");
  alerts.push({
    threadId,
    reason,
    timestamp: new Date().toISOString(),
    acknowledged: false,
  });
  localStorage.setItem("doctorAlerts", JSON.stringify(alerts));
  window.dispatchEvent(new Event("storage"));
}

/**
 * Mesaj AI fix pentru urgență
 */
export const EMERGENCY_AI_RESPONSE =
  "Nu te pot ajuta cu acest lucru acum deoarece nu am permisiunea să o fac pentru lucruri complexe, terapeutul va fi contactat de urgență!";
