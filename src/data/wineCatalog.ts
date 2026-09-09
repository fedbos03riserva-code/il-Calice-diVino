import type { Wine } from "../types/wine";

let cachedCatalog: Wine[] | null = null;

export async function loadWineCatalog(): Promise<Wine[]> {
  if (cachedCatalog) return cachedCatalog;

  const response = await fetch("/wine_catalog.json");
  if (!response.ok) throw new Error("Failed to load wine catalog");
  cachedCatalog = (await response.json()) as Wine[];
  return cachedCatalog;
}

export function getWineById(catalog: Wine[], id: string): Wine | undefined {
  return catalog.find((w) => w.id === id);
}

export function getWineBySlug(catalog: Wine[], slug: string): Wine | undefined {
  return catalog.find((w) => w.slug === slug);
}

const COUNTRY_TO_CONTINENT: Record<string, string> = {
  "Italia": "Europa", "Francia": "Europa", "Spagna": "Europa", "Portogallo": "Europa",
  "Germania": "Europa", "Austria": "Europa", "Svizzera": "Europa", "Ungheria": "Europa",
  "Grecia": "Europa", "Croazia": "Europa", "Romania": "Europa", "Slovenia": "Europa",
  "Georgia": "Europa", "Inghilterra": "Europa",
  "USA": "Nord America", "Canada": "Nord America",
  "Argentina": "Sud America", "Cile": "Sud America", "Brasile": "Sud America", "Uruguay": "Sud America",
  "Australia": "Oceania", "Nuova Zelanda": "Oceania",
  "Sudafrica": "Africa", "Marocco": "Africa",
  "Cina": "Asia", "Giappone": "Asia", "India": "Asia", "Libano": "Asia",
};

export function getContinent(wine: Wine): string {
  return COUNTRY_TO_CONTINENT[wine.continente] || wine.continente;
}

export function filterWines(
  catalog: Wine[],
  filters: {
    tipo?: string;
    regione?: string;
    continente?: string;
    fascia?: string;
    search?: string;
  }
): Wine[] {
  return catalog.filter((w) => {
    if (filters.tipo && filters.tipo !== "all" && w.tipo !== filters.tipo) return false;
    if (filters.regione && filters.regione !== "all" && w.regione !== filters.regione) return false;
    if (filters.continente && filters.continente !== "all" && getContinent(w) !== filters.continente) return false;
    if (filters.fascia && filters.fascia !== "all" && w.fascia !== filters.fascia) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${w.nome} ${w.uva} ${w.regione} ${w.continente}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function getUniqueRegions(catalog: Wine[]): string[] {
  return [...new Set(catalog.map((w) => w.regione))].sort();
}

export function getUniqueContinents(catalog: Wine[]): string[] {
  return [...new Set(catalog.map((w) => getContinent(w)))].sort();
}

export function getUniqueCountries(catalog: Wine[]): string[] {
  return [...new Set(catalog.map((w) => w.continente))].sort();
}

export function getWineTypes(catalog: Wine[]): string[] {
  return [...new Set(catalog.map((w) => w.tipo))].sort();
}
