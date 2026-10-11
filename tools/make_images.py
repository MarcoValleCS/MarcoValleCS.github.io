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


def og_card(path):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(img)

    # graticule
    crosses(d, W, H)

    # traccia di volo: passato pieno + previsione tratteggiata + scostamento
    past = [(700, 470), (790, 420), (880, 365), (960, 310)]
    seg = poligono_parziale(past, 32)
    d.line(seg, fill=PAPER, width=3)
    d.ellipse([960 - 6, 310 - 6, 960 + 6, 310 + 6], fill=PAPER)

    pred = [(960, 310), (1030, 260), (1110, 195)]
    pseg = poligono_parziale(pred, 32)
    # tratteggio manuale
    for i in range(len(pseg) - 1):
        if (i // 3) % 2 == 0:
            d.line([pseg[i], pseg[i + 1]], fill=BRASS, width=3)

    actual = [(960, 310), (1025, 272), (1092, 232)]
    aseg = poligono_parziale(actual, 32)
    d.line(aseg, fill=SIGNAL, width=2)
    d.line([(1110, 195), (1092, 232)], fill=SIGNAL, width=1)
    d.ellipse([1110 - 5, 195 - 5, 1110 + 5, 195 + 5], fill=BRASS)
    d.ellipse([1092 - 5, 232 - 5, 1092 + 5, 232 + 5], fill=SIGNAL)

    f_block = mono(20)
    d.text((640, 306), "MV582  FL340  458 kt", font=f_block, fill=(210, 201, 187))

    # testo
    d.text((64, 96), "Marco Valle", font=bold(84), fill=PAPER)
    d.text((64, 208), "Sviluppatore back-end e data analyst", font=semibold(40), fill=BRASS)
    d.text(
        (64, 282),
        "Gestionale ERP in produzione, Transformer su 65 milioni",
        font=regular(27),
        fill=MUTE,
    )
    d.text((64, 318), "di record ADS-B, firmware ESP32 per sensori.", font=regular(27), fill=MUTE)

    d.text((64, 560), "Bergamo, 45.6983° N, 9.6773° E", font=mono(22), fill=MUTE)
    d.text((W - 64, 560), "marcovallecs.github.io", font=mono(22), fill=MUTE, anchor="ra")

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
