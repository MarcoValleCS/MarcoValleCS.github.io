# marcovallecs.github.io

Portfolio personale di **Marco Valle** — sviluppatore back-end e data analyst.
Pubblicato con GitHub Pages su **https://marcovallecs.github.io/**.

## La direzione

Un "fascicolo tecnico" in palette da strumentazione: inchiostro caldo, carta,
ottone. Le uniche superfici sono le tre tavole dei progetti — un foglio di
fattura elettronica FatturaPA, un plot di tracce ADS-B con la previsione di
FlightPREV, lo schema dell'impianto della piscina — disegnate a mano in SVG.
Un solo momento di movimento: l'apertura, con lo scope che si disegna una volta
e poi resta immobile.

## Cosa contiene

| File | Descrizione |
|---|---|
| `index.html` | La pagina (contenuti in italiano come lingua base) |
| `404.html` | Pagina di errore in stile |
| `assets/css/styles.css` | Design system e layout |
| `assets/js/app.js` | i18n IT/EN, console, navigazione e il canvas dello scope |
| `assets/vendor/` | [Motion](https://motion.dev) (sequenza d'apertura) e [Lenis](https://github.com/darkroomengineering/lenis) (scroll), vendorizzati |
| `assets/fonts/` | Saira SemiCondensed (titoli), Instrument Sans (testo), JetBrains Mono (codice e dati) |
| `assets/cv/` | I CV in PDF (IT ed EN) scaricabili dal sito |
| `assets/images/og-image.png` | Anteprima per la condivisione sui social |
| `tools/` | Script Python per rigenerare asset e immagini |

## Come modificare i contenuti

- **Testi italiani**: direttamente in `index.html` (attributi `data-i18n` inclusi).
- **Testi inglesi** (e tutte le stringhe IT/EN): nel dizionario `I18N` in cima a `assets/js/app.js`.
- **Nuovo progetto**: copia un blocco `<article class="dossier">` in `index.html` e aggiungi le chiavi `projects.*` nei due dizionari.
- **CV aggiornato**: sostituisci i PDF in `assets/cv/` mantenendo i nomi file.

## Rigenerare gli asset (facoltativo)

Serve Python 3 con Pillow (`pip install pillow`) solo per le immagini.

```bash
python tools/build_assets.py   # riscarica librerie, font e favicon
python tools/make_images.py    # rigenera favicon, apple-touch-icon e og-image.png
```

## Pubblicazione

Il sito vive sul branch `main` di questo repository: ogni push è online in un
paio di minuti (GitHub Pages → Deploy from a branch → `main` / root).
Il file `.nojekyll` disattiva Jekyll.

## Note tecniche

- Nessun framework e nessuna build: HTML, CSS e JavaScript scritti a mano,
  con due librerie vendorizzate.
- Lo scope dell'apertura è un canvas con tracce e blocchi dati nello stile
  ADS-B, disegnato una sola volta (niente loop continuo).
- Tutto rispetta `prefers-reduced-motion` e funziona anche senza JavaScript.
- Lingua predefinita: italiano; l'inglese è a un clic (la scelta viene ricordata).

© 2026 Marco Valle. I contenuti sono personali; il codice è libero da consultare.
