import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

// — Sistem (NU dă diagnostice)
const SYSTEM_PROMPT = `
You are a cautious, empathetic healthcare support assistant for Romanian users.
Language: Romanian.
You provide general wellbeing guidance and self-care tips (hydration, rest, OTC where allowed in general terms).
You MUST NOT provide diagnoses, prescriptions, or treatment plans.
Always include a short disclaimer in your reply: "Acesta nu este un diagnostic medical."
If red flags are present (ex: durere toracică severă, dificultăți de respirație, semne de AVC, sângerare abundentă, convulsii, pierderea stării de conștiență, idei suicidare), set "severity":"urgent" and advise calling 112 or seeing a doctor immediately.
Otherwise set "severity":"normal".
Return STRICT JSON with exactly these keys:
{
  "reply": "<text in markdown, short and actionable, Romanian>",
  "severity": "normal" | "urgent"
}
Do not add any extra keys or text outside JSON.
`;

function safeCoerceJson(s: string) {
  try {
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end >= start) return JSON.parse(s.slice(start, end + 1));
  } catch {}
  return { reply: s, severity: "normal" };
}

// --- Chat cu Claude ---
app.post("/api/medical-chat", async (req, res) => {
  try {
    const history = (req.body?.messages ?? []) as Array<{ role: "user" | "assistant"; content: string }>;
    const messages = history.map((m) => ({ role: m.role, content: m.content })) as any;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 500,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content.map((c) => (c.type === "text" ? c.text : "")).join("\n");
    const parsed = safeCoerceJson(text);

    // fallback local pentru red flags
    const redFlags =
      /(durere toracică|chest pain|dificultate de respirație|nu pot respira|suicid|sinucidere|idei suicidare|accident vascular|AVC|convulsii|sângerare abundentă|hemoragie|leșin|pierderea cunoștinței)/i;
    const userText = history.map((h) => h.content).join(" ");
    if (redFlags.test(userText)) parsed.severity = "urgent";

    res.json(parsed);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Claude chat failed" });
  }
});

// --- Unități medicale apropiate (OpenStreetMap Overpass) ---
app.get("/api/nearby", async (req, res) => {
  try {
    const { lat, lon, radius = "5000" } = req.query as any;
    if (!lat || !lon) return res.status(400).json({ error: "Missing lat/lon" });

    const overpass = `
      [out:json][timeout:25];
      (
        node["amenity"~"doctors|clinic|hospital"](around:${radius},${lat},${lon});
        way["amenity"~"doctors|clinic|hospital"](around:${radius},${lat},${lon});
        relation["amenity"~"doctors|clinic|hospital"](around:${radius},${lat},${lon});
      );
      out center 25;
    `.trim();

    // Node 18+ are fetch nativ
    const r = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: new URLSearchParams({ data: overpass }),
    });

    const data = await r.json();
    const items = (data.elements || []).map((el: any) => {
      const name = el.tags?.name || "Fără nume";
      const type = el.tags?.amenity || "medical";
      const phone = el.tags?.phone || el.tags?.contact_phone || null;
      const addr = [el.tags?.addr_street, el.tags?.addr_housenumber, el.tags?.addr_city].filter(Boolean).join(" ") || null;
      const lat2 = el.lat || el.center?.lat;
      const lon2 = el.lon || el.center?.lon;
      return { id: `${el.type}/${el.id}`, name, type, phone, address: addr, lat: lat2, lon: lon2 };
    });

    res.json({ results: items });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "nearby failed" });
  }
});

app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
