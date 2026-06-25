"""Capture default / hover / focus / active states for the menu button and
category links across mobile + desktop breakpoints, and assert focus rings
are visible against the neon background."""
import asyncio, sys, time
from pathlib import Path
from playwright.async_api import async_playwright

SHOTS = Path("/tmp/browser/nav-states"); SHOTS.mkdir(parents=True, exist_ok=True)
URL = "http://localhost:8080/"
BREAKS = [
    ("mobile-320", 320, 760),
    ("mobile-360", 360, 760),
    ("mobile-430", 430, 760),
    ("tablet-820", 820, 1180),
    ("desktop-1280", 1280, 900),
]

async def shoot(page, name):
    await page.wait_for_timeout(120)
    await page.screenshot(path=str(SHOTS/f"{name}.png"),
                          clip={"x":0,"y":0,"width":page.viewport_size["width"],"height":220})

async def ring_visible(page, locator):
    # focus-visible only triggers after keyboard input modality. Press Tab once
    # to flip Chromium into keyboard-focus mode, then programmatically focus
    # the target element and read its computed box-shadow.
    await page.keyboard.press("Tab")
    return await locator.evaluate("""el=>{
      el.focus();
      const cs=getComputedStyle(el);
      return cs.boxShadow && cs.boxShadow !== 'none';
    }""")


async def main():
    fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True)
        ctx = await b.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()
        await page.goto(f"{URL}?t={int(time.time())}", wait_until="networkidle")

        for label, w, h in BREAKS:
            await page.set_viewport_size({"width": w, "height": h})
            await page.wait_for_timeout(200)
            is_mobile = w < 768

            # ---- Menu button (mobile) or nav link (desktop) ----
            if is_mobile:
                btn = page.locator("header button[aria-label='Öppna meny']")
                await page.mouse.move(0, 0)
                await shoot(page, f"{label}_btn_default")
                await btn.hover()
                await shoot(page, f"{label}_btn_hover")
                if not await ring_visible(page, btn):
                    fails.append(f"[{label}] menu button focus ring not visible")
                await shoot(page, f"{label}_btn_focus")
                await btn.click()  # active/open
                await page.wait_for_timeout(150)
                await shoot(page, f"{label}_btn_active_open")
                await btn.click()  # close
                await page.wait_for_timeout(150)
            else:
                link = page.locator("header nav.md\\:flex a").first
                await page.mouse.move(0, 0)
                await shoot(page, f"{label}_navlink_default")
                await link.hover()
                await shoot(page, f"{label}_navlink_hover")
                if not await ring_visible(page, link):
                    fails.append(f"[{label}] desktop nav link focus ring not visible")
                await shoot(page, f"{label}_navlink_focus")

            # ---- Category nav links (only on /) ----
            cats = page.locator("nav.sticky a")
            n = await cats.count()
            if n >= 2:
                await page.evaluate("window.scrollTo(0,0)")
                await page.wait_for_timeout(100)
                first = cats.nth(0)
                second = cats.nth(1)
                await page.mouse.move(0, 0)
                await shoot(page, f"{label}_cat_default")
                await second.hover()
                await shoot(page, f"{label}_cat_hover")
                if not await ring_visible(page, second):
                    fails.append(f"[{label}] category link focus ring not visible")
                await shoot(page, f"{label}_cat_focus")
                # Active state: first link should carry aria-current at top of page.
                aria = await first.get_attribute("aria-current")
                if aria != "true":
                    fails.append(f"[{label}] first category missing aria-current=true (got {aria!r})")
                await shoot(page, f"{label}_cat_active")
            else:
                fails.append(f"[{label}] category nav not found")

        await ctx.close(); await b.close()

    print(f"\nFails: {len(fails)}")
    for f in fails: print(" ", f)
    sys.exit(0 if not fails else 1)

asyncio.run(main())
