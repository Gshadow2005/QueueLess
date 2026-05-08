/**
 * QueueLess k6 Browser Flow
 * Target: https://queueless-ph.vercel.app
 *
 * Screenshots → k6/screenshots/
 *
 * Run:
 *   & "C:\Program Files\k6\k6.exe" run k6/browser-flow.js
 *
 * Env vars:
 *   BASE_URL      – default: https://queueless-ph.vercel.app
 *   TICKET_OFFSET – spots above current serving number (default: 5)
 *   TICKET_STEP   – extra per-VU so concurrent VUs don't collide (default: 1)
 *   VUS           – number of virtual users (default: 1)
 */

import { browser } from "k6/browser";
import { check, sleep } from "k6";

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL       = __ENV.BASE_URL      || "https://queueless-ph.vercel.app";
const TICKET_OFFSET  = parseInt(__ENV.TICKET_OFFSET || "5");
const TICKET_STEP    = parseInt(__ENV.TICKET_STEP   || "1");
const TIMEOUT        = 25000;
const SS_DIR         = "k6/screenshots";

// ── k6 scenario ───────────────────────────────────────────────────────────────

export const options = {
  scenarios: {
    queue_flow: {
      executor:   "per-vu-iterations",
      vus:        __ENV.VUS ? parseInt(__ENV.VUS) : 1,
      iterations: 1,
      options: { browser: { type: "chromium" } },
    },
  },
  thresholds: {
    browser_web_vital_lcp:  ["p(75)<6000"],
    browser_web_vital_fcp:  ["p(75)<3000"],
    browser_web_vital_ttfb: ["p(75)<2000"],
    browser_web_vital_inp:  ["p(75)<500"],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Poll until any text node contains `text` (case-insensitive). Throws on timeout. */
async function waitText(page, text, timeout = TIMEOUT) {
  const lower    = text.toLowerCase();
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const found = await page.evaluate((t) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.toLowerCase().includes(t)) return true;
      }
      return false;
    }, lower);
    if (found) return;
    await sleep(0.25);
  }
  throw new Error(`Timeout (${timeout}ms): text "${text}" never appeared`);
}

/** Wait until the predicate (page text) is ABSENT. Useful to confirm screen changed. */
async function waitTextGone(page, text, timeout = TIMEOUT) {
  const lower    = text.toLowerCase();
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const found = await page.evaluate((t) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.toLowerCase().includes(t)) return true;
      }
      return false;
    }, lower);
    if (!found) return;
    await sleep(0.25);
  }
  throw new Error(`Timeout (${timeout}ms): text "${text}" never disappeared`);
}

/** Returns true if any text node contains `text` (case-insensitive). Never throws. */
async function pageHasText(page, text) {
  const lower = text.toLowerCase();
  return page.evaluate((t) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.toLowerCase().includes(t)) return true;
    }
    return false;
  }, lower).catch(() => false);
}

/** Click the first <button> whose trimmed text matches label exactly. */
async function clickButtonByText(page, label, timeout = TIMEOUT) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const clicked = await page.evaluate((lbl) => {
      for (const btn of document.querySelectorAll("button")) {
        if (btn.textContent.trim() === lbl && !btn.disabled) {
          btn.click();
          return true;
        }
      }
      return false;
    }, label);
    if (clicked) return;
    await sleep(0.25);
  }
  throw new Error(`Button "${label}" not found/disabled after ${timeout}ms`);
}

/** Log every visible text node — call when something fails. */
async function dumpText(page, vuId) {
  const texts = await page.evaluate(() => {
    const out = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const t = node.textContent.trim();
      if (t.length > 2) out.add(t);
    }
    return [...out].slice(0, 80);
  }).catch(() => []);
  console.log(`[VU ${vuId}] DOM text dump:\n  ${texts.join("\n  ")}`);
}

/** Save screenshot to SS_DIR. */
async function screenshot(page, label) {
  const path = `${SS_DIR}/k6-${label}-vu${__VU}-${Date.now()}.png`;
  try {
    await page.screenshot({ path });
    console.log(`[VU ${__VU}] screenshot: ${path}`);
  } catch (e) {
    console.log(`[VU ${__VU}] screenshot failed: ${e.message}`);
  }
}

/**
 * Read the "NOW SERVING" number from the Enter Queue Number screen.
 *
 * From the screenshot, the DOM looks like:
 *   <p style="...">NOW SERVING</p>
 *   <p class="font-head" style="...font-size:2.25rem...">  #30  </p>
 *
 * Strategy: find all text nodes that look like "#NN" or just "NN" (large numbers),
 * pick the first one that is a positive integer.
 * Also try reading the label "NOW SERVING" then getting the next sibling's text.
 */
async function readServingNumber(page) {
  return page.evaluate(() => {
    // Strategy 1: find a text node that is exactly "#NN" or "NN"
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    const candidates = [];
    while ((node = walker.nextNode())) {
      const raw = node.textContent.trim();
      // Match "#30" or "30" patterns — pure numbers or # + number
      const m = raw.match(/^#?(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > 0 && n < 10000) candidates.push({ n, el: node.parentElement });
      }
    }

    if (candidates.length === 0) return null;

    // Strategy 2: prefer a candidate whose parent is near a "NOW SERVING" label
    for (const { n, el } of candidates) {
      // Walk siblings/parent to see if "NOW SERVING" or "now serving" is nearby
      let search = el;
      for (let i = 0; i < 6; i++) {
        if (!search) break;
        if (search.textContent.toLowerCase().includes("now serving")) {
          return n;
        }
        search = search.parentElement;
      }
    }

    // Fallback: return the first candidate that looks like a realistic queue number
    // (not 1 — "1" might be "PEOPLE IN QUEUE" count, pick the larger one)
    const sorted = candidates.map(c => c.n).filter(n => n > 1).sort((a, b) => b - a);
    return sorted[0] ?? null;
  }).catch(() => null);
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default async function () {
  const vuId = __VU;
  console.log(`[VU ${vuId}] Starting`);

  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);

  try {

    // ── Step 1: Landing page ─────────────────────────────────────────────────
    console.log(`[VU ${vuId}] 1. Landing page`);
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await waitText(page, "Get Started");

    check(page, { "1. landing page loaded": (p) => p.url().includes("queueless") });

    // ── Step 2: Open the app ─────────────────────────────────────────────────
    console.log(`[VU ${vuId}] 2. Clicking Get Started`);
    await clickButtonByText(page, "Get Started");
    await waitText(page, "Where do you need to queue");

    check(page, { "2. institution list visible": () => true });
    await screenshot(page, "step2-list");

    // ── Step 3: Pick first Open institution ──────────────────────────────────
    console.log(`[VU ${vuId}] 3. Selecting institution`);
    await waitText(page, "Open");

    const institutionName = await page.evaluate(() => {
      const spans = [...document.querySelectorAll("span")].filter(
        (s) => s.textContent.trim() === "Open"
      );
      if (!spans.length) throw new Error("No 'Open' spans found");
      for (const span of spans) {
        let el = span.parentElement;
        while (el && el.tagName !== "BODY") {
          const s = window.getComputedStyle(el);
          if (s.cursor === "pointer" && parseFloat(s.opacity) > 0.6) {
            const nameEl = el.querySelector("p");
            el.click();
            return nameEl ? nameEl.textContent.trim() : "unknown";
          }
          el = el.parentElement;
        }
      }
      throw new Error("No clickable Open institution card found");
    });

    console.log(`[VU ${vuId}]   Selected: "${institutionName}"`);
    check(institutionName, { "3. open institution selected": (n) => n.length > 0 });

    // ── Step 4: JoinQueue → Continue ─────────────────────────────────────────
    console.log(`[VU ${vuId}] 4. Join screen`);
    await waitText(page, "What to expect");
    check(page, { "4. join screen visible": () => true });
    await screenshot(page, "step4-join");
    await clickButtonByText(page, "Continue");

    // ── Step 5: Enter queue number ────────────────────────────────────────────
    console.log(`[VU ${vuId}] 5. Enter number screen`);
    await waitText(page, "Enter your queue number");
    check(page, { "5. enter-number screen visible": () => true });

    // The context card shows "NOW SERVING" — wait for it to load with a real number
    await waitText(page, "NOW SERVING");

    // Small pause so the async institution fetch (useEnterQueueState polls every 5s)
    // has time to populate the card numbers
    sleep(1.5);

    await screenshot(page, "step5-before-input");

    // Dump the DOM here so we can see exactly what numbers are visible
    await dumpText(page, vuId);

    // Read the live serving number
    const servingNumber = await readServingNumber(page);
    console.log(`[VU ${vuId}]   Serving number read: ${servingNumber}`);

    check(servingNumber !== null && servingNumber > 0, {
      "5. serving number readable from DOM": (v) => v,
    });

    if (servingNumber === null) {
      throw new Error("Could not read serving number — cannot pick a safe ticket");
    }

    // ticket = serving + offset + per-VU step
    // e.g. serving=30, offset=5 → VU1=36, VU2=37, VU3=38
    const ticketNumber = servingNumber + TICKET_OFFSET + (vuId - 1) * TICKET_STEP;
    console.log(`[VU ${vuId}]   Ticket to use: #${ticketNumber}  (serving #${servingNumber} + ${TICKET_OFFSET} + ${vuId - 1})`);

    // Type the ticket number
    await page.waitForSelector('input[type="number"]', { timeout: TIMEOUT });
    await page.click('input[type="number"]');
    await page.keyboard.press("Control+A");
    await page.keyboard.type(String(ticketNumber));

    // Wait for "Entered" badge
    const enteredDeadline = Date.now() + 6000;
    let enteredFound = false;
    while (Date.now() < enteredDeadline) {
      enteredFound = await page.evaluate(() =>
        [...document.querySelectorAll("span")].some(s => s.textContent.trim() === "Entered")
      );
      if (enteredFound) break;
      await sleep(0.2);
    }

    check(enteredFound, { "5. ticket accepted (Entered badge shown)": (v) => v });

    // Detect the "already been served" error
    const alreadyServed = await pageHasText(page, "already been served");
    check(!alreadyServed, { "5. ticket is NOT already served": (v) => v });
    if (alreadyServed) {
      console.log(`[VU ${vuId}]   ERROR: #${ticketNumber} already served. Serving was ${servingNumber}. Try a larger TICKET_OFFSET.`);
      await dumpText(page, vuId);
    }

    const spotsOk = await pageHasText(page, "Spots ahead");
    console.log(`[VU ${vuId}]   Spots ahead: ${spotsOk ? "visible" : "not shown"}`);
    await screenshot(page, "step5-number");

    // ── Step 6: Start Tracking → confirm tracker screen ───────────────────────
    console.log(`[VU ${vuId}] 6. Start Tracking`);
    await clickButtonByText(page, "Start Tracking");

    // The Enter Queue Number screen ALSO shows "NOW SERVING" in the context card.
    // So we can't use "now serving" to detect the tracker — we wait for it to
    // disappear from the Enter Number heading, then reappear in the tracker context.
    //
    // Better signal: wait for "Enter your queue number" heading to be GONE,
    // which means we've navigated to the tracker screen.
    console.log(`[VU ${vuId}]   Waiting for screen transition to tracker`);
    await waitTextGone(page, "Enter your queue number");

    // Now wait for tracker-specific content
    await waitText(page, "Session info");   // TrackerLayout sidebar — not on any other screen
    await screenshot(page, "step6-tracker");

    // Tracker checks
    const nowServingOk  = await pageHasText(page, "now serving");
    const yourNumberOk  = await pageHasText(page, "your number");
    const sessionInfoOk = await pageHasText(page, "session info");
    const liveBadgeOk   = await pageHasText(page, "live");

    // Status badge value depends on live queue position:
    // "Waiting" (>5 away) | "Almost!" (≤5) | "Next up" (0 ahead) | "At Counter"
    // So we just confirm ONE of those is present rather than hardcoding a value.
    const statusOk = await page.evaluate(() => {
      const validStatuses = ["waiting", "almost", "next up", "at counter", "your turn"];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        const t = node.textContent.toLowerCase().trim();
        if (validStatuses.some(s => t.includes(s))) return true;
      }
      return false;
    });

    check(nowServingOk,  { "6. tracker: Now serving visible":  (v) => v });
    check(yourNumberOk,  { "6. tracker: Your number visible":  (v) => v });
    check(sessionInfoOk, { "6. tracker: Session info visible": (v) => v });
    check(liveBadgeOk,   { "6. tracker: Live badge visible":   (v) => v });
    check(statusOk,      { "6. tracker: Status badge visible": (v) => v });

    if (!yourNumberOk || !liveBadgeOk) {
      await dumpText(page, vuId);
    }

    console.log(`[VU ${vuId}]   Joined! Ticket #${ticketNumber} at "${institutionName}"`);
    sleep(2);

    // ── Step 7: Verify localStorage ──────────────────────────────────────────
    console.log(`[VU ${vuId}] 7. Checking localStorage`);

    const sessionData = await page.evaluate(() => {
      const raw = localStorage.getItem("ql_active_session");
      if (!raw) return null;
      try { return JSON.parse(raw); } catch { return null; }
    });

    check(sessionData !== null, { "7. session saved to localStorage": (v) => v });
    check(sessionData?.sessionId != null, { "7. session has valid sessionId": (v) => v });
    check(sessionData?.yourNumber === ticketNumber, { "7. session stores correct ticket": (v) => v });

    if (sessionData) {
      console.log(`[VU ${vuId}]   sessionId:   ${sessionData.sessionId}`);
      console.log(`[VU ${vuId}]   institution: ${sessionData.institutionName}`);
      console.log(`[VU ${vuId}]   ticket:      #${sessionData.yourNumber}`);
      console.log(`[VU ${vuId}]   joinedAt:    ${sessionData.joinedAt}`);
    } else {
      console.log(`[VU ${vuId}]   WARNING: ql_active_session not in localStorage`);
    }

    await screenshot(page, "step7-done");
    console.log(`[VU ${vuId}] Flow complete`);

  } catch (err) {
    await screenshot(page, "error");
    await dumpText(page, vuId).catch(() => {});
    console.error(`[VU ${vuId}] FAILED – ${err.message}`);
    throw err;
  } finally {
    await page.close();
  }
}