# marcovallecs.github.io

Portfolio personale di **Marco Valle** — sviluppatore back-end e data analyst.
Pubblicato con GitHub Pages su **https://marcovallecs.github.io/**.

## La direzione

Un "fascicolo tecnico" in palette da strumentazione: inchiostro caldo, carta,
ottone. Le superfici sono le tavole dei progetti — un foglio di fattura
elettronica FatturaPA, il grafico dell'errore di previsione, lo schema
dell'impianto della piscina — disegnate a mano in SVG. Un solo momento di
movimento: l'apertura, con lo strumento di misura che si disegna una volta e
poi resta immobile.

## I numeri vengono dai dati, non dalla memoria

Il grafico dell'hero, la curva del progetto AeroTraj-Ultra e la tabella del
benchmark sono generati dallo snapshot dei risultati pubblicati in
`MarcoValleCS/AeroTraj-Ultra`:

```bash
python tools/fetch_aerotraj_data.py
```

Lo script scarica `results_bench/benchmark_table.csv` e gli altri artefatti
del repository, salva lo snapshot in `assets/js/aerotraj-data.js`, rigenera la
tabella statica in `assets/data/benchmark-table.html` e **verifica che la
tabella in `index.html` corrisponda ai dati** (per evitare che il sito racconti
numeri obsoleti). Se un numero non torna, lo script lo segnala.

## Cosa contiene

| File | Descrizione |
|---|---|
| `index.html` | La pagina (contenuti in italiano come lingua base) |
| `404.html` | Pagina di errore in stile |
| `assets/css/styles.css` | Design system e layout |
| `assets/js/app.js` | i18n IT/EN, console, navigazione, strumento dell'hero e grafici |
| `assets/js/aerotraj-data.js` | Snapshot dei risultati del benchmark (generato) |
| `assets/data/benchmark-table.html` | Frammento di tabella (generato) |
| `assets/vendor/` | [Motion](https://motion.dev) (sequenza d'apertura) e [Lenis](https://github.com/darkroomengineering/lenis) (scroll), vendorizzati |
| `assets/fonts/` | Saira SemiCondensed (titoli), Instrument Sans (testo), JetBrains Mono (codice e dati) |
| `assets/cv/` | I CV in PDF (IT ed EN) scaricabili dal sito |
| `assets/images/og-image.png` | Anteprima per la condivisione sui social |
| `tools/` | Script Python per asset, immagini e dati |

## Come modificare i contenuti

- **Testi italiani**: direttamente in `index.html` (attributi `data-i18n` inclusi).
- **Testi inglesi** (e tutte le stringhe IT/EN): nel dizionario `I18N` in cima a `assets/js/app.js`.
- **Nuovo progetto**: copia un blocco `<article class="dossier">` in `index.html` e aggiungi le chiavi `projects.*` nei due dizionari.
- **Nuovo dato del benchmark**: rilancia `tools/fetch_aerotraj_data.py` e incolla la tabella rigenerata in `index.html`.
- **CV aggiornato**: sostituisci i PDF in `assets/cv/` mantenendo i nomi file.

## Rigenerare gli asset (facoltativo)

Serve Python 3 con Pillow (`pip install pillow`) solo per le immagini.

```bash
python tools/build_assets.py     # riscarica librerie, font e favicon
python tools/make_images.py      # rigenera favicon, apple-touch-icon e og-image.png
python tools/fetch_aerotraj_data.py  # aggiorna i dati del benchmark
```

## Pubblicazione

Il sito vive sul branch `main` di questo repository: ogni push è online in un
paio di minuti (GitHub Pages → Deploy from a branch → `main` / root).
Il file `.nojekyll` disattiva Jekyll.

## Note tecniche

- Nessun framework e nessuna build: HTML, CSS e JavaScript scritti a mano,
  con due librerie vendorizzate.
- Lo strumento dell'hero è un canvas che disegna l'errore di previsione
  misurato su dati reali: assi, curve per modello, marcatore e lettura.
- Tutto rispetta `prefers-reduced-motion` e funziona anche senza JavaScript
  (i numeri restano leggibili nella tabella).
- Lingua predefinita: italiano; l'inglese è a un clic (la scelta viene ricordata).

© 2026 Marco Valle. I contenuti sono personali; il codice è libero da consultare.
