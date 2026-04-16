import { test, expect } from "@playwright/test";

/**
 * テスターコードURL動作確認
 * 各コードが /activate?code=XXX で正常にページを表示し、
 * 期間表示が正しいことを確認する。
 *
 * 注: 実際の有効化は Google OAuth を要するので未ログイン状態のUI確認のみ。
 */

const BASE_URL = "https://seiyaku-coach.vercel.app";

const CODES = [
  { code: "TESTER14", expectedDuration: "14日", description: "バグ・UX" },
  { code: "FRIEND90", expectedDuration: "90日", description: "友人・知人" },
  { code: "VIP", expectedDuration: "無期限", description: "アンバサダー" },
  { code: "DEMO7", expectedDuration: "7日", description: "商談" },
] as const;

for (const { code, expectedDuration, description } of CODES) {
  test(`/activate?code=${code} が正常表示される (${description})`, async ({ page }) => {
    const url = `${BASE_URL}/activate?code=${code}`;

    // Capture console errors (ignore harmless 401s from unauthenticated supabase session checks)
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("401")) return; // expected for unauth session probe
        consoleErrors.push(text);
      }
    });

    await page.goto(url, { waitUntil: "networkidle" });

    // 1. URL should remain on /activate (not redirected to /auth/callback or /roleplay)
    expect(page.url()).toContain("/activate");
    expect(page.url()).toContain(`code=${code}`);

    // 2. Page should contain the code somewhere
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain(code);

    // 3. Page should show the duration (or "無期限")
    expect(bodyText).toContain(expectedDuration);

    // 4. No runtime errors
    expect(consoleErrors).toEqual([]);

    // Screenshot for manual verification
    await page.screenshot({
      path: `tests/screenshots/activate-${code}.png`,
      fullPage: true,
    });
  });
}
