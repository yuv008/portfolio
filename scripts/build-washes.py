"""Pre-blur the images used as colour washes behind tiles (see components/ui/Wash.tsx).

Blurring a large image live with CSS (filter: blur(64px)) is one of the most expensive things a browser can paint,
so each wash is made once here instead: shrunk, blurred, saturated and saved as a tiny WebP in public/wash/.
Shown at tile size, the browser's smooth upscaling keeps it soft. Needs Pillow:  python3 scripts/build-washes.py
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent / "public"
SOURCES = [
    "weave-hero.png",
    "covers/shetniyojan-home.webp",
    "covers/warcast-home.webp",
    "covers/legify-home.webp",
    "legion/step-problem.webp",
    "legion/step-callers.webp",
    "legion/step-define.webp",
    "legion/step-run.webp",
    "legion/step-fail.webp",
]
OUT = ROOT / "wash"
OUT.mkdir(exist_ok=True)

for rel in SOURCES:
    src = ROOT / rel
    im = Image.open(src).convert("RGB")
    w = 96
    small = im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS)
    # The CSS version blurred by 64px at roughly 900px wide: about 7px at this size.
    soft = small.filter(ImageFilter.GaussianBlur(7))
    soft = ImageEnhance.Color(soft).enhance(1.7)
    name = rel.replace("/", "-").rsplit(".", 1)[0] + ".webp"
    soft.save(OUT / name, "WEBP", quality=80)
    print(f"{rel} -> wash/{name} ({(OUT / name).stat().st_size} bytes)")
