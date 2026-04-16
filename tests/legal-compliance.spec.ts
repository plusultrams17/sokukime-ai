import { test, expect } from "@playwright/test";

/**
 * Legal Compliance Test Suite
 *
 * Verifies that the following trademark/copyright cleanup and compliance fixes are:
 * 1. Not present in marketing/product pages (確実に, 絶対, 期間限定)
 * 2. Redirects are properly configured (program, legacy paths)
 * 3. Legal pages contain required compliance statements
 *
 * Test Coverage:
 * - Homepage / About page (no protected terms in marketing)
 * - Pricing page (景表法 compliance)
 * - Legal pages (tokushoho, terms, privacy)
 * - Redirect functionality
 */

const BASE_URL = "https://seiyaku-coach.vercel.app";

/**
 * 1. Marketing Page Tests — Ensure no problematic terms in customer-facing content
 */
test.describe("Marketing Pages — Legal Compliance", () => {
  test("Homepage should not contain prohibited guarantee claims", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Marketing should not guarantee results
    expect(bodyText).not.toMatch(/必ず成果が出|絶対に成功|確実に売上が|必ず上がります/);

    // Educational content is OK (teaching "what not to do")
    // But avoid absolute product claims
  });

  test("About page should not misrepresent product capabilities", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Should not contain absolute claims about guaranteed results
    expect(bodyText).not.toMatch(/絶対に結果が出|必ず成約率が/);

    // Own methodology references (sokketsu) are OK
    expect(bodyText).toContain("成約5ステップメソッド");
  });

  test("Pricing page should comply with 景表法 (Act against Unjustifiable Premiums)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Check for problematic terms in pricing context
    // NOTE: Code comments don't count as user-facing violations

    // Should not make absolute claims about ROI/guaranteed results
    expect(bodyText).not.toMatch(/絶対に利益が出|必ずペイできます|確実に回収/);

    // Should have clear plan differentiation
    expect(bodyText).toContain("Starter");
    expect(bodyText).toContain("Pro");
    expect(bodyText).toContain("Master");

    // Plans should show clear pricing (no vague "limited time" claims)
    expect(bodyText).toContain("¥");
  });

  test("Features page should use cautious language for claims", async ({
    page,
  }) => {
    const pagestoCheck = [
      "/features/scoring",
      "/features/ai-coach",
      "/features/worksheet",
    ];

    for (const pageUrl of pagestoCheck) {
      await page.goto(`${BASE_URL}${pageUrl}`, { waitUntil: "networkidle" });
      const bodyText = await page.locator("body").innerText();

      // Features should not make absolute outcome guarantees
      // (educational language about techniques is OK)
      expect(bodyText).not.toMatch(/絶対に売上が|確実に成約率が/);
    }
  });
});

/**
 * 2. Redirect & Legacy Path Tests
 */
test.describe("Legacy Path Handling", () => {
  test("/program should redirect to /pricing", async ({ page }) => {
    // Use navigationPromise to catch redirect
    const response = await page.goto(`${BASE_URL}/program`, {
      waitUntil: "networkidle",
    });

    // Check final URL after redirect
    expect(page.url()).toContain("/pricing");
  });

  test("/program/success should redirect to /program/resources", async ({
    page,
  }) => {
    const response = await page.goto(`${BASE_URL}/program/success`, {
      waitUntil: "networkidle",
    });

    expect(page.url()).toContain("/program/resources");
  });

  test("/api/stripe/checkout-program should return 410 Gone", async ({
    context,
  }) => {
    const response = await context.request.post(
      `${BASE_URL}/api/stripe/checkout-program`,
      {
        data: { priceId: "test" },
      }
    );

    expect(response.status()).toBe(410);
  });
});

/**
 * 3. Legal Pages Tests
 */
test.describe("Legal Pages Compliance", () => {
  test("特商法 (TOKUSHOHO) page should be accessible and complete", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/legal/tokushoho`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Required sections for 特商法
    expect(bodyText).toContain("事業者");
    expect(bodyText).toContain("支払方法");
    expect(bodyText).toContain("返金");
    expect(bodyText).toContain("キャンセル");

    // Should mention the refund policy change (no 14-day guarantee after 2026-04-11)
    expect(bodyText).toContain("原則");
  });

  test("Terms of Service page should be accessible", async ({ page }) => {
    await page.goto(`${BASE_URL}/legal/terms`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Should have basic T&C content
    expect(bodyText.length).toBeGreaterThan(500);
    expect(bodyText).toContain("利用規約");
  });

  test("Privacy Policy page should be accessible", async ({ page }) => {
    await page.goto(`${BASE_URL}/legal/privacy`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Should have basic privacy content
    expect(bodyText.length).toBeGreaterThan(500);
    expect(bodyText).toContain("プライバシー");
  });
});

/**
 * 4. Plan Feature Gate Tests
 */
test.describe("Plan Feature Accuracy", () => {
  test("Free plan should show lifetime limit of 5 roleplay uses", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });

    const freeCard = page.locator("[data-plan='free']");
    if (await freeCard.isVisible()) {
      const cardText = await freeCard.innerText();
      expect(cardText).toContain("5回");
    }
  });

  test("Starter plan should show 30 monthly uses", async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });

    const starterCard = page.locator("[data-plan='starter']");
    if (await starterCard.isVisible()) {
      const cardText = await starterCard.innerText();
      expect(cardText).toContain("30");
      expect(cardText).toContain("月");
    }
  });

  test("Pro plan should show 60 monthly uses", async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });

    const proCard = page.locator("[data-plan='pro']");
    if (await proCard.isVisible()) {
      const cardText = await proCard.innerText();
      expect(cardText).toContain("60");
      expect(cardText).toContain("月");
    }
  });

  test("Master plan should show 200 monthly uses", async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });

    const masterCard = page.locator("[data-plan='master']");
    if (await masterCard.isVisible()) {
      const cardText = await masterCard.innerText();
      expect(cardText).toContain("200");
      expect(cardText).toContain("月");
    }
  });
});

/**
 * 5. Educational Content Exceptions
 *
 * These terms ARE allowed in educational contexts (lessons, blog, training)
 * This test confirms they appear appropriately.
 */
test.describe("Educational Content (Allowed Exceptions)", () => {
  test("Blog should contain teaching methodology with appropriate terms", async ({
    page,
  }) => {
    // Example blog post about sales techniques
    await page.goto(
      `${BASE_URL}/blog/sokketsu-eigyo-method-guide`,
      { waitUntil: "networkidle" }
    );
    const bodyText = await page.locator("body").innerText();

    // Educational content can mention techniques including "絶対NG" (absolute don'ts)
    expect(bodyText).toContain("成約5ステップメソッド");

    // Teaching "what NOT to do" is OK
    expect(bodyText).toMatch(/絶対に?[^。]*NG|不可/);
  });

  test("Lesson pages can teach techniques with strong language", async ({
    page,
  }) => {
    // Lessons teach specific techniques
    await page.goto(`${BASE_URL}/learn/lessons/1`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Educational content is allowed
    expect(bodyText.length).toBeGreaterThan(300);
  });
});

/**
 * 6. Activation Code Promotion Accuracy Test
 */
test.describe("Promotional Code Accuracy", () => {
  test("/activate page should show actual time-limited code benefits", async ({
    page,
  }) => {
    // Test with a valid code
    await page.goto(`${BASE_URL}/activate?code=TESTER14`, {
      waitUntil: "networkidle",
    });

    const bodyText = await page.locator("body").innerText();

    // Should show the duration tied to the specific code
    expect(bodyText).toContain("TESTER14");
    expect(bodyText).toContain("14日");

    // Should not make vague "unlimited" claims
    // Each code should have specific duration
  });
});

/**
 * 7. Stripe Webhook Integration Test (if applicable)
 */
test.describe("Subscription Plan Mapping", () => {
  test("Pricing page plan names should match database enum", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();

    // Enum values: free, starter, pro, master
    // All should be displayed
    expect(bodyText).toContain("Free");
    expect(bodyText).toContain("Starter");
    expect(bodyText).toContain("Pro");
    expect(bodyText).toContain("Master");

    // JPY pricing should be shown
    expect(bodyText).toContain("¥");
  });
});
