export type ChatMsg = { role: "user" | "assistant"; content: string };
export type ChatResponse = { reply: string; severity: "normal" | "urgent" };

const BASE = "http://localhost:4000";

export async function chatMedical(messages: ChatMsg[]): Promise<ChatResponse> {
  const r = await fetch(`${BASE}/api/medical-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!r.ok) throw new Error(`chat failed: ${r.status}`);
  return r.json();
}

export async function nearbyDoctors(lat: number, lon: number, radius = 5000) {
  const u = new URL(`${BASE}/api/nearby`);
  u.searchParams.set("lat", String(lat));
  u.searchParams.set("lon", String(lon));
  u.searchParams.set("radius", String(radius));
  const r = await fetch(u);
  if (!r.ok) throw new Error(`nearby failed: ${r.status}`);
  return r.json() as Promise<{ results: Array<{ id:string; name:string; type:string; phone?:string|null; address?:string|null; lat:number; lon:number; }> }>;
}
