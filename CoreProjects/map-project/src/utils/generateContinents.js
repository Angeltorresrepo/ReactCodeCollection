// utils/useContinents.js
import countries from "./countries.json";

export function getContinents() {
  // Genera una lista de continentes únicos
  const continents = Array.from(new Set(countries.map(c => c.CONTINENT))).sort();
  return continents;
}
