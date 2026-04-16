import { test, expect } from "@playwright/test";

/**
 * Test: ロープレ中にドロワーを開閉しても会話内容が保持されるか確認
 */
test.describe("Lesson Drawer - state preservation", () => {
  test.beforeEach(async ({ page }) => {
    // Set up guest session in sessionStorage before navigating
    await page.goto("http://localhost:3457/try-roleplay");
    await page.evaluate(() => {
      sessionStorage.setItem(
        "guest-roleplay-setup",
        JSON.stringify({
          industry: "IT企業",
          product: "クラウドサービス",
          difficulty: "normal",
          scene: "visit",
          customerType: "corporate",
        })
      );
    });
    await page.goto("http://localhost:3457/try-roleplay/chat");
    // Wait for ChatUI to render
    await page.waitForSelector("text=あなたの第一声からスタートです", {
      timeout: 10000,
    });

    // Dismiss cookie consent banner if present (it overlaps the send button)
    const consentBtn = page.locator("button:has-text('同意する')");
    if (await consentBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test("教材ボタンが表示される", async ({ page }) => {
    const btn = page.locator("button", { hasText: "教材" });
    await expect(btn).toBeVisible();
  });

  test("ドロワーが開閉できる", async ({ page }) => {
    // Click 教材 button
    await page.click("button:has-text('教材')");

    // Drawer should appear
    const drawer = page.locator('[aria-label="教材参照"]');
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-hidden", "false");

    // Close with X button
    await page.click('[aria-label="閉じる"]');
    // Wait for closing transition (300ms) + buffer
    await page.waitForTimeout(500);

    // Drawer should be invisible (visibility: hidden via Tailwind 'invisible')
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    await expect(drawer).not.toBeVisible();
  });

  test("メッセージ送信後にドロワーを開閉しても会話が保持される", async ({
    page,
  }) => {
    // Type a message
    const textarea = page.locator("textarea");
    await textarea.fill(
      "お忙しいところ失礼いたします。本日はクラウドサービスのご提案に参りました。"
    );

    // Send message via Enter key (avoids button occlusion issues)
    await textarea.press("Enter");

    // Wait for user message to appear in chat
    await page.waitForSelector("text=お忙しいところ失礼いたします", {
      timeout: 15000,
    });

    // Verify user message is visible
    const userMsg = page.locator("text=お忙しいところ失礼いたします");
    await expect(userMsg).toBeVisible();

    // Count messages before opening drawer
    const msgCountBefore = await page
      .locator(".whitespace-pre-wrap")
      .count();
    expect(msgCountBefore).toBeGreaterThanOrEqual(1);

    // Open drawer
    await page.click("button:has-text('教材')");
    const drawer = page.locator('[aria-label="教材参照"]');
    await expect(drawer).toBeVisible();

    // Verify lesson content appears in drawer
    const blogContent = drawer.locator(".blog-content");
    await expect(blogContent).toBeVisible({ timeout: 3000 });

    // Switch tabs in drawer
    await page.click("button:has-text('トーク例')");
    await page.waitForTimeout(500);

    // Close drawer
    await page.click('[aria-label="閉じる"]');
    await page.waitForTimeout(500);

    // Verify user message is STILL visible after closing drawer
    await expect(userMsg).toBeVisible();

    // Verify message count is same
    const msgCountAfter = await page
      .locator(".whitespace-pre-wrap")
      .count();
    expect(msgCountAfter).toBe(msgCountBefore);

    // Verify input area is still functional
    await expect(textarea).toBeVisible();
  });

  test("ドロワー内でレッスンを切り替えられる", async ({ page }) => {
    await page.click("button:has-text('教材')");
    const drawer = page.locator('[aria-label="教材参照"]');
    await expect(drawer).toBeVisible();

    // Change lesson via dropdown
    const select = drawer.locator("select");
    await expect(select).toBeVisible();

    // Select a different lesson
    const options = await select.locator("option").all();
    expect(options.length).toBeGreaterThan(1);

    // Pick second option
    const secondValue = await options[1].getAttribute("value");
    if (secondValue) {
      await select.selectOption(secondValue);
      await page.waitForTimeout(300);
    }

    // Content should still be visible
    const content = drawer.locator(".blog-content");
    await expect(content).toBeVisible();
  });

  test("ESCキーでドロワーが閉じる", async ({ page }) => {
    await page.click("button:has-text('教材')");
    const drawer = page.locator('[aria-label="教材参照"]');
    await expect(drawer).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Drawer should be hidden
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    await expect(drawer).not.toBeVisible();
  });

  test("バックドロップクリックでドロワーが閉じる", async ({ page }) => {
    await page.click("button:has-text('教材')");
    const drawer = page.locator('[aria-label="教材参照"]');
    await expect(drawer).toBeVisible();

    // Click backdrop area (the semi-transparent overlay, left side of screen)
    const backdrop = page.locator(".bg-black\\/50").first();
    await backdrop.click({ position: { x: 10, y: 10 }, force: true });
    await page.waitForTimeout(500);

    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    await expect(drawer).not.toBeVisible();
  });
});
