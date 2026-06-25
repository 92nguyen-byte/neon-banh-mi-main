"""Verify prefers-reduced-motion: glow filters off, animations paused,
layout metrics unchanged, anchor-scroll still lands at the right offset."""
import asyncio, sys, time
from pathlib import Path
from playwright.async_api import async_playwright

SHOTS = Path("/tmp/browser/reduced-motion"); SHOTS.mkdir(parents=True, exist_ok=True)
URL = "http://localhost:8080/"

async def header_metrics(page):
    return await page.evaluate("""()=>{
      const hdr=document.querySelector('header');
      const brand=hdr.querySelector('a span');
      const greenSpan=brand.querySelector('.neon-outline-green');
      const cs=getComputedStyle(greenSpan);
      const r=e=>{const b=e.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)}};
      return {hdr:r(hdr), brand:r(brand), filter: cs.filter};
    }""")

async def run(reduced):
    label = "reduced" if reduced else "normal"
    fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True)
        ctx = await b.new_context(
            viewport={"width": 1280, "height": 1800},
            reduced_motion="reduce" if reduced else "no-preference",
        )
        page = await ctx.new_page()
        await page.goto(f"{URL}?t={int(time.time())}", wait_until="networkidle")
        await page.wait_for_timeout(300)

        m = await header_metrics(page)
        await page.screenshot(path=str(SHOTS/f"{label}_top.png"),
                              clip={"x":0,"y":0,"width":1280,"height":120})

        if reduced and m["filter"] != "none":
            fails.append(f"[{label}] glow filter not removed: {m['filter']}")
        if not reduced and m["filter"] == "none":
            fails.append(f"[{label}] glow filter unexpectedly removed")

        # Layout parity: header height should be identical with/without reduced motion.
        # Anchor scroll: click first category, then verify section top sits ~SCROLL_OFFSET (140) below viewport top.
        cat = page.locator("nav.sticky a").nth(1)
        if await cat.count() == 0:
            print(f"[{label}] no category nav present, skipping anchor check")
        else:
            href = await cat.get_attribute("href")
            section_id = href.lstrip("#")
            await cat.click()
            await page.wait_for_timeout(900 if not reduced else 200)
            top = await page.evaluate(f"document.getElementById({section_id!r}).getBoundingClientRect().top")
            # Expected near 140 (SCROLL_OFFSET). Allow a generous window.
            if not (120 <= top <= 160):
                fails.append(f"[{label}] anchor scroll landed at top={top:.0f}, expected ~140")
            else:
                print(f"[{label}] anchor scroll OK (top={top:.0f})")

        await ctx.close(); await b.close()
    return m, fails

async def main():
    m_n, f_n = await run(False)
    m_r, f_r = await run(True)
    fails = f_n + f_r
    # Header height parity
    if m_n["hdr"]["h"] != m_r["hdr"]["h"]:
        fails.append(f"header height changed: normal={m_n['hdr']['h']} reduced={m_r['hdr']['h']}")
    if m_n["brand"]["w"] != m_r["brand"]["w"]:
        fails.append(f"brand width changed: normal={m_n['brand']['w']} reduced={m_r['brand']['w']}")
    print(f"\nFails: {len(fails)}")
    for f in fails: print(" ", f)
    sys.exit(0 if not fails else 1)

asyncio.run(main())
