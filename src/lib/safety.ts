export interface LexiconItem {
  code: string;
  pattern: string;
  level: "warn" | "critical";
  weight?: number;
  description?: string;
}

export const ROMANIAN_LEXICON: LexiconItem[] = [
  {
    code: "SUI_PLAN",
    pattern: "(plan(\\-| )?(de )?sinucid(e|er(e|i)))|(metod(ă|a) de sinucidere)",
    level: "critical",
    weight: 5,
    description: "Plan de sinucidere",
  },
  {
    code: "SUI_IDEATION",
    pattern: "(nu mai vreau sa traiesc|imi fac rau|vreau sa mor|sa dispar)",
    level: "critical",
    weight: 4,
    description: "Gânduri suicidale",
  },
  {
    code: "SELF_HARM",
    pattern: "(taieturi|automutilare|imi provoc durere|ma ranesc)",
    level: "warn",
    weight: 3,
    description: "Automutilare",
  },
  {
    code: "ABUSE",
    pattern: "(abuz|violenta|amenintare|m?a lovit)",
    level: "warn",
    weight: 2,
    description: "Abuz sau violență",
  },
  {
    code: "CRISIS",
    pattern: "(criza|panica severa|nu pot controla|halucinatii)",
    level: "critical",
    weight: 3,
    description: "Criză acută",
  },
  {
    code: "DANGER",
    pattern: "(nu ma simt in siguranta|sunt in pericol|ma tem pentru viata)",
    level: "critical",
    weight: 4,
    description: "Pericol iminent",
  },
];

export interface RiskAssessment {
  level: "ok" | "warn" | "critical";
  score: number;
  flags: string[];
}

export function assessRisk(
  text: string,
  lexicon: LexiconItem[] = ROMANIAN_LEXICON
): RiskAssessment {
  const hits: LexiconItem[] = [];
  const normalizedText = text.toLowerCase();

  for (const item of lexicon) {
    const pattern = item.pattern.toLowerCase();
    const re = new RegExp(
      `(^|[^a-zăâîșțA-ZĂÂÎȘȚ])(${pattern})(?=$|[^a-zăâîșțA-ZĂÂÎȘȚ])`,
      "i"
    );
    
    if (re.test(normalizedText)) {
      hits.push(item);
    }
  }

  const hasCritical = hits.some((h) => h.level === "critical");
  const level = hasCritical ? "critical" : hits.length ? "warn" : "ok";
  
  const score = hits.reduce(
    (s, h) => s + (h.weight ?? (h.level === "critical" ? 3 : 1)),
    0
  );

  const flags = hits.map((h) => h.description || h.code);

  return { level, score, flags };
}

export function getEmpathicResponse(risk: RiskAssessment): string {
  if (risk.level === "critical") {
    return "Îmi pare foarte rău că te simți așa. Ești în siguranță aici și nu ești singur. Dacă e o urgență imediată, te rog sună 112. Pot alerta terapeutul tău acum dacă vrei să vorbești cu cineva.";
  }
  
  if (risk.level === "warn") {
    return "Te ascult și îmi pasă de ce simți. Este foarte important să vorbești despre asta. Pot să te ajut să te conectezi cu terapeutul tău sau să îți ofer resurse de sprijin.";
  }
  
  return "Te ascult. Spune-mi mai multe despre ce te preocupă, ca să te pot ghida către specialistul potrivit.";
}
