import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { USE_MOCK } from "@/services/api";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

let cachedClient: SupabaseClient | null = null;

export function isRealtimeConfigured(): boolean {
  return !USE_MOCK && Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined" || !isRealtimeConfigured()) return null;
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return cachedClient;
}
