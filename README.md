# marcovallecs.github.io

Portfolio personale di **Marco Valle** — Sviluppatore Back-End & Data Analyst.
Pubblicato con GitHub Pages su **https://marcovallecs.github.io/**.

## Cosa contiene

| File | Descrizione |
|---|---|
| `index.html` | La pagina (tutto il contenuto, IT come lingua base) |
| `404.html` | Pagina di errore in stile |
| `assets/css/styles.css` | Tutto il design system (dark, vetro, gradienti) |
| `assets/js/app.js` | i18n IT/EN, testi, animazioni, canvas delle traiettorie |
| `assets/vendor/` | Librerie JS vendorizzate: [Motion](https://motion.dev) e [Lenis](https://github.com/darkroomengineering/lenis) |
| `assets/fonts/` | Font variabili: Inter, Space Grotesk, JetBrains Mono (OFL) |
| `assets/icons/` | Icone [Lucide](https://lucide.dev) + [Simple Icons](https://simpleicons.org), sprite SVG, favicon |
| `assets/cv/` | I CV in PDF (IT ed EN) scaricabili dal sito |
| `assets/images/og-image.png` | Anteprima per la condivisione sui social |
| `tools/` | Script Python per rigenerare asset e immagini |

## Come modificare i contenuti

- **Testi italiani**: direttamente in `index.html` (attributi `data-i18n` inclusi).
- **Testi inglesi** (e in generale tutte le stringhe IT/EN): nel dizionario `I18N` in cima a `assets/js/app.js`.
- **Nuovo progetto**: copia un blocco `<article class="project ...">` in `index.html` e aggiungi le chiavi `projects.*` nei due dizionari.
- **CV aggiornato**: sostituisci i PDF in `assets/cv/` mantenendo i nomi file.

## Rigenerare gli asset (facoltativo)

Serve Python 3 con Pillow (`pip install pillow`) solo per le immagini.

```bash
python tools/build_assets.py   # riscarica librerie, font e icone; rigenera lo sprite in index.html
python tools/make_images.py    # rigenera favicon, apple-touch-icon e og-image.png
```

## Pubblicazione

Il sito vive sul branch `main` di questo repository: ogni push è online in un paio di minuti
(GitHub Pages → Deploy from a branch → `main` / root). Il file `.nojekyll` disattiva Jekyll.

## Note tecniche

- Nessun framework e nessuna build: HTML, CSS e JavaScript moderni scritti a mano,
  con due librerie vendorizzate (Motion per le animazioni, Lenis per lo scroll fluido).
- Il canvas dell'hero disegna stelle e traiettorie aeree: un richiamo al progetto FlightPREV.
- Tutto rispetta `prefers-reduced-motion` e funziona anche senza JavaScript.
- Lingua predefinita: italiano; l'inglese è a un clic (la scelta viene ricordata).

© 2026 Marco Valle. I contenuti sono personali; il codice è libero da consultare.
