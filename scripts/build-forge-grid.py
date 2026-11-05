"""Build the 12 images for The_Forge intro grid (components/sections/ForgeIntro.tsx) as 16:10 WebP crops.

Sources are the project screenshots already in /public, plus four captures that are not files on their own:
one video frame (the ShetNiyojan loop at 8 s, via ffmpeg) and three renders captured from the running site (the
Orpheus orb, the Smart Pathshala diagram and Weave's architecture diagram from its Details panel). Put those four
in a folder and pass it as the first argument. Needs Pillow:  python3 scripts/build-forge-grid.py /path/to/captures
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public"
CAPS = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT
OUT = ROOT / "forge"
OUT.mkdir(exist_ok=True)

# (output name, source, horizontal focus 0..1, vertical focus 0..1)
ITEMS = [
    ("weave-hero", ROOT / "weave-hero.png", 0.12, 0.5),
    ("warcast-home", ROOT / "covers/warcast-home.webp", 0.5, 0.0),
    ("legify-home", ROOT / "covers/legify-home.webp", 0.5, 0.0),
    ("shetniyojan-home", ROOT / "covers/shetniyojan-home.webp", 0.5, 0.0),
    ("orpheus-orb", CAPS / "orpheus.png", 0.5, 0.5),
    ("warcast-search", ROOT / "covers/warcast-search.webp", 0.5, 0.0),
    ("legify-dashboard", ROOT / "covers/legify-dashboard.webp", 0.5, 0.0),
    ("pathshala-architecture", CAPS / "pathshala.png", 0.5, 0.5),
    ("weave-architecture", CAPS / "weave-arch.png", 0.0, 0.5),
    ("warcast-code", ROOT / "covers/warcast-code.webp", 0.5, 0.0),
    ("shetniyojan-insights", CAPS / "shet-8.png", 0.5, 0.0),
    ("warcast-dashboard", ROOT / "covers/warcast-dashboard.webp", 0.5, 0.62),
]
W, H = 960, 600  # 16:10

for name, src, fx, fy in ITEMS:
    im = Image.open(src).convert("RGB")
    target = W / H
    if im.width / im.height > target:  # too wide: crop the sides
        cw = round(im.height * target)
        x0 = round((im.width - cw) * fx)
        im = im.crop((x0, 0, x0 + cw, im.height))
    else:  # too tall: crop top/bottom
        ch = round(im.width / target)
        y0 = round((im.height - ch) * fy)
        im = im.crop((0, y0, im.width, y0 + ch))
    im = im.resize((W, H), Image.LANCZOS)
    im.save(OUT / f"{name}.webp", "WEBP", quality=78, method=6)
    print(f"forge/{name}.webp {(OUT / f'{name}.webp').stat().st_size // 1024} KB")
