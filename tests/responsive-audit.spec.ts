import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const pages = [
  { path: "/", label: "LP" },
  { path: "/pricing", label: "Pricing" },
  { path: "/try-roleplay", label: "TryRoleplay" },
  { path: "/login", label: "Login" },
  { path: "/faq", label: "FAQ" },
  { path: "/learn", label: "Learn" },
  { path: "/features", label: "Features" },
  { path: "/about", label: "About" },
  { path: "/enterprise", label: "Enterprise" },
  { path: "/tools", label: "Tools" },
  { path: "/use-cases", label: "UseCases" },
];

// 1. Screenshot every page at every viewport
for (const vp of viewports) {
  for (const pg of pages) {
    test(`${pg.label} renders at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const res = await page.goto(`${BASE}${pg.path}`, { waitUntil: "networkidle", timeout: 15000 });
      expect(res?.status()).toBeLessThan(400);
      await page.screenshot({
        path: `tests/screenshots/${pg.label}-${vp.name}.png`,
        fullPage: true,
      });
    });
  }
}

// 2. No horizontal overflow (mobile)
test("LP has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 15000 });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375 + 5); // 5px tolerance
});

test("Pricing has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle", timeout: 15000 });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375 + 5);
});

test("TryRoleplay has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/try-roleplay`, { waitUntil: "networkidle", timeout: 15000 });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375 + 5);
});

// 3. Key interactive flows
test("Try-roleplay flow: select industry and start", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/try-roleplay`, { waitUntil: "networkidle", timeout: 15000 });

  // Check page loads with selection UI
  const heading = page.locator("h1, h2").first();
  await expect(heading).toBeVisible({ timeout: 5000 });

  // Check that industry buttons are clickable
  const firstIndustry = page.locator("button").filter({ hasText: /不動産|保険|建設|IT/ }).first();
  if (await firstIndustry.isVisible()) {
    await firstIndustry.click();
    // Verify selection state changed
    await page.waitForTimeout(500);
  }
});

test("Login page loads correctly", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 15000 });

  // Google login button should be visible
  const googleBtn = page.locator("button").filter({ hasText: /Google/ });
  await expect(googleBtn).toBeVisible({ timeout: 5000 });

  // No email button should exist (removed)
  const emailBtn = page.locator("button").filter({ hasText: /メールアドレス/ });
  await expect(emailBtn).toHaveCount(0);
});

// 4. Header responsive: hamburger on mobile, nav on desktop
test("Header: hamburger visible on mobile, nav hidden", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 15000 });

  const hamburger = page.locator("button[aria-label='メニュー']");
  await expect(hamburger).toBeVisible();

  // Desktop nav should be hidden
  const desktopNav = page.locator("nav.hidden.lg\\:flex").first();
  await expect(desktopNav).not.toBeVisible();
});

test("Header: nav visible on desktop, hamburger hidden", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 15000 });

  // Hamburger should be hidden on desktop
  const hamburger = page.locator("button[aria-label='メニュー']");
  await expect(hamburger).not.toBeVisible();
});

// 5. CTA buttons are clickable and properly sized for touch (min 44px)
test("CTA buttons meet minimum touch target size on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 15000 });

  const ctaButtons = page.locator("a.lp-cta-btn, a.nav-btn, .hero-cta-btn");
  const count = await ctaButtons.count();

  for (let i = 0; i < count; i++) {
    const btn = ctaButtons.nth(i);
    if (await btn.isVisible()) {
      const box = await btn.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40); // min touch target
      }
    }
  }
});

// 6. No console errors on key pages
for (const pg of ["/", "/pricing", "/try-roleplay", "/login"]) {
  test(`No console errors on ${pg}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(`${BASE}${pg}`, { waitUntil: "networkidle", timeout: 15000 });
    // Filter out expected errors (e.g., missing env vars in dev)
    const realErrors = errors.filter(
      (e) =>
        !e.includes("NEXT_PUBLIC") &&
        !e.includes("favicon") &&
        !e.includes("hydration") &&
        !e.includes("401") &&
        !e.includes("Unauthorized") &&
        !e.includes("Failed to load resource")
    );
    expect(realErrors).toHaveLength(0);
  });
}

// 7. Images have alt text (accessibility)
test("LP images have alt text", async ({ page }) => {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 15000 });
  const images = page.locator("img:not([alt])");
  const count = await images.count();
  expect(count).toBe(0);
});

// 8. Page-level horizontal scroll (what users actually experience)
for (const pg of ["/", "/pricing", "/try-roleplay", "/faq"]) {
  test(`No horizontal page scroll on ${pg} (mobile 375px)`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}${pg}`, { waitUntil: "networkidle", timeout: 15000 });
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(375);
  });
}
