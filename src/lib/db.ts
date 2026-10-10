import { supabase } from "./supabase";
import type { Review, Wine, UserRole } from "../types/wine";

// ── Wine Reviews ──

export async function fetchReviewsFromDB(wineId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("wine_reviews")
    .select("*")
    .eq("wine_id", wineId)
    .order("helpful", { ascending: false });
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    wineId: r.wine_id as string,
    userId: (r.user_email as string) || "",
    userName: r.user_name as string,
    rating: r.rating as number,
    text: r.text as string,
    timestamp: r.created_at as string,
    helpful: r.helpful as number,
  }));
}

export async function fetchAllReviewsFromDB(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("wine_reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    wineId: r.wine_id as string,
    userId: (r.user_email as string) || "",
    userName: r.user_name as string,
    rating: r.rating as number,
    text: r.text as string,
    timestamp: r.created_at as string,
    helpful: r.helpful as number,
  }));
}

export async function insertReviewToDB(review: {
  wine_id: string;
  user_name: string;
  user_email?: string;
  rating: number;
  text: string;
}): Promise<boolean> {
  const { error } = await supabase.from("wine_reviews").insert(review);
  return !error;
}

export async function incrementReviewHelpful(reviewId: string): Promise<boolean> {
  const { error: rpcError } = await supabase.rpc("increment_review_helpful", { review_id: reviewId });
  if (!rpcError) return true;

  const { data } = await supabase
    .from("wine_reviews")
    .select("helpful")
    .eq("id", reviewId)
    .maybeSingle();
  if (!data) return false;

  const { error: e2 } = await supabase
    .from("wine_reviews")
    .update({ helpful: (data.helpful as number) + 1 })
    .eq("id", reviewId);
  return !e2;
}

// ── Platform Users ──

export async function registerUserToDB(user: {
  email: string;
  nome: string;
  role: UserRole;
  telefono?: string;
  partita_iva?: string;
  ragione_sociale?: string;
  paese_attivita?: string;
  winery_id?: string;
}): Promise<boolean> {
  const { error } = await supabase.from("platform_users").upsert(user, { onConflict: "email" });
  return !error;
}

export async function fetchRegisteredUsersFromDB(): Promise<number> {
  const { count, error } = await supabase
    .from("platform_users")
    .select("*", { count: "exact", head: true });
  if (error || count === null) return 0;
  return count;
}

// ── Saved Wines ──

export async function fetchSavedWinesFromDB(userEmail: string): Promise<Wine[]> {
  const { data, error } = await supabase
    .from("saved_wines")
    .select("wine_data")
    .eq("user_email", userEmail);
  if (error || !data) return [];
  return data.map((d: Record<string, unknown>) => d.wine_data as Wine);
}

export async function saveWineToDB(userEmail: string, wine: Wine): Promise<boolean> {
  const { error } = await supabase
    .from("saved_wines")
    .insert({ wine_id: wine.id, user_email: userEmail, wine_data: wine });
  return !error;
}

export async function removeSavedWineFromDB(userEmail: string, wineId: string): Promise<boolean> {
  const { error } = await supabase
    .from("saved_wines")
    .delete()
    .eq("user_email", userEmail)
    .eq("wine_id", wineId);
  return !error;
}
