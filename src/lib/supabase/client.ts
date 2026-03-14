import { createBrowserClient } from "@supabase/ssr";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = ReturnType<typeof createBrowserClient<any>>;

let client: Client | null = null;

export function createClient(): Client | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!client) {
    client = createBrowserClient(url, anonKey);
  }
  return client;
}
