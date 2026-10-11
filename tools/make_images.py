#!/usr/bin/env python3
"""
make_images.py — genera le immagini raster del sito con Pillow:
  - assets/icons/apple-touch-icon.png   (180x180)
  - assets/icons/favicon-32x32.png
  - assets/icons/favicon-16x16.png
  - assets/images/og-image.png          (1200x630, per la condivisione social)

Uso:  python tools/make_images.py
Richiede Pillow (pip install pillow). I font si prendono da Windows (Segoe UI);
in mancanza, usa Arial; in mancanza ancora, il font di default di Pillow.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]

BG = (5, 7, 13)
VIOLET = (139, 92, 246)
VIOLET_SOFT = (167, 139, 250)
CYAN = (34, 211, 238)
TEXT = (233, 237, 245)
MUTED = (154, 166, 184)

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


def gradient(width, height, c1, c2):
    """Gradiente orizzontale semplice (passo 1px, immagini piccole)."""
    img = Image.new("RGB", (width, height))
    d = ImageDraw.Draw(img)
    for x in range(width):
        t = x / max(width - 1, 1)
        col = tuple(round(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
        d.line([(x, 0), (x, height)], fill=col)
    return img


def paste_gradient_text(card, xy, text, font, c1, c2, anchor="la"):
    """Scrive testo riempito col gradiente c1→c2."""
    mask = Image.new("L", card.size, 0)
    md = ImageDraw.Draw(mask)
    md.text(xy, text, font=font, fill=255, anchor=anchor)
    bbox = mask.getbbox()
    if not bbox:
        return
    grad = gradient(bbox[2] - bbox[0], bbox[3] - bbox[1], c1, c2)
    card.paste(grad, (bbox[0], bbox[1]), mask.crop(bbox))


def glow(card, cx, cy, rx, ry, color, alpha=80):
    layer = Image.new("RGBA", card.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(*color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(120))
    card.alpha_composite(layer)


def icon(size, path):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = max(6, size // 5)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=(10, 14, 26, 255))
    d.rounded_rectangle(
        [1, 1, size - 2, size - 2], radius=r - 1, outline=(*VIOLET_SOFT, 150), width=max(1, size // 40)
    )
    font = bold(round(size * 0.42))
    text = "MV"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] + size * 0.01
    paste_gradient_text(img, (x, y), text, font, VIOLET_SOFT, CYAN)
    return img


def save_icon(size, path):
    img = icon(size, path)
    img.save(path, "PNG")
    print(f"  ok  {Path(path).relative_to(ROOT)}")
    return img


def save_ico(path):
    img = icon(64, path)
    img.save(
        path,
        "ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )
    print(f"  ok  {Path(path).relative_to(ROOT)}")


def og_card(path):
    W, H = 1200, 630
    card = Image.new("RGBA", (W, H), (*BG, 255))

    # griglia tenue
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        gd.line([(x, 0), (x, H)], fill=(255, 255, 255, 10))
    for y in range(0, H, 60):
        gd.line([(0, y), (W, y)], fill=(255, 255, 255, 10))
    card.alpha_composite(grid)

    # bagliori
    glow(card, 170, 90, 420, 340, VIOLET, 95)
    glow(card, 1060, 150, 360, 300, CYAN, 55)
    glow(card, 620, 690, 500, 220, (244, 114, 182), 28)

    d = ImageDraw.Draw(card)

    # monogramma in alto a sinistra
    m = 64
    d.rounded_rectangle([m, m, m + 76, m + 76], radius=20, fill=(16, 20, 36, 255))
    d.rounded_rectangle([m, m, m + 76, m + 76], radius=20, outline=(*VIOLET_SOFT, 170), width=3)
    f_mono = bold(40)
    tb = d.textbbox((0, 0), "MV", font=f_mono)
    paste_gradient_text(
        card,
        (m + 38 - (tb[2] - tb[0]) / 2 - tb[0], m + 38 - (tb[3] - tb[1]) / 2 - tb[1]),
        "MV",
        f_mono,
        VIOLET_SOFT,
        CYAN,
    )
    d.text((m + 100, m + 40), "marco.valle", font=semibold(30), fill=TEXT, anchor="lm")

    # titolo
    d.text((m, 245), "Marco Valle", font=bold(96), fill=TEXT, anchor="lm")
    paste_gradient_text(
        card, (m, 332), "Back-End Developer & Data Analyst", semibold(44), VIOLET_SOFT, CYAN
    )
    d.text(
        (m, 412),
        "ERP Django in produzione  ·  Transformer su 65M record ADS-B  ·  IoT con ESP32",
        font=regular(26),
        fill=MUTED,
        anchor="lm",
    )

    # chips
    chips = ["Python", "Django", "PostgreSQL", "PyTorch", "Docker", "ESP32"]
    f_chip = regular(24)
    x = m
    for chip in chips:
        tb = d.textbbox((0, 0), chip, font=f_chip)
        w = tb[2] - tb[0] + 44
        d.rounded_rectangle([x, 470, x + w, 470 + 46], radius=23, outline=(255, 255, 255, 60), width=2)
        d.text((x + w / 2, 470 + 23), chip, font=f_chip, fill=(207, 217, 232), anchor="mm")
        x += w + 14

    # indirizzo
    d.text((W - m, 590), "marcovallecs.github.io", font=mono(24), fill=MUTED, anchor="rm")

    card.convert("RGB").save(path, "PNG")
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
