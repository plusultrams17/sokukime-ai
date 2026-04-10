// 本番DBのテスターコード実値を確認するスクリプト
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// .env.local 読み込み
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const { data, error } = await supabase
  .from("tester_codes")
  .select("code, description, duration_days, max_uses, current_uses, active")
  .order("code");

if (error) {
  console.error("Query failed:", error);
  process.exit(1);
}

console.log("\n=== 本番DB: tester_codes 実値 ===\n");
console.table(
  data.map((r) => ({
    code: r.code,
    期間: r.duration_days === null ? "無期限" : `${r.duration_days}日`,
    上限: r.max_uses === null ? "無制限" : r.max_uses,
    使用済み: r.current_uses,
    残り: r.max_uses === null ? "∞" : r.max_uses - r.current_uses,
    active: r.active,
  }))
);
