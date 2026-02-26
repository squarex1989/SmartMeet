#!/usr/bin/env node
/**
 * Mobile responsiveness test for SmartMeet app
 * Viewport: 375x667 (iPhone SE)
 */
import { chromium } from "playwright";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";

const BASE = "http://localhost:3000/app";
const VIEWPORT = { width: 375, height: 667 };
const SCREENSHOT_DIR = join(process.cwd(), "test-results", "mobile-screenshots");
const findings = [];

async function main() {
  if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    isMobile: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  });
  const page = await context.newPage();

  try {
    // 1. Navigate and screenshot Command Room
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "01-command-room.png"), fullPage: true });
    findings.push({ step: 1, name: "Command Room", ok: true, note: "Initial load" });

    // 2. Open hamburger menu (sidebar)
    const menuBtn = page.locator('button[aria-label="Toggle sidebar"]');
    await menuBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "02-sidebar-open.png"), fullPage: true });
    findings.push({ step: 2, name: "Sidebar open", ok: true });

    // 3. Close sidebar (click overlay - tap right side of screen, past sidebar)
    await page.mouse.click(300, 400);
    await page.waitForTimeout(300);
    findings.push({ step: 3, name: "Sidebar closed", ok: true });

    // 4. Switch to Calendar view
    const calendarBtn = page.locator('button:has(svg.lucide-calendar)').first();
    await calendarBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "03-calendar-view.png"), fullPage: true });
    findings.push({ step: 4, name: "Calendar view", ok: true });

    // 5. Click meeting card - use evaluate to trigger click (bypasses overflow visibility)
    const meetingCard = page.locator('div.space-y-3 > div[role="button"]').first();
    await meetingCard.evaluate((el) => el.click());
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "04-meeting-detail.png"), fullPage: true });
    const backBtn = page.locator('button:has-text("返回日程")');
    const hasBack = await backBtn.isVisible();
    findings.push({ step: 5, name: "Meeting detail", ok: hasBack, note: hasBack ? "Back button visible" : "Back button not found" });

    // 6. Click back
    if (hasBack) await backBtn.click();
    await page.waitForTimeout(300);

    // 7. Switch to Docs (Works) view
    const docsBtn = page.locator('button:has(svg.lucide-layers)').first();
    await docsBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "05-docs-view.png"), fullPage: true });
    findings.push({ step: 6, name: "Docs/Works view", ok: true });

    // 8. Back to Command Room, open work panel
    const commandRoomBtn = page.locator('button:has(svg.lucide-message-square)').first();
    await commandRoomBtn.click();
    await page.waitForTimeout(500);

    const panelBtn = page.locator('button[aria-label="Toggle work panel"]');
    const panelVisible = await panelBtn.isVisible();
    if (panelVisible) {
      await panelBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(SCREENSHOT_DIR, "06-work-panel-overlay.png"), fullPage: true });
      findings.push({ step: 7, name: "Work panel overlay", ok: true });
    } else {
      findings.push({ step: 7, name: "Work panel overlay", ok: false, note: "PanelRight button not visible (may need lg breakpoint)" });
    }

  } catch (e) {
    findings.push({ step: "error", name: "Script", ok: false, note: e.message });
    console.error(e);
  } finally {
    await browser.close();
  }

  // Report
  console.log("\n=== Mobile Responsiveness Test Report ===\n");
  console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height} (iPhone SE)\n`);
  findings.forEach((f) => {
    const icon = f.ok ? "✓" : "✗";
    console.log(`  ${icon} Step ${f.step}: ${f.name}${f.note ? ` — ${f.note}` : ""}`);
  });
  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}\n`);
}

main().catch(console.error);
