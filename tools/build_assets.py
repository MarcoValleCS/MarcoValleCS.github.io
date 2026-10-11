#!/usr/bin/env python3
"""
build_assets.py — scarica e prepara gli asset esterni del sito.

Cosa fa (una volta sola, poi gli asset restano nel repo):
  1. Scarica le librerie JS vendorizzate (Motion, Lenis) in assets/vendor/
  2. Scarica i font variabili (Inter, Space Grotesk, JetBrains Mono) in assets/fonts/
  3. Scarica le icone (Simple Icons per i brand, Lucide per l'interfaccia)
     in assets/icons/brands/ e assets/icons/ui/
  4. Genera lo sprite SVG inline e lo inserisce in index.html tra i marker
     <!-- ICONS:START --> ... <!-- ICONS:END -->
  5. Genera assets/icons/favicon.svg (monogramma MV)

Uso:  python tools/build_assets.py
Serve solo la connessione a internet. Rilanciarlo è innocuo (riscarica tutto).
"""

import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    )
}

MOTION_VERSION = "12.43.0"
LENIS_VERSION = "1.3.26"

BRANDS = {
    # slug nel repository simple-icons -> id usato nell'HTML (icona "b-<id>")
    "python": "python",
    "django": "django",
    "postgresql": "postgresql",
    "sqlite": "sqlite",
    "pytorch": "pytorch",
    "numpy": "numpy",
    "pandas": "pandas",
    "tensorflow": "tensorflow",
    "docker": "docker",
    "linux": "linux",
    "git": "git",
    "github": "github",
    "githubactions": "github-actions",
    "gunicorn": "gunicorn",
    "caddy": "caddy",
    "arduino": "arduino",
    "espressif": "espressif",
    "kotlin": "kotlin",
    "android": "android",
    "gradle": "gradle",
    "javascript": "javascript",
    "cplusplus": "cplusplus",
    "odoo": "odoo",
    "html5": "html5",
    "css3": "css3",
    "bluetooth": "bluetooth",
    "linkedin": "linkedin",
}

UI_ICONS = [
    "menu", "x", "arrow-up", "arrow-right", "download", "mail", "map-pin",
    "graduation-cap", "briefcase", "flask-conical", "server", "cloud", "cpu",
    "terminal", "languages", "plane", "shield-check", "gamepad-2", "layers",
    "book-open", "star", "activity", "zap", "grid", "database", "chart-line",
]

FONTS = ["Inter", "Space Grotesk", "JetBrains Mono"]


def fetch(url: str, retries: int = 3) -> bytes:
    last = None
    for _ in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except Exception as exc:  # noqa: BLE001
            last = exc
            time.sleep(1.5)
    raise RuntimeError(f"download fallito: {url} ({last})")


def download_to(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(fetch(url))
    print(f"  ok  {dest.relative_to(ROOT)}  ({dest.stat().st_size // 1024} KB)")


def svg_inner(svg_text: str) -> str:
    """Estrae il contenuto interno di un file SVG (senza <svg>/<title>)."""
    inner = re.sub(r"<\?xml.*?\?>", "", svg_text, flags=re.S)
    inner = re.sub(r"<svg[^>]*>", "", inner, count=1, flags=re.S)
    inner = inner.rsplit("</svg>", 1)[0]
    inner = re.sub(r"<title>.*?</title>", "", inner, flags=re.S)
    return inner.strip()


def build_libraries() -> None:
    print("Librerie JS…")
    download_to(
        f"https://cdn.jsdelivr.net/npm/motion@{MOTION_VERSION}/dist/motion.js",
        ROOT / "assets/vendor/motion.js",
    )
    download_to(
        f"https://cdn.jsdelivr.net/npm/lenis@{LENIS_VERSION}/dist/lenis.min.js",
        ROOT / "assets/vendor/lenis.min.js",
    )
    (ROOT / "assets/vendor/README.md").write_text(
        "# Librerie vendorizzate\n\n"
        "Nessuna dipendenza da CDN esterni al caricamento: questi file vivono nel repo.\n\n"
        "| Libreria | Versione | Licenza | Sito |\n"
        "|---|---|---|---|\n"
        f"| [Motion](https://motion.dev) | {MOTION_VERSION} | MIT | animazioni e scroll |\n"
        f"| [Lenis](https://github.com/darkroomengineering/lenis) | {LENIS_VERSION} | MIT | scroll fluido |\n\n"
        "Icone: [Lucide](https://lucide.dev) (ISC) e [Simple Icons](https://simpleicons.org) (CC0).\n\n"
        "Font: Inter, Space Grotesk, JetBrains Mono (SIL Open Font License).\n",
        encoding="utf-8",
    )


def build_fonts() -> None:
    print("Font…")
    css = fetch(
        "https://fonts.googleapis.com/css2?family=Inter:wght@100..900"
        "&family=Space+Grotesk:wght@300..700"
        "&family=JetBrains+Mono:wght@400..700&display=swap"
    ).decode("utf-8")

    # Blocchi @font-face -> (famiglia, unicode-range, url woff2)
    blocks = re.findall(r"@font-face\s*{(.*?)}", css, flags=re.S)
    wanted = {}
    for block in blocks:
        fam = re.search(r"font-family:\s*'([^']+)'", block)
        urange = re.search(r"unicode-range:\s*([^;]+);", block)
        url = re.search(r"url\((https://[^)]+\.woff2)\)", block)
        if not (fam and urange and url):
            continue
        # Sottoinsieme "latin" = U+0000-00FF (include à, è, ì, ò, ù …)
        if "U+0000-00FF" in urange.group(1):
            wanted[fam.group(1)] = url.group(1)

    for family in FONTS:
        if family not in wanted:
            print(f"  !! sottoinsieme latin non trovato per {family}")
            continue
        slug = family.lower().replace(" ", "-")
        download_to(wanted[family], ROOT / f"assets/fonts/{slug}-latin-var.woff2")


def build_icons() -> None:
    print("Icone brand (Simple Icons)…")
    brands_dir = ROOT / "assets/icons/brands"
    brands_dir.mkdir(parents=True, exist_ok=True)
    ui_dir = ROOT / "assets/icons/ui"
    ui_dir.mkdir(parents=True, exist_ok=True)
    symbols = []
    for slug, icon_id in BRANDS.items():
        url = f"https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/{slug}.svg"
        try:
            svg = fetch(url).decode("utf-8")
        except RuntimeError:
            print(f"  !! salto {slug} (non trovata)")
            continue
        inner = svg_inner(svg)
        (brands_dir / f"{icon_id}.svg").write_text(svg, encoding="utf-8")
        symbols.append(f'<symbol id="b-{icon_id}" viewBox="0 0 24 24" fill="currentColor">{inner}</symbol>')
        print(f"  ok  {icon_id}")

    print("Icone interfaccia (Lucide)…")
    for name in UI_ICONS:
        url = f"https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/{name}.svg"
        try:
            svg = fetch(url).decode("utf-8")
        except RuntimeError:
            print(f"  !! salto {name} (non trovata)")
            continue
        inner = svg_inner(svg)
        (ui_dir / f"{name}.svg").write_text(svg, encoding="utf-8")
        symbols.append(
            f'<symbol id="l-{name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</symbol>'
        )
        print(f"  ok  {name}")

    sprite = (
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        'style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false">\n'
        + "\n".join(symbols)
        + "\n</svg>"
    )
    (ROOT / "assets/icons/sprite.inline.html").write_text(sprite, encoding="utf-8")

    index = ROOT / "index.html"
    if index.exists():
        html = index.read_text(encoding="utf-8")
        start, end = "<!-- ICONS:START -->", "<!-- ICONS:END -->"
        if start in html and end in html:
            pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), flags=re.S)
            html = pattern.sub(start + "\n" + sprite + "\n" + end, html)
            index.write_text(html, encoding="utf-8")
            print("  ok  sprite inserito in index.html")
        else:
            print("  !! marker ICONS:START/END non trovati in index.html")
    else:
        print("  !! index.html non trovato, salto l'inserimento")


def build_favicon() -> None:
    print("Favicon…")
    favicon = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0a0e1a"/>
  <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" fill="none" stroke="url(#g)" stroke-opacity=".55" stroke-width="2"/>
  <text x="32" y="43" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="27" font-weight="800" fill="url(#g)">MV</text>
</svg>
"""
    (ROOT / "assets/icons/favicon.svg").write_text(favicon, encoding="utf-8")
    print("  ok  assets/icons/favicon.svg")


def main() -> int:
    print(f"Repo: {ROOT}")
    build_libraries()
    build_fonts()
    build_icons()
    build_favicon()
    print("Fatto.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
