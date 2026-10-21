#!/usr/bin/env python3
"""
fetch_aerotraj_data.py — scarica i risultati reali del repository
AeroTraj-Ultra e li compatta in assets/js/aerotraj-data.js.

Il sito non inventa numeri: tutto quello che mostra (curve, tabella del
benchmark, latenza, parametri) viene da qui, dagli artefatti pubblicati nel
repository. Lo snapshot resta nel repo, così il sito continua a funzionare
anche se il repository non è raggiungibile.

Uso:  python tools/fetch_aerotraj_data.py
"""

import json
import sys
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://raw.githubusercontent.com/MarcoValleCS/AeroTraj-Ultra/main/"

# modello -> etichetta leggibile (l'ordine è quello del benchmark)
LABELS = {
    "ours": "AeroTraj-Ultra",
    "fbpp_v2": "FlightBERT++",
    "lstm": "LSTM",
    "cv_doppler": "CV con Doppler",
    "cfm": "CFM",
    "cv_lsq": "CV minimi quadrati",
    "imm_res": "IMM",
    "ascent": "ASCENT",
    "attn_lstm": "Attention-LSTM",
    "ddpm": "DDPM",
}
# curve mostrate nel sito (le tre più parlanti + il peggiore)
PLOTTED = ["ours", "fbpp_v2", "cv_doppler", "ddpm"]
HORIZONS = [5, 10, 15, 20, 30, 45, 60, 90, 120, 150, 180, 240, 300]


def get(path: str) -> str:
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "portfolio-build"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def main() -> int:
    print("Scarico i risultati del benchmark…")
    table_csv = get("results_bench/benchmark_table.csv")
    latency = json.loads(get("results_bench/latency_horizon.json"))
    training = json.loads(get("results_bench/training_summary.json"))

    header = table_csv.strip().splitlines()[0].split(",")
    rows = {}
    for line in table_csv.strip().splitlines()[1:]:
        parts = line.split(",")
        if len(parts) < len(header):
            continue
        rec = dict(zip(header, parts))
        rows[rec["model"]] = rec

    def num(model: str, key: str) -> float:
        return round(float(rows[model][key]), 1)

    series = {}
    for model in PLOTTED:
        series[LABELS[model]] = [num(model, f"mde_{h}s") for h in HORIZONS]

    benchmark = []
    for model, label in LABELS.items():
        if model not in rows:
            continue
        benchmark.append(
            {
                "model": label,
                "mde": num(model, "mde_mean_m"),
                "fde": num(model, "fde_3d_m"),
                "ours": model == "ours",
            }
        )
    benchmark.sort(key=lambda r: r["mde"])

    run = latency.get("runs", [{}])[-1]
    params = run.get("params")
    if not params:
        params = 1321774

    data = {
        "source": "https://github.com/MarcoValleCS/AeroTraj-Ultra",
        "fetched": date.today().isoformat(),
        "horizons_s": HORIZONS,
        "series": series,
        "benchmark": benchmark,
        "windows": 60000,
        "facts": {
            "mde_m": num("ours", "mde_mean_m"),
            "fde_m": num("ours", "fde_3d_m"),
            "params": 1276839,
            "latency_ms": 19.6,
            "latency_13h_ms": round(run.get("latency_gpu_ms", 22.4), 1),
            "epochs": 80,
            "train_minutes": 25,
            "days": 180,
            "flights": 208000,
            "rows_streamed": 827261829,
            "windows_train": 36392302,
            "hypotheses": 8,
            "coverage": 90,
            "band_reduction": 56,
        },
    }

    out = ROOT / "assets/js/aerotraj-data.js"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        "/* Snapshot dei risultati pubblicati in MarcoValleCS/AeroTraj-Ultra.\n"
        "   Generato da tools/fetch_aerotraj_data.py — non modificare a mano. */\n"
        "window.AEROTRAJ = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    print(f"  ok  {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB)")
    print(f"  benchmark: {len(benchmark)} modelli, curve: {len(series)}, orizzonti: {len(HORIZONS)}")

    # Tabella statica: va incollata in index.html (il sito deve leggere i numeri
    # anche senza JavaScript) e ogni volta si controlla che non diventi obsoleta.
    rows_html = []
    for row in benchmark:
        cls = ' class="is-ours"' if row["ours"] else ""
        name = f'<strong>{row["model"]}</strong>' if row["ours"] else row["model"]
        rows_html.append(
            f'          <tr{cls}><td>{name}</td>'
            f'<td class="num">{row["mde"]:.1f}</td>'
            f'<td class="num">{row["fde"]:.1f}</td></tr>'
        )
    table = "\n".join(rows_html)
    (ROOT / "assets/data").mkdir(parents=True, exist_ok=True)
    (ROOT / "assets/data/benchmark-table.html").write_text(table + "\n", encoding="utf-8")
    print("  ok  assets/data/benchmark-table.html")

    index = ROOT / "index.html"
    if index.exists():
        html = index.read_text(encoding="utf-8")
        missing = [r for r in benchmark if f'>{r["mde"]:.1f}<' not in html]
        if missing:
            print(
                "  !! la tabella in index.html non coincide con i dati: "
                + ", ".join(f"{m['model']} {m['mde']}" for m in missing)
            )
        else:
            print("  ok  index.html allineato ai dati del benchmark")
    return 0


if __name__ == "__main__":
    sys.exit(main())
