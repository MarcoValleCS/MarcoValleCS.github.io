#!/usr/bin/env python3
"""
make_images.py — genera le immagini raster del sito con Pillow:
  - assets/icons/apple-touch-icon.png   (180x180)
  - assets/icons/favicon-32x32.png
  - assets/icons/favicon-16x16.png
  - assets/icons/favicon.ico
  - assets/images/og-image.png          (1200x630, per la condivisione social)

Uso:  python tools/make_images.py
Richiede Pillow (pip install pillow). I font si prendono da Windows (Segoe UI,
Consolas); in mancanza, ripiega sul font di default di Pillow.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]

INK = (26, 21, 17)
INK2 = (20, 16, 12)
PAPER = (239, 230, 212)
MUTE = (156, 143, 126)
BRASS = (233, 161, 59)
SIGNAL = (220, 100, 64)

WINDOWS_FONTS = Path("C:/Windows/Fonts")


def load_font(candidates, size):
    for name in candidates:
        p = WINDOWS_FONTS / name
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except OSError:
                continue
    return ImageFont.load_default()


def bold(size):
    return load_font(["segoeuib.ttf", "arialbd.ttf"], size)


def semibold(size):
    return load_font(["segoeuisb.ttf", "segoeuib.ttf", "arialbd.ttf"], size)


def regular(size):
    return load_font(["segoeui.ttf", "arial.ttf"], size)


def mono(size):
    return load_font(["consola.ttf", "cour.ttf", "arial.ttf"], size)


def icon(size, path):
    img = Image.new("RGBA", (size, size), (*INK, 255))
    d = ImageDraw.Draw(img)
    r = max(3, size // 8)
    w = max(1, size // 32)
    d.rounded_rectangle([w, w, size - 1 - w, size - 1 - w], radius=r, outline=BRASS, width=w)
    font = bold(round(size * 0.4))
    text = "MV"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] + size * 0.015), text, font=font, fill=PAPER)
    return img


def save_icon(size, path):
    icon(size, path).save(path, "PNG")
    print(f"  ok  {Path(path).relative_to(ROOT)}")


def save_ico(path):
    icon(64, path).save(path, "ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"  ok  {Path(path).relative_to(ROOT)}")


def crosses(d, W, H, step=64, color=(48, 42, 36)):
    for x in range(step, W, step):
        for y in range(step // 2, H, step):
            d.line([(x - 4, y), (x + 4, y)], fill=color, width=1)
            d.line([(x, y - 4), (x, y + 4)], fill=color, width=1)


def poligono_parziale(pts, n=40):
    """Campiona una polilinea in n punti (per disegnare tratti lisci)."""
    out = []
    segs = len(pts) - 1
    for i in range(n + 1):
        t = i / n
        u = min(int(t * segs), segs - 1)
        local = t * segs - u
        x0, y0 = pts[u]
        x1, y1 = pts[u + 1]
        out.append((x0 + (x1 - x0) * local, y0 + (y1 - y0) * local))
    return out


def load_aerotraj():
    """Legge lo snapshot dei dati del benchmark (assets/js/aerotraj-data.js)."""
    import json
    import re

    raw = (ROOT / "assets/js/aerotraj-data.js").read_text(encoding="utf-8")
    m = re.search(r"window\.AEROTRAJ\s*=\s*(\{.*\});", raw, re.S)
    if not m:
        raise RuntimeError("non riesco a leggere assets/js/aerotraj-data.js")
    return json.loads(m.group(1))


def og_card(path):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(img)

    crosses(d, W, H)

    # dati reali del benchmark (stesso snapshot usato dal sito)
    data = load_aerotraj()

    # curva misurata: errore medio per orizzonte
    px0, py0, px1, py1 = 690, 150, 1130, 430
    hz = data["horizons_s"]
    ours = data["series"]["AeroTraj-Ultra"]
    fbpp = data["series"]["FlightBERT++"]
    ymin, ymax = 50.0, 20000.0

    def X(h):
        return px0 + (h / 300.0) * (px1 - px0)

    def Y(v):
        import math

        lo, hi = math.log10(ymin), math.log10(ymax)
        return py1 - ((math.log10(max(v, ymin)) - lo) / (hi - lo)) * (py1 - py0)

    d.line([(px0, py0), (px0, py1)], fill=(70, 63, 55), width=1)
    d.line([(px0, py1), (px1, py1)], fill=(70, 63, 55), width=1)
    for h, txt in [(10, "10"), (60, "60"), (120, "120"), (300, "300")]:
        d.line([(X(h), py1), (X(h), py1 + 6)], fill=(70, 63, 55), width=1)
        d.text((X(h), py1 + 12), txt, font=mono(16), fill=MUTE, anchor="ma")

    def curve(values, color, width):
        pts = [(X(h), Y(v)) for h, v in zip(hz, values)]
        for i in range(len(pts) - 1):
            d.line([pts[i], pts[i + 1]], fill=color, width=width)

    curve(ours, BRASS, 3)
    d.ellipse([X(300) - 5, Y(ours[-1]) - 5, X(300) + 5, Y(ours[-1]) + 5], fill=BRASS)
    d.text((X(300) - 12, Y(ours[-1]) - 14), "AeroTraj-Ultra", font=mono(17), fill=BRASS, anchor="ra")

    d.text((px0, py0 - 18), "errore medio 3D (m, scala log)", font=mono(16), fill=MUTE)

    # testo
    d.text((64, 96), "Marco Valle", font=bold(84), fill=PAPER)
    d.text((64, 208), "Sviluppatore back-end e data analyst", font=semibold(40), fill=BRASS)
    d.text((64, 286), "Gestionale ERP in produzione e modelli di", font=regular(27), fill=MUTE)
    d.text((64, 322), "previsione delle traiettorie aeree.", font=regular(27), fill=MUTE)

    d.text((64, 430), "991,6 m", font=bold(46), fill=BRASS, anchor="ls")
    d.text((64, 462), "errore medio su 5–300 s, il migliore fra 10 modelli", font=regular(23), fill=MUTE)

    d.text((64, 566), "Bergamo, 45.6983° N, 9.6773° E", font=mono(22), fill=MUTE)
    d.text((W - 64, 566), "marcovallecs.github.io", font=mono(22), fill=MUTE, anchor="ra")

    img.save(path, "PNG")
    print(f"  ok  {Path(path).relative_to(ROOT)}")


def main():
    icons_dir = ROOT / "assets/icons"
    images_dir = ROOT / "assets/images"
    icons_dir.mkdir(parents=True, exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)

    print("Icone…")
    save_icon(180, icons_dir / "apple-touch-icon.png")
    save_icon(32, icons_dir / "favicon-32x32.png")
    save_icon(16, icons_dir / "favicon-16x16.png")
    save_ico(icons_dir / "favicon.ico")
    print("Immagine social…")
    og_card(images_dir / "og-image.png")
    print("Fatto.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
