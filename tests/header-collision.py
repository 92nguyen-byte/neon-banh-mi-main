import asyncio, time, sys
from pathlib import Path
from playwright.async_api import async_playwright

SHOTS = Path("/tmp/browser/hdr/screenshots/sweep2"); SHOTS.mkdir(parents=True, exist_ok=True)
URL = "http://localhost:8080/"
WIDTHS = list(range(240, 431, 10))

async def measure(page):
    return await page.evaluate("""()=>{
      const hdr=document.querySelector('header');
      const link=hdr.querySelector('a');
      const spanWrap=link.querySelector('span');
      const btn=hdr.querySelector('button.md\\\\:hidden');
      const nav=hdr.querySelector('nav.md\\\\:flex');
      const r=e=>{const b=e.getBoundingClientRect();return {x:Math.round(b.x),w:Math.round(b.width),h:Math.round(b.height),right:Math.round(b.right)}};
      const trailing = (btn && btn.offsetParent) ? r(btn) : (nav && nav.offsetParent ? r(nav) : null);
      return {hdr:r(hdr), spanWrap:r(spanWrap), trailing, trailingKind: (btn && btn.offsetParent) ? 'btn' : (nav && nav.offsetParent ? 'nav' : 'none')};
    }""")

async def check(page, w, h, label, fails):
    await page.set_viewport_size({"width": w, "height": h})
    await page.wait_for_timeout(120)
    info = await measure(page)
    gap = info["trailing"]["x"] - info["spanWrap"]["right"]
    ok_collision = gap >= 4
    ok_height = info["hdr"]["h"] in (64, 65, 80, 81)
    ok = ok_collision and ok_height
    if not ok:
        fails.append((label, w, h, gap, info))
    return ok, gap, info

async def main():
    fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True)
        ctx = await b.new_context(viewport={"width": 360, "height": 700})
        page = await ctx.new_page()
        await page.goto(f"{URL}?t={int(time.time())}", wait_until="networkidle")
        await page.wait_for_timeout(500)

        for w in WIDTHS:
            ok, gap, info = await check(page, w, 760, "portrait", fails)
            print(f"{'OK ' if ok else 'FAIL'} portrait {w}x760: gap={gap} hdrH={info['hdr']['h']} trailing={info['trailingKind']}")
            if w in (240, 320, 360, 430):
                await page.screenshot(path=str(SHOTS/f"p_{w}.png"), clip={"x":0,"y":0,"width":w,"height":80})

        for w in WIDTHS:
            actual_w = max(w*2, 480)
            ok, gap, info = await check(page, actual_w, 360, "landscape", fails)
            print(f"{'OK ' if ok else 'FAIL'} landscape {actual_w}x360: gap={gap} hdrH={info['hdr']['h']} trailing={info['trailingKind']}")

        await ctx.close()
        await b.close()
    print(f"\nFails: {len(fails)}")
    for f in fails: print(" ", f[:4])
    sys.exit(0 if not fails else 1)

asyncio.run(main())
