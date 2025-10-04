/**
 * Generează un preț mock determinist pe baza numelui
 * @param name - numele serviciului/spitalului/tratamentului
 * @param type - tipul de serviciu ('consult' | 'procedure')
 * @returns preț în RON
 */
export function seededRandom(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getMockPrice(name: string, type: "consult" | "procedure" = "consult"): number {
  const seed = seededRandom(name);
  if (type === "consult") {
    return 120 + (seed % 331); // 120-450 RON
  }
  return 200 + (seed % 1001); // 200-1200 RON
}

export function formatPrice(price: number): string {
  return `${price} RON`;
}

/**
 * Adaugă preț mock la o listă de rezultate
 */
export function withPrice<T extends { name: string; price?: number }>(
  items: T[],
  type: "consult" | "procedure" = "consult"
): (T & { priceRON: number })[] {
  return items.map((item) => ({
    ...item,
    priceRON: item.price || getMockPrice(item.name, type),
  }));
}
