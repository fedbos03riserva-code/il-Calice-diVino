import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

if (import.meta.main) {
  Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceKey);

      const { count: rfqCount } = await supabase
        .from("rfqs")
        .select("*", { count: "exact", head: true });

      const { data: rfqs } = await supabase
        .from("rfqs")
        .select("paese, created_at");

      const countries = new Map<string, number>();
      for (const r of rfqs || []) {
        const c = r.paese || "Unknown";
        countries.set(c, (countries.get(c) || 0) + 1);
      }

      const byCountry = Array.from(countries.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return new Response(
        JSON.stringify({
          rfqTotal: rfqCount || 0,
          countries: byCountry,
          rfqs: rfqs || [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  });
}
