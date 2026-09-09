export type WineType = "Rosso" | "Bianco" | "Rosato" | "Spumante" | "Dolce";
export type PriceFascia = "economico" | "standard" | "premium" | "lusso";

export interface Wine {
  id: string;
  nome: string;
  regione: string;
  continente: string;
  tipo: WineType;
  fascia: PriceFascia;
  prezzo: number;
  uva: string;
  alcol: number;
  acidita: string;
  tannini: string;
  corpo: string;
  residuo_zuccherino: number;
  profilo_aromatico: string[];
  abbina_bene_con: string[];
  non_abbina_con: string[];
  slug: string;
  foto_key: string;
}

export interface IRCScore {
  chimica: number;       // 0-40
  aromatico: number;     // 0-25
  struttura: number;     // 0-20
  pulizia: number;        // 0-15
  totale: number;        // 0-100
}

export interface PairingResult {
  wine: Wine;
  score: IRCScore;
  meccanismo_chimico: string;
  sensazione_in_bocca: string;
  consigli_culinari: string;
  motivo_abbinamento: string;
}

export type UserRole = "privato" | "ristoratore";

export interface User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
}

export interface CartItem {
  wine: Wine;
  quantity: number;
}

export interface SearchHistoryEntry {
  id: string;
  piatto: string;
  filtri: Record<string, string>;
  timestamp: string;
  resultsCount: number;
}

export interface Review {
  id: string;
  wineId: string;
  userId: string;
  userName: string;
  rating: number;       // 1-5
  text: string;
  timestamp: string;
  helpful: number;
}

export interface RestaurantWine {
  id: string;
  ownerId: string;
  nome: string;
  regione: string;
  tipo: WineType;
  uva: string;
  alcol: number;
  acidita: string;
  tannini: string;
  corpo: string;
  profilo_aromatico: string[];
  prezzo: number;
  foto: string;
  stock?: number;
}

export interface Order {
  number: string;
  items: CartItem[];
  total: number;
  shipping: number;
  vat: number;
  date: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export type Language = "it" | "en" | "fr" | "es" | "de";
