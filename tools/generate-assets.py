"""
Generates the raster brand assets in /public from code, so they can be
re-created after any change to the logo or palette:

    pip install pillow
    python tools/generate-assets.py [path/to/portrait.png]

Outputs: favicon.ico, apple-touch-icon.png, icons/icon-192.png,
icons/icon-512.png, icons/icon-maskable-512.png, og-image.png and (when a
portrait is passed) images/amir-iravani.webp.

The geometry mirrors public/favicon.svg and src/app/shared/logo.ts
(64×64 viewBox).
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

ROSE = (255, 46, 99)
VIOLET = (139, 92, 246)
SUN = (255, 179, 0)
TILE = (11, 11, 20)
BG = (7, 7, 12)
TEXT = (244, 242, 238)
MUTED = (164, 163, 178)

# Strokes of the monogram in the 64-unit viewBox: A-diagonal + top bar, i-stem, crossbar.
STROKES = [[(14, 50), (31, 14), (48, 14)], [(48, 14), (48, 50)], [(22.5, 37), (48, 37)]]
SUN_CENTER, SUN_R, STROKE_W = (48, 14), 4.5, 6


def lerp(a: tuple[int, ...], b: tuple[int, ...], t: float) -> tuple[int, ...]:
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def brand_gradient(size: int) -> Image.Image:
    """Diagonal rose → violet → sun gradient, bottom-left to top-right."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + (size - y)) / (2 * size)
            px[x, y] = lerp(ROSE, VIOLET, t / 0.55) if t < 0.55 else lerp(VIOLET, SUN, (t - 0.55) / 0.45)
    return img


def monogram(size: int, tile: bool = True, padding: float = 0.0) -> Image.Image:
    """Renders the logo at `size` px (4× supersampled). `padding` shrinks the mark (for maskable icons)."""
    ss = size * 4
    scale = ss / 64 * (1 - 2 * padding)
    offset = ss * padding

    def p(pt: tuple[float, float]) -> tuple[float, float]:
        return (offset + pt[0] * scale, offset + pt[1] * scale)

    out = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    if tile:
        bg = ImageDraw.Draw(out)
        radius = 0 if padding else 16 * ss / 64
        bg.rounded_rectangle((0, 0, ss - 1, ss - 1), radius=radius, fill=TILE)

    mask = Image.new("L", (ss, ss), 0)
    d = ImageDraw.Draw(mask)
    w = STROKE_W * scale
    for stroke in STROKES:
        pts = [p(pt) for pt in stroke]
        d.line(pts, fill=255, width=round(w), joint="curve")
        for x, y in (pts[0], pts[-1]):  # round caps
            d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=255)
    out.paste(brand_gradient(ss), (0, 0), mask)

    sx, sy = p(SUN_CENTER)
    r = SUN_R * scale
    ImageDraw.Draw(out).ellipse((sx - r, sy - r, sx + r, sy + r), fill=SUN)
    return out.resize((size, size), Image.LANCZOS)


def font(names: list[str], size: int) -> ImageFont.FreeTypeFont:
    for name in names:
        for folder in (Path("C:/Windows/Fonts"), Path("/usr/share/fonts/truetype/dejavu")):
            path = folder / name
            if path.exists():
                return ImageFont.truetype(str(path), size)
    return ImageFont.load_default(size)


def og_image() -> Image.Image:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), BG)

    glow = Image.new("RGB", (w, h), BG)
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-200, 260, 520, 900), fill=(90, 20, 50))
    gd.ellipse((760, -260, 1400, 380), fill=(55, 35, 110))
    gd.ellipse((880, 380, 1300, 760), fill=(90, 62, 0))
    img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(140)), 0.9)

    grid = ImageDraw.Draw(img)
    for x in range(0, w, 48):
        grid.line((x, 0, x, h), fill=(18, 18, 28))
    for y in range(0, h, 48):
        grid.line((0, y, w, y), fill=(18, 18, 28))

    img.paste(logo := monogram(132), (80, 80), logo)

    bold = ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]
    regular = ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]
    mono = ["consola.ttf", "cour.ttf", "DejaVuSansMono.ttf"]
    d = ImageDraw.Draw(img)
    d.text((80, 270), "Amir Iravani", font=font(bold, 92), fill=TEXT)
    d.text((84, 390), "Front-end engineer · Angular · React · Vue", font=font(regular, 38), fill=MUTED)
    d.text((84, 520), "A.I. — the human kind.", font=font(mono, 28), fill=SUN)
    d.text((w - 330, 520), "Turin, Italy", font=font(mono, 28), fill=MUTED)

    bar = brand_gradient(1200).resize((w, 8))
    img.paste(bar, (0, h - 8))
    return img


def main() -> None:
    (PUBLIC / "icons").mkdir(parents=True, exist_ok=True)
    monogram(256).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    monogram(180).save(PUBLIC / "apple-touch-icon.png")
    monogram(192).save(PUBLIC / "icons" / "icon-192.png")
    monogram(512).save(PUBLIC / "icons" / "icon-512.png")
    monogram(512, padding=0.14).save(PUBLIC / "icons" / "icon-maskable-512.png")
    og_image().save(PUBLIC / "og-image.png", optimize=True)

    if len(sys.argv) > 1:
        (PUBLIC / "images").mkdir(exist_ok=True)
        portrait = Image.open(sys.argv[1]).convert("RGB")
        portrait.save(PUBLIC / "images" / "amir-iravani.webp", quality=88, method=6)
        portrait.save(PUBLIC / "images" / "amir-iravani.jpg", quality=88, optimize=True)

    print("Assets written to", PUBLIC)


if __name__ == "__main__":
    main()
