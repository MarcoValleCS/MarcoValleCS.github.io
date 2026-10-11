#!/usr/bin/env python3
"""
build_assets.py — scarica e prepara gli asset esterni del sito.

Cosa fa (una volta sola, poi gli asset restano nel repo):
  1. Scarica le librerie JS vendorizzate (Motion, Lenis) in assets/vendor/
  2. Scarica i font variabili in assets/fonts/:
     - Saira SemiCondensed (titoli, struttura)
     - Instrument Sans (testo)
     - JetBrains Mono (codice e dati)
  3. Genera assets/icons/favicon.svg (monogramma MV, palette ambra/carta)

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

# Famiglie Google Fonts da scaricare (sottoinsieme latin, così à è ì ò ù ci sono).
# Saira SemiCondensed non è variabile su Google Fonts: si scaricano i pesi singoli.
FONTS = [
    {"name": "Saira Semi Condensed", "query": "Saira+Semi+Condensed:wght@400;500;600;700"},
    {"name": "Instrument Sans", "query": "Instrument+Sans:wght@400..700"},
    {"name": "JetBrains Mono", "query": "JetBrains+Mono:wght@400..700"},
]


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
        "| Libreria | Versione | Licenza | Uso |\n"
        "|---|---|---|---|\n"
        f"| [Motion](https://motion.dev) | {MOTION_VERSION} | MIT | la sequenza d'avvio dell'hero |\n"
        f"| [Lenis](https://github.com/darkroomengineering/lenis) | {LENIS_VERSION} | MIT | scroll fluido |\n\n"
        "Font: Saira SemiCondensed, Instrument Sans, JetBrains Mono (SIL Open Font License).\n",
        encoding="utf-8",
    )


def build_fonts() -> None:
    print("Font…")
    for font in FONTS:
        css = fetch(
            f"https://fonts.googleapis.com/css2?family={font['query']}&display=swap"
        ).decode("utf-8")
        found = False
        for block in re.findall(r"@font-face\s*{(.*?)}", css, flags=re.S):
            fam = re.search(r"font-family:\s*'([^']+)'", block)
            weight = re.search(r"font-weight:\s*([\d ]+);", block)
            urange = re.search(r"unicode-range:\s*([^;]+);", block)
            url = re.search(r"url\((https://[^)]+\.woff2)\)", block)
            if not (fam and weight and urange and url):
                continue
            if "U+0000-00FF" not in urange.group(1):
                continue  # solo il sottoinsieme latin
            if fam.group(1) != font["name"]:
                continue
            w = weight.group(1).strip()
            slug = font["name"].lower().replace(" ", "-")
            if " " in w:  # font variabile: "400 700"
                dest = ROOT / f"assets/fonts/{slug}-latin-var.woff2"
            else:  # peso singolo: "400" / "600" …
                dest = ROOT / f"assets/fonts/{slug}-{w}-latin.woff2"
            if not dest.exists():
                download_to(url.group(1), dest)
            else:
                print(f"  ok  {dest.relative_to(ROOT)}  (già presente)")
            found = True
        if not found:
            print(f"  !! nessun file trovato per {font['name']}")


def build_favicon() -> None:
    print("Favicon…")
    favicon = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="#1A1511"/>
  <rect x="2" y="2" width="60" height="60" rx="6" fill="none" stroke="#E9A13B" stroke-width="2"/>
  <text x="32" y="43" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="27" font-weight="700" fill="#EFE6D4">MV</text>
</svg>
"""
    (ROOT / "assets/icons/favicon.svg").write_text(favicon, encoding="utf-8")
    print("  ok  assets/icons/favicon.svg")


def main() -> int:
    print(f"Repo: {ROOT}")
    build_libraries()
    build_fonts()
    build_favicon()
    print("Fatto.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
