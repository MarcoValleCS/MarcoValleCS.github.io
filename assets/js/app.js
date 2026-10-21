/* ==========================================================================
   Marco Valle — portfolio
   app.js — i18n IT/EN, console statica, navigazione e lo strumento
   dell'hero: l'errore di previsione misurato su dati reali
   (AeroTraj-Ultra), disegnato una volta all'avvio e poi immobile.
   ========================================================================== */
(() => {
  "use strict";

  /* Con Lenis lo scroll si gestisce qui: niente ripristino automatico del
     browser al reload, che altrimenti "litiga" con lo scroll fluido. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionOK = typeof window.Motion !== "undefined";
  const DATA = window.AEROTRAJ || null;

  const CV = {
    it: "assets/cv/Marco_Valle_CV_IT.pdf",
    en: "assets/cv/Marco_Valle_CV_EN.pdf",
  };

  /* ------------------------------------------------------------------
   * 1. Testi
   * ------------------------------------------------------------------ */
  const I18N = {
    it: {
      meta: {
        title: "Marco Valle, sviluppatore back-end e data analyst",
        description:
          "Gestionale ERP in produzione con Django e PostgreSQL, modello non autoregressivo per la previsione delle traiettorie aeree su 65 milioni di record ADS-B reali, firmware ESP32 per sensori. Python, Django, PyTorch, Docker, Linux.",
      },
      "a11y.skip": "Salta al contenuto",
      "a11y.lang": "Cambia lingua",
      "a11y.lang.it": "Italiano",
      "a11y.lang.en": "Inglese",
      "a11y.menu": "Apri il menu",
      "a11y.top": "Torna su",
      "nav.about": "Chi sono",
      "nav.skills": "Competenze",
      "nav.projects": "Progetti",
      "nav.resume": "Percorso",
      "nav.contact": "Contatti",
      "hero.role": "Sviluppatore back-end e data analyst a Bergamo.",
      "hero.lead":
        "Lavoro su due cose che devono durare: il gestionale che oggi è il sistema di Aquaforma, e modelli che prevedono dove saranno gli aerei, addestrati su 65 milioni di record ADS-B reali.",
      "hero.cta.projects": "Vedi i progetti",
      "hero.cta.cv": "Scarica il CV",
      "hero.spec.r1.label": "AeroTraj-Ultra",
      "hero.spec.r1.value": "991,6 m",
      "hero.spec.r1.where": "errore medio, 5–300 s",
      "hero.spec.r2.label": "Gestionale aziendale",
      "hero.spec.r2.value": "in produzione",
      "hero.spec.r2.where": "Aquaforma S.r.l.",
      "hero.spec.r3.label": "Record ADS-B elaborati",
      "hero.spec.r3.value": "65 milioni",
      "hero.spec.r3.where": "90–180 giorni di traffico OpenSky",
      "hero.spec.r4.label": "Test automatici",
      "hero.spec.r4.value": "600+",
      "hero.spec.r4.where": "CI a ogni push",
      "about.title": "Chi sono",
      "about.p1":
        "Mi sono laureato in Informatica all'Università di Milano-Bicocca nel 2025, con 99/110, discutendo una tesi sui modelli Transformer per la previsione delle traiettorie aeree. Prima della laurea ho passato un semestre Erasmus a Łódź, in Polonia.",
      "about.p2":
        "In Aquaforma S.r.l., a Treviolo, gestisco l'IT aziendale e sviluppo il gestionale che oggi è il sistema di gestione principale: anagrafiche, preventivi, ordini, magazzino, DDT e fatturazione elettronica verso lo SDI. È in produzione su un VPS Linux con Docker, e oltre 600 test automatici girano a ogni push.",
      "about.p3":
        "Il resto lo faccio fuori dall'orario di lavoro: modelli di deep learning per la previsione del traffico aereo, un firmware ESP32 che misura la chimica dell'acqua della piscina, un'app Android che comanda i relè. Mi interessano i problemi concreti, quelli che finiscono in produzione.",
      "about.facts.seat": "Sede",
      "about.facts.seat.v": "Bergamo, Lombardia",
      "about.facts.lang": "Lingue",
      "about.facts.lang.v": "Italiano nativo, inglese B2",
      "about.facts.edu": "Formazione",
      "about.facts.edu.v": "Laurea in Informatica, 99/110",
      "about.facts.vol": "Volontariato",
      "about.facts.vol.v": "Educatore scout dal 2019",
      "console.title": "sessione locale",
      "method.title": "Metodo di lavoro",
      "method.lead": "Quattro abitudini che tengono insieme i progetti qui sotto.",
      "method.1.t": "Problemi concreti",
      "method.1.d": "Preferisco un progetto completo e in produzione a più progetti incompiuti.",
      "method.2.t": "Test fin dall'inizio",
      "method.2.d": "Oltre 600 test in CI: ogni push è verificato e ogni rilascio resta reversibile.",
      "method.3.t": "Dati reali, protocollo comune",
      "method.3.d": "Addestramento su traffico reale e confronto fra modelli sugli stessi dati: risultati verificabili da terzi.",
      "method.4.t": "Documentazione accanto al codice",
      "method.4.d": "Il codice di dominio si spiega meglio con una documentazione scritta accanto, non separata.",
      "skills.title": "Competenze",
      "skills.intro": "Gli strumenti con cui lavoro ogni giorno, in produzione o su questi progetti.",
      "skills.r1.area": "Back-end e web",
      "skills.r1.list": "Python, Django, PostgreSQL, SQLite, HTML, CSS",
      "skills.r2.area": "Dati e machine learning",
      "skills.r2.list": "PyTorch, NumPy, pandas, Matplotlib, OpenSky ADS-B",
      "skills.r3.area": "DevOps",
      "skills.r3.list": "Docker e Docker Compose, Gunicorn, Caddy, Linux, Git, GitHub Actions",
      "skills.r4.area": "Embedded e mobile",
      "skills.r4.list": "ESP32 e Arduino (C/C++), I2C, ADC a 16 bit, Bluetooth, Kotlin, Android, Gradle",
      "skills.r5.area": "Gestionale e integrazione",
      "skills.r5.list": "Odoo (ERP/CRM), XML FatturaPA nel formato FPR12, PEC, server MCP",
      "skills.r6.area": "Geodesia e codifica",
      "skills.r6.list": "WGS-84, propagatori cinematici, Gray Code, calibrazione conforme",
      "projects.title": "Progetti",
      "projects.intro":
        "Un modello di ricerca con benchmark aperto, il gestionale che regge un'azienda, il progetto di tesi e un impianto che misura l'acqua di una piscina.",
      "projects.aerotraj.meta": "Progetto personale e benchmark aperto · 2026",
      "projects.aerotraj.p1":
        "Un modello non autoregressivo che prevede la posizione di un aereo da 5 a 300 secondi avanti: una sola passata in avanti, tredici orizzonti contemporaneamente e nessun accumulo dell'errore. Ogni previsione è ancorata a un propagatore cinematico analitico sull'ellissoide WGS-84, e le posizioni assolute sono codificate in Gray Code, così l'uscita è decodificabile per costruzione.",
      "projects.aerotraj.p2":
        "Allenato su 90–180 giorni di traffico reale OpenSky: 827 milioni di righe grezze lette, 65 milioni di punti a 5 secondi e 36 milioni di finestre di addestramento. Accanto al modello c'è un benchmark aperto: i modelli della letteratura sono stati reimplementati e valutati sugli stessi dati con lo stesso protocollo.",
      "projects.aerotraj.s1": "errore medio, 5–300 s",
      "projects.aerotraj.s2": "parametri del modello",
      "projects.aerotraj.s3": "per aereo, su GPU",
      "projects.aerotraj.s4": "modelli a confronto",
      "projects.aerotraj.caption":
        "Errore medio 3D in metri, per orizzonte di previsione. Misure del benchmark, 60.000 finestre di test.",
      "projects.aerotraj.note":
        "Dati pubblicati nel repository del progetto. AeroTraj-Ultra ha l'errore più basso a tutti e tredici gli orizzonti.",
      "projects.aerotraj.noscript": "Il grafico richiede JavaScript; i valori sono nella tabella qui sotto.",
      "projects.aerotraj.bench": "Benchmark aperto: dieci modelli, stessi dati, stesso protocollo",
      "projects.aerotraj.bench.model": "Modello",
      "projects.aerotraj.bench.mde": "Errore medio (m)",
      "projects.aerotraj.bench.fde": "Errore finale (m)",
      "projects.aerotraj.bench.note":
        "Errore medio 3D su tutto l'orizzonte 5–300 s ed errore finale al 300 s, calcolati sulle stesse 60.000 finestre di test.",
      "projects.erp.title": "Gestionale aziendale",
      "projects.erp.meta": "Aquaforma S.r.l., Treviolo. In produzione dal 2026.",
      "projects.erp.p1":
        "Anagrafiche, catalogo, preventivi, ordini, magazzino, rifornimento fornitori, DDT e fatture: è il sistema con cui Aquaforma lavora tutti i giorni.",
      "projects.erp.p2":
        "La fatturazione elettronica genera l'XML FatturaPA nel formato FPR12 e lo trasmette allo SDI via PEC. Il deploy è su un VPS Linux con Docker Compose, oltre 600 test automatici girano in CI a ogni push, e un server MCP in sola lettura espone i dati agli assistenti AI.",
      "projects.flight.meta": "Progetto di tesi · 2025–2026",
      "projects.flight.p1":
        "Il primo modello, nato dalla tesi di laurea: un Transformer che prevede la posizione di un aereo da 10 a 120 secondi, addestrato su 65 milioni di record ADS-B con una pipeline completa di pulizia, segmentazione, ricampionamento e finestre scorrevoli.",
      "projects.flight.p2":
        "Errore medio di 582 m contro gli 833 della migliore baseline cinematica, il 30% in meno grazie al residual learning, e il 75–90% in meno rispetto a una reimplementazione di FlightBERT su tutti gli orizzonti.",
      "projects.flight.k1": "Orizzonte",
      "projects.flight.k2": "Record ADS-B",
      "projects.flight.k3": "Errore medio",
      "projects.flight.k3b": "baseline 833 m",
      "projects.flight.k4": "vs FlightBERT",
      "projects.iot.title": "Domotica e monitoraggio piscina",
      "projects.iot.meta": "Progetto continuo. Codice su richiesta.",
      "projects.iot.p1":
        "Firmware ESP32 in C++ che comanda i relè dell'impianto e legge le sonde della chimica dell'acqua: pH, cloro, acido cianurico e salinità, su un ADC a 16 bit collegato via I2C.",
      "projects.iot.p2":
        "Un'app Android in Kotlin dialoga con il modulo via Bluetooth, e l'impianto è integrato con Home Assistant per la gestione di tutti i giorni.",
      "art.erp.caption": "Fattura elettronica, XML FatturaPA (FPR12)",
      "art.erp.stamp": "trasmessa allo SDI",
      "art.iot.caption": "Schema di massima dell'impianto.",
      "art.iot.n0": "Sonde",
      "art.iot.n1": "pH, cloro, salinità",
      "art.iot.n4": "4 relè",
      "art.iot.n4b": "pompe e luci",
      "art.iot.n5": "App Android",
      "projects.more.title": "Altri progetti",
      "projects.more.supercold": "Un SuperHot in C++ puro, senza librerie grafiche.",
      "projects.more.tris": "Tris in C++ puro, anche in single player.",
      "projects.more.flashcard": "Flashcard di studio per i corsi di Informatica a Bicocca.",
      "projects.more.all": "Tutti i repository su GitHub",
      "resume.title": "Percorso",
      "resume.work": "Esperienza",
      "resume.edu": "Formazione e volontariato",
      "resume.aqua.when": "2026 — oggi",
      "resume.aqua.d":
        "Socio e dipendente. Sviluppo il gestionale aziendale, gestisco Odoo Enterprise, l'infrastruttura IT, la rete e il sito.",
      "resume.pavis.when": "mar 2023 — 2025",
      "resume.pavis.d": "Installazione e manutenzione di piscine: analisi chimica delle acque, rapporti con clienti e fornitori.",
      "resume.poppies.when": "feb — giu 2023",
      "resume.poppies.d": "Assistenza e consulenza IT: rete on-premise, postazioni di lavoro e hardware.",
      "resume.unimib.when": "2021 — 2025",
      "resume.unimib.d": "Laurea in Informatica, 99/110. Tesi sui modelli non autoregressivi per la previsione delle traiettorie aeree.",
      "resume.erasmus.when": "ott 2023 — mar 2024",
      "resume.erasmus.h": "Università di Łódź, Polonia",
      "resume.erasmus.d": "Erasmus+ (un semestre), corsi ed esami in inglese.",
      "resume.scout.when": "2019 — oggi",
      "resume.scout.d": "Attività educative con ragazzi dai 15 ai 19 anni: leadership e lavoro di squadra.",
      "contact.title": "Contatti",
      "contact.lead": "Per opportunità professionali o di collaborazione scrivimi: rispondo a ogni messaggio.",
      "contact.cv.it": "CV in italiano",
      "contact.cv.en": "CV in inglese",
      "footer.built": "HTML, CSS e JavaScript scritti a mano. Animazioni con Motion, scroll con Lenis.",
      "footer.source": "codice sorgente",
      "chart.axis.x": "orizzonte di previsione (s)",
      "chart.axis.y": "errore medio 3D (m, scala log)",
    },

    en: {
      meta: {
        title: "Marco Valle, back-end developer and data analyst",
        description:
          "ERP system in production with Django and PostgreSQL, a non-autoregressive model predicting aircraft trajectories from 65 million real ADS-B records, ESP32 sensor firmware. Python, Django, PyTorch, Docker, Linux.",
      },
      "a11y.skip": "Skip to content",
      "a11y.lang": "Switch language",
      "a11y.lang.it": "Italian",
      "a11y.lang.en": "English",
      "a11y.menu": "Open menu",
      "a11y.top": "Back to top",
      "nav.about": "About",
      "nav.skills": "Skills",
      "nav.projects": "Projects",
      "nav.resume": "Resume",
      "nav.contact": "Contact",
      "hero.role": "Back-end developer and data analyst, based in Bergamo, Italy.",
      "hero.lead":
        "I work on two things that have to last: the management system that now runs Aquaforma, and models that predict where aircraft will be, trained on 65 million real ADS-B records.",
      "hero.cta.projects": "See the projects",
      "hero.cta.cv": "Download the CV",
      "hero.spec.r1.label": "AeroTraj-Ultra",
      "hero.spec.r1.value": "991.6 m",
      "hero.spec.r1.where": "mean error, 5–300 s",
      "hero.spec.r2.label": "Business management system",
      "hero.spec.r2.value": "in production",
      "hero.spec.r2.where": "Aquaforma S.r.l.",
      "hero.spec.r3.label": "ADS-B records processed",
      "hero.spec.r3.value": "65 million",
      "hero.spec.r3.where": "90–180 days of OpenSky traffic",
      "hero.spec.r4.label": "Automated tests",
      "hero.spec.r4.value": "600+",
      "hero.spec.r4.where": "CI on every push",
      "about.title": "About me",
      "about.p1":
        "I graduated in Computer Science at the University of Milano-Bicocca in 2025, with 99/110, defending a thesis on Transformer models for aircraft trajectory prediction. Before graduating I spent one Erasmus semester in Łódź, Poland.",
      "about.p2":
        "At Aquaforma S.r.l., in Treviolo, I run the company IT and develop the management system that is now the core of the business: contacts, quotes, orders, inventory, delivery notes and Italian e-invoicing towards SDI. It runs in production on a Linux VPS with Docker, and over 600 automated tests run on every push.",
      "about.p3":
        "The rest happens off the clock: deep learning models for air traffic prediction, ESP32 firmware that measures pool water chemistry, an Android app driving the relays. I care about concrete problems, the ones that end up in production.",
      "about.facts.seat": "Based in",
      "about.facts.seat.v": "Bergamo, Lombardy",
      "about.facts.lang": "Languages",
      "about.facts.lang.v": "Italian (native), English B2",
      "about.facts.edu": "Education",
      "about.facts.edu.v": "BSc in Computer Science, 99/110",
      "about.facts.vol": "Volunteering",
      "about.facts.vol.v": "Scout educator since 2019",
      "console.title": "local session",
      "method.title": "How I work",
      "method.lead": "Four habits that hold the projects below together.",
      "method.1.t": "Concrete problems",
      "method.1.d": "I would rather have one complete project running in production than several unfinished ones.",
      "method.2.t": "Tests from the start",
      "method.2.d": "Over 600 tests in CI: every push is verified and every release stays reversible.",
      "method.3.t": "Real data, common protocol",
      "method.3.d": "Training on real traffic and models compared on the same data: results anyone can check.",
      "method.4.t": "Documentation next to the code",
      "method.4.d": "Domain code is explained better by documentation written beside it, not apart.",
      "skills.title": "Skills",
      "skills.intro": "The tools I work with every day, in production or on the projects below.",
      "skills.r1.area": "Back-end and web",
      "skills.r1.list": "Python, Django, PostgreSQL, SQLite, HTML, CSS",
      "skills.r2.area": "Data and machine learning",
      "skills.r2.list": "PyTorch, NumPy, pandas, Matplotlib, OpenSky ADS-B",
      "skills.r3.area": "DevOps",
      "skills.r3.list": "Docker and Docker Compose, Gunicorn, Caddy, Linux, Git, GitHub Actions",
      "skills.r4.area": "Embedded and mobile",
      "skills.r4.list": "ESP32 and Arduino (C/C++), I2C, 16-bit ADC, Bluetooth, Kotlin, Android, Gradle",
      "skills.r5.area": "Business systems and integration",
      "skills.r5.list": "Odoo (ERP/CRM), FatturaPA XML, FPR12 format, PEC, MCP server",
      "skills.r6.area": "Geodesy and encoding",
      "skills.r6.list": "WGS-84, kinematic propagators, Gray Code, conformal calibration",
      "projects.title": "Projects",
      "projects.intro":
        "A research model with an open benchmark, the management system running a company, the thesis project and a plant that measures the water of a swimming pool.",
      "projects.aerotraj.meta": "Personal project and open benchmark · 2026",
      "projects.aerotraj.p1":
        "A non-autoregressive model that predicts where an aircraft will be from 5 to 300 seconds ahead: a single forward pass, thirteen horizons at once and no error accumulation. Every prediction is anchored to an analytical kinematic propagator on the WGS-84 ellipsoid, and absolute positions are encoded in Gray Code, so the output is decodable by construction.",
      "projects.aerotraj.p2":
        "Trained on 90–180 days of real OpenSky traffic: 827 million raw rows read, 65 million points at 5-second resolution and 36 million training windows. Alongside the model there is an open benchmark: the literature models were re-implemented and evaluated on the same data with the same protocol.",
      "projects.aerotraj.s1": "mean error, 5–300 s",
      "projects.aerotraj.s2": "model parameters",
      "projects.aerotraj.s3": "per aircraft, on GPU",
      "projects.aerotraj.s4": "models compared",
      "projects.aerotraj.caption":
        "Mean 3D error in metres, per prediction horizon. Benchmark measurements over 60,000 test windows.",
      "projects.aerotraj.note":
        "Data published in the project repository. AeroTraj-Ultra has the lowest error at all thirteen horizons.",
      "projects.aerotraj.noscript": "The chart needs JavaScript; the values are in the table below.",
      "projects.aerotraj.bench": "Open benchmark: ten models, same data, same protocol",
      "projects.aerotraj.bench.model": "Model",
      "projects.aerotraj.bench.mde": "Mean error (m)",
      "projects.aerotraj.bench.fde": "Final error (m)",
      "projects.aerotraj.bench.note":
        "Mean 3D error over the whole 5–300 s horizon and final error at 300 s, computed on the same 60,000 test windows.",
      "projects.erp.title": "Business management system",
      "projects.erp.meta": "Aquaforma S.r.l., Treviolo. In production since 2026.",
      "projects.erp.p1":
        "Contacts, catalogue, quotes, orders, inventory, supplier replenishment, delivery notes and invoices: it is the system Aquaforma works with every day.",
      "projects.erp.p2":
        "The e-invoicing module generates FatturaPA XML in the FPR12 format and transmits it to SDI over PEC. It is deployed on a Linux VPS with Docker Compose, over 600 automated tests run in CI on every push, and a read-only MCP server exposes the data to AI assistants.",
      "projects.flight.meta": "Thesis project · 2025–2026",
      "projects.flight.p1":
        "The first model, born from my BSc thesis: a Transformer that predicts where an aircraft will be from 10 to 120 seconds ahead, trained on 65 million ADS-B records with a full pipeline of cleaning, segmentation, resampling and sliding windows.",
      "projects.flight.p2":
        "Average error of 582 m against 833 for the best kinematic baseline, 30% lower thanks to residual learning, and 75–90% lower than a FlightBERT reimplementation at every horizon.",
      "projects.flight.k1": "Horizon",
      "projects.flight.k2": "ADS-B records",
      "projects.flight.k3": "Average error",
      "projects.flight.k3b": "baseline 833 m",
      "projects.flight.k4": "vs FlightBERT",
      "projects.iot.title": "Home automation and pool monitoring",
      "projects.iot.meta": "Ongoing project. Code available on request.",
      "projects.iot.p1":
        "ESP32 firmware in C++ that drives the plant relays and reads the water chemistry probes: pH, chlorine, cyanuric acid and salinity, on a 16-bit ADC over I2C.",
      "projects.iot.p2":
        "A Kotlin Android app talks to the module over Bluetooth, and the plant is integrated with Home Assistant for everyday use.",
      "art.erp.caption": "E-invoice, FatturaPA XML (FPR12)",
      "art.erp.stamp": "sent to SDI",
      "art.iot.caption": "A rough schematic of the plant.",
      "art.iot.n0": "Probes",
      "art.iot.n1": "pH, chlorine, salinity",
      "art.iot.n4": "4 relays",
      "art.iot.n4b": "pumps and lights",
      "art.iot.n5": "Android app",
      "projects.more.title": "Other projects",
      "projects.more.supercold": "A SuperHot clone in pure C++, with no graphics libraries.",
      "projects.more.tris": "Tic-tac-toe in pure C++, with a single-player mode.",
      "projects.more.flashcard": "Study flashcards for Computer Science courses at Bicocca.",
      "projects.more.all": "All repositories on GitHub",
      "resume.title": "Resume",
      "resume.work": "Experience",
      "resume.edu": "Education and volunteering",
      "resume.aqua.when": "2026 — present",
      "resume.aqua.d":
        "Partner and employee. I develop the in-house management system and run Odoo Enterprise, the IT infrastructure, the network and the website.",
      "resume.pavis.when": "Mar 2023 — 2025",
      "resume.pavis.d": "Swimming pool installation and maintenance: water chemistry analysis, customer and supplier relations.",
      "resume.poppies.when": "Feb — Jun 2023",
      "resume.poppies.d": "IT support and consulting: on-premise network, workstations and hardware.",
      "resume.unimib.when": "2021 — 2025",
      "resume.unimib.d": "BSc in Computer Science, 99/110. Thesis on non-autoregressive models for aircraft trajectory prediction.",
      "resume.erasmus.when": "Oct 2023 — Mar 2024",
      "resume.erasmus.h": "University of Łódź, Poland",
      "resume.erasmus.d": "Erasmus+ (one semester), courses and exams in English.",
      "resume.scout.when": "2019 — present",
      "resume.scout.d": "Educational activities with teens aged 15 to 19: leadership and teamwork.",
      "contact.title": "Contact",
      "contact.lead": "For professional opportunities or collaborations, write me: I answer every message.",
      "contact.cv.it": "CV in Italian",
      "contact.cv.en": "CV in English",
      "footer.built": "HTML, CSS and JavaScript, written by hand. Motion for animation, Lenis for scrolling.",
      "footer.source": "source code",
      "chart.axis.x": "prediction horizon (s)",
      "chart.axis.y": "mean 3D error (m, log scale)",
    },
  };

  /* Console: output mostrato in modo statico, per lingua */
  const CONSOLE = {
    it: [
      { cmd: "python manage.py test", out: [{ t: "Ran 600 tests in 34.1s" }, { t: "OK", ok: true }] },
      { cmd: "docker compose up -d", out: [{ t: "gunicorn, caddy, postgres, worker: avviati" }] },
      {
        cmd: "python train.py --encoder aerotraj_ultra --horizons 5..300",
        out: [{ t: "991,6 m di errore medio, 13 orizzonti, 19,6 ms su GPU" }],
      },
    ],
    en: [
      { cmd: "python manage.py test", out: [{ t: "Ran 600 tests in 34.1s" }, { t: "OK", ok: true }] },
      { cmd: "docker compose up -d", out: [{ t: "gunicorn, caddy, postgres, worker: up" }] },
      {
        cmd: "python train.py --encoder aerotraj_ultra --horizons 5..300",
        out: [{ t: "991.6 m mean error, 13 horizons, 19.6 ms on GPU" }],
      },
    ],
  };

  const STORE_KEY = "mv-lang";
  const getStoredLang = () => {
    try {
      const v = localStorage.getItem(STORE_KEY);
      if (v === "it" || v === "en") return v;
    } catch (_) {
      /* storage non disponibile */
    }
    return (navigator.language || "it").toLowerCase().startsWith("en") ? "en" : "it";
  };

  let lang = getStoredLang();
  let redrawScope = null;

  const consoleBody = $("#console-body");

  function renderConsole() {
    if (!consoleBody) return;
    let html = "";
    CONSOLE[lang].forEach((block, i) => {
      if (i > 0) html += "\n";
      html += `<span class="c-prompt">$</span> ${block.cmd}\n`;
      block.out.forEach((line) => {
        html += line.ok ? `<span class="c-ok">${line.t}</span>\n` : `${line.t}\n`;
      });
    });
    consoleBody.innerHTML = html.trimEnd();
  }

  /* ------------------------------------------------------------------
   * 2. Lingua
   * ------------------------------------------------------------------ */
  function applyLang(next) {
    lang = next;
    try {
      localStorage.setItem(STORE_KEY, lang);
    } catch (_) {
      /* ignora */
    }

    const dict = I18N[lang];
    document.documentElement.lang = lang;
    document.title = dict.meta.title;
    const metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", dict.meta.description);

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    $$("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr")
        .split(";")
        .forEach((pair) => {
          const [attr, key] = pair.split(":");
          if (attr && key && dict[key] !== undefined) el.setAttribute(attr.trim(), dict[key]);
        });
    });

    $$("[data-lang]").forEach((el) => {
      el.setAttribute("aria-pressed", String(el.getAttribute("data-lang") === lang));
    });

    const cvHero = $("#cv-hero");
    if (cvHero) cvHero.setAttribute("href", CV[lang]);

    renderConsole();
    renderCurvePlate();
    if (typeof redrawScope === "function") redrawScope();
  }

  /* ------------------------------------------------------------------
   * 3. Navigazione
   * ------------------------------------------------------------------ */
  const header = $("#site-header");
  const progress = $("#progress");
  const toTop = $("#to-top");
  const burger = $("#burger");

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.setProperty("--progress", `${max > 0 ? (y / max) * 100 : 0}%`);
    toTop?.classList.toggle("show", y > 640);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const closeMenu = () => {
    header?.classList.remove("nav-open");
    document.body.classList.remove("nav-locked");
    burger?.setAttribute("aria-expanded", "false");
    lenis?.start();
  };

  burger?.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    document.body.classList.toggle("nav-locked", open);
    burger.setAttribute("aria-expanded", String(open));
    if (open) lenis?.stop();
    else lenis?.start();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* Lenis (scroll fluido) — se disponibile */
  let lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduced) {
    lenis = new window.Lenis({ autoRaf: true, lerp: 0.11 });
    document.documentElement.style.scrollBehavior = "auto";
    const syncLenis = () => {
      try {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      } catch (_) {
        /* niente */
      }
    };
    requestAnimationFrame(syncLenis);
    window.addEventListener("load", () => setTimeout(syncLenis, 60), { once: true });
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) {
      lenis.scrollTo(target, { offset: -74 });
    } else {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
    try {
      history.replaceState(null, "", id);
    } catch (_) {
      /* file:// */
    }
  });

  /* Voce attiva */
  const sections = $$("main section[id]");
  const navAnchors = $$(".nav-links a[data-nav]");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navAnchors.forEach((a) =>
            a.setAttribute("aria-current", String(a.getAttribute("href") === id))
          );
        });
      },
      { rootMargin: "-42% 0px -54% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ------------------------------------------------------------------
   * 4. L'unico momento orchestrato: l'apertura
   *    (testo che entra come un blocco unico + lo strumento che si disegna)
   * ------------------------------------------------------------------ */
  const heroInner = $(".hero-inner");
  if (heroInner && motionOK && !reduced) {
    heroInner.style.opacity = "0";
    heroInner.style.transform = "translateY(14px)";
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      heroInner.style.opacity = "1";
      heroInner.style.transform = "none";
    };
    try {
      window.Motion
        .animate(
          heroInner,
          { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] },
          { duration: 0.7, easing: [0.2, 0.7, 0.2, 1] }
        )
        .finished.then(finish);
      setTimeout(finish, 1600);
    } catch (_) {
      finish();
    }
  }

  /* ------------------------------------------------------------------
   * 5. Lo strumento dell'hero: errore di previsione misurato
   *    I numeri vengono dal benchmark pubblicato in AeroTraj-Ultra
   *    (assets/js/aerotraj-data.js): nessuna curva inventata.
   * ------------------------------------------------------------------ */
  const SERIES_STYLE = {
    "AeroTraj-Ultra": { color: "#E9A13B", width: 2.6, dash: null },
    "FlightBERT++": { color: "rgba(156,143,126,.85)", width: 2, dash: [6, 5] },
    "CV con Doppler": { color: "rgba(156,143,126,.55)", width: 1.6, dash: [2, 5] },
    DDPM: { color: "rgba(156,143,126,.32)", width: 1.3, dash: [1, 5] },
  };
  const Y_MIN = 50;
  const Y_MAX = 20000;
  const X_MAX = 300;

  const scales = (rect) => ({
    x: (h) => rect.x0 + (h / X_MAX) * (rect.x1 - rect.x0),
    y: (v) => {
      const lo = Math.log10(Y_MIN);
      const hi = Math.log10(Y_MAX);
      const t = (Math.log10(Math.max(v, Y_MIN)) - lo) / (hi - lo);
      return rect.y1 - t * (rect.y1 - rect.y0);
    },
  });

  const fmt = (n, d = 1) =>
    n.toLocaleString(lang === "it" ? "it-IT" : "en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });

  /* --------- 5a. grafico statico nella scheda del progetto --------- */
  const PLATE = { w: 720, h: 380, x0: 66, x1: 664, y0: 44, y1: 318 };

  function renderCurvePlate() {
    const host = $("#curve-plate");
    if (!host || !DATA) return;
    const sc = scales(PLATE);
    const hz = DATA.horizons_s;
    const names = Object.keys(DATA.series);
    const parts = [];

    /* assi e griglia */
    parts.push(
      `<line x1="${PLATE.x0}" y1="${PLATE.y1}" x2="${PLATE.x1}" y2="${PLATE.y1}" stroke="rgba(239,230,212,.25)"/>`,
      `<line x1="${PLATE.x0}" y1="${PLATE.y0}" x2="${PLATE.x0}" y2="${PLATE.y1}" stroke="rgba(239,230,212,.25)"/>`
    );
    [100, 1000, 10000].forEach((v) => {
      const y = sc.y(v);
      parts.push(`<line x1="${PLATE.x0}" y1="${y}" x2="${PLATE.x1}" y2="${y}" stroke="rgba(239,230,212,.07)"/>`);
      parts.push(
        `<text x="${PLATE.x0 - 10}" y="${y + 4}" class="svg-label" text-anchor="end">${v >= 1000 ? v / 1000 + " km" : v + " m"}</text>`
      );
    });
    [10, 30, 60, 120, 300].forEach((h) => {
      const x = sc.x(h);
      parts.push(`<line x1="${x}" y1="${PLATE.y1}" x2="${x}" y2="${PLATE.y1 + 5}" stroke="rgba(239,230,212,.25)"/>`);
      parts.push(`<text x="${x}" y="${PLATE.y1 + 22}" class="svg-label" text-anchor="middle">${h}</text>`);
    });
    parts.push(
      `<text x="${PLATE.x1}" y="${PLATE.y1 + 44}" class="svg-label" text-anchor="end">${I18N[lang]["chart.axis.x"]}</text>`,
      `<text x="${PLATE.x0 + 4}" y="${PLATE.y0 - 16}" class="svg-label">${I18N[lang]["chart.axis.y"]}</text>`
    );

    /* curve */
    names.forEach((name) => {
      const st = SERIES_STYLE[name] || SERIES_STYLE.DDPM;
      const pts = DATA.series[name];
      const d = hz.map((h, i) => `${i ? "L" : "M"}${sc.x(h).toFixed(1)} ${sc.y(pts[i]).toFixed(1)}`).join(" ");
      parts.push(
        `<path d="${d}" fill="none" stroke="${st.color}" stroke-width="${st.width}"${st.dash ? ` stroke-dasharray="${st.dash.join(" ")}"` : ""} stroke-linejoin="round" stroke-linecap="round"/>`
      );
    });

    /* punto finale del modello */
    const last = DATA.series["AeroTraj-Ultra"];
    parts.push(
      `<circle cx="${sc.x(300).toFixed(1)}" cy="${sc.y(last[last.length - 1]).toFixed(1)}" r="4" fill="#E9A13B"/>`
    );

    host.innerHTML =
      `<svg viewBox="0 0 ${PLATE.w} ${PLATE.h}" role="img" aria-label="${I18N[lang]["projects.aerotraj.caption"]}">${parts.join("")}</svg>`;

    const legend = $("#curve-legend");
    if (legend) {
      legend.innerHTML = names
        .map((name) => {
          const st = SERIES_STYLE[name] || SERIES_STYLE.DDPM;
          const swatch = st.dash
            ? `repeating-linear-gradient(90deg, ${st.color} 0 5px, transparent 5px 9px)`
            : st.color;
          return `<li style="--swatch:${swatch}">${name}</li>`;
        })
        .join("");
    }
  }

  /* --------- 5b. strumento animato dell'hero --------- */
  const canvas = $("#scope");
  if (canvas && canvas.getContext && DATA) {
    const ctx = canvas.getContext("2d");
    const PAPER = "239, 230, 212";
    const BRASS = "233, 161, 59";
    const MUTE = "156, 143, 126";

    const hz = DATA.horizons_s;
    const ours = DATA.series["AeroTraj-Ultra"];
    const fbpp = DATA.series["FlightBERT++"];
    const cvd = DATA.series["CV con Doppler"];
    const heroSeries = [
      { name: "FlightBERT++", pts: fbpp, st: SERIES_STYLE["FlightBERT++"] },
      { name: "CV con Doppler", pts: cvd, st: SERIES_STYLE["CV con Doppler"] },
    ];

    let W = 0;
    let H = 0;
    let dpr = 1;
    let rafId = null;
    let started = false;
    let done = false;
    let lastT = 0;

    const END = 3600;
    const ease = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
    const prog = (t, start, dur) => ease((t - start) / dur);

    /* Il grafico vive nella metà destra dell'hero: il testo resta libero.
       Sotto i ~1040 px lo strumento lascia il posto alla graticola e i
       dati restano nella scheda del progetto, dove c'è spazio per leggerli. */
    const plotRect = () => {
      const wide = W >= 1040;
      return {
        wide,
        x0: wide ? W * 0.53 : W * 0.4,
        x1: W - (wide ? 56 : 22),
        y0: H * (wide ? 0.13 : 0.28),
        y1: H * (wide ? 0.58 : 0.56),
      };
    };

    let sc = scales({ x0: 0, x1: 1, y0: 0, y1: 1 });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = plotRect();
      sc = scales(r);
      draw(done || reduced ? END : lastT);
    }

    /* polilinea tracciata fino alla frazione p dei punti */
    function drawPoly(pts, p, color, width, dash) {
      if (p <= 0) return;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      const upto = p * (pts.length - 1);
      for (let i = 0; i < pts.length - 1; i++) {
        const seg = Math.min(Math.max(upto - i, 0), 1);
        const x0 = sc.x(hz[i]);
        const y0 = sc.y(pts[i]);
        const x1 = sc.x(hz[i + 1]);
        const y1 = sc.y(pts[i + 1]);
        if (i === 0) ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + (x1 - x0) * seg, y0 + (y1 - y0) * seg);
        if (seg < 1) break;
      }
      ctx.stroke();
      ctx.restore();
    }

    function label(str, x, y, color, size, align = "start") {
      ctx.save();
      ctx.font = `600 ${size}px "JetBrains Mono", monospace`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(str, x, y);
      ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const r = plotRect();
      const fs = Math.max(10, Math.min(13, Math.round(W / 115)));

      /* graticule */
      const g = prog(t, 0, 400);
      if (g > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(${PAPER}, ${0.11 * g})`;
        ctx.lineWidth = 1;
        const step = 64;
        for (let x = step; x < W; x += step) {
          for (let y = step / 2; y < H; y += step) {
            ctx.beginPath();
            ctx.moveTo(x - 4, y);
            ctx.lineTo(x + 4, y);
            ctx.moveTo(x, y - 4);
            ctx.lineTo(x, y + 4);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      if (!r.wide) {
        if (!reduced && t >= END) {
          done = true;
          cancelAnimationFrame(rafId);
        }
        return;
      }

      /* assi */
      const ga = prog(t, 250, 400);
      if (ga > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(${PAPER}, ${0.24 * ga})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(r.x0, r.y1);
        ctx.lineTo(r.x1, r.y1);
        ctx.moveTo(r.x0, r.y0);
        ctx.lineTo(r.x0, r.y1);
        ctx.stroke();
        ctx.restore();
      }

      /* curve di riferimento */
      const gc = prog(t, 500, 1500);
      heroSeries.forEach((srs) => {
        drawPoly(srs.pts, gc, srs.st.color, srs.st.width, srs.st.dash);
      });

      /* curva del modello */
      const go = prog(t, 700, 1500);
      drawPoly(ours, go, `rgba(${BRASS}, 0.95)`, 2.6, null);

      /* marcatore e lettura */
      const gm = prog(t, 2100, 1200);
      if (gm > 0) {
        const idx = Math.min(ours.length - 1, Math.floor(gm * (ours.length - 1)));
        const h = hz[idx];
        const mx = sc.x(h);
        const my = sc.y(ours[idx]);
        const val = ours[idx];
        const better = fbpp[idx] > 0 ? Math.round((1 - val / fbpp[idx]) * 100) : 0;

        ctx.save();
        ctx.strokeStyle = `rgba(${BRASS}, ${0.35 * gm})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx, r.y0);
        ctx.lineTo(mx, r.y1);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BRASS}, ${0.95 * gm})`;
        ctx.fill();

        const bx = Math.min(mx + 16, r.x1 - 160);
        const by = Math.max(my - 48, r.y0 + 26);
        /* fondo scuro dietro la lettura, per leggibilità sulle curve */
        ctx.save();
        ctx.fillStyle = "rgba(26,21,17,.8)";
        ctx.fillRect(bx - 7, by - fs - 7, 24 * fs * 0.62 + 14, 3 * fs + 18);
        ctx.restore();
        label(`t+${h} s`, bx, by, `rgba(${PAPER}, ${0.9 * gm})`, fs);
        label(`${fmt(val, 1)} m`, bx, by + 15, `rgba(${BRASS}, ${0.95 * gm})`, fs);
        label(`−${better}% vs FlightBERT++`, bx, by + 30, `rgba(${MUTE}, ${0.95 * gm})`, fs);
      }

      /* etichette assi e legenda */
      const gl = prog(t, 3000, 500);
      if (gl > 0) {
        [10, 30, 60, 120, 300].forEach((h) => {
          const x = sc.x(h);
          ctx.save();
          ctx.strokeStyle = `rgba(${PAPER}, ${0.24 * gl})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, r.y1);
          ctx.lineTo(x, r.y1 + 5);
          ctx.stroke();
          ctx.restore();
          label(String(h), x, r.y1 + 20, `rgba(${MUTE}, ${0.9 * gl})`, fs, "middle");
        });
        [100, 1000, 10000].forEach((v) => {
          const y = sc.y(v);
          label(v >= 1000 ? `${v / 1000} km` : `${v} m`, r.x0 - 10, y + 4, `rgba(${MUTE}, ${0.9 * gl})`, fs, "end");
        });
        label(I18N[lang]["chart.axis.x"], r.x1, r.y1 + 40, `rgba(${MUTE}, ${0.9 * gl})`, fs, "end");

        /* legenda */
        let lx = r.x0;
        const ly = r.y1 + 64;
        const items = [
          { name: "AeroTraj-Ultra", st: SERIES_STYLE["AeroTraj-Ultra"] },
          { name: "FlightBERT++", st: SERIES_STYLE["FlightBERT++"] },
          { name: "CV con Doppler", st: SERIES_STYLE["CV con Doppler"] },
        ];
        items.forEach((it) => {
          ctx.save();
          ctx.strokeStyle = it.st.color;
          ctx.lineWidth = it.st.width;
          if (it.st.dash) ctx.setLineDash(it.st.dash);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + 22, ly);
          ctx.stroke();
          ctx.restore();
          label(it.name, lx + 30, ly + 4, `rgba(${PAPER}, ${0.75 * gl})`, fs);
          lx += 38 + it.name.length * fs * 0.62;
        });
      }

      if (!reduced && t >= END) {
        done = true;
        cancelAnimationFrame(rafId);
      }
    }

    const loop = (now) => {
      lastT = now - startTime;
      draw(lastT);
      if (!done && !reduced) rafId = requestAnimationFrame(loop);
    };
    let startTime = 0;

    function start() {
      if (started || reduced || done) return;
      started = true;
      startTime = performance.now();
      rafId = requestAnimationFrame(loop);
    }

    redrawScope = () => draw(done || reduced ? END : lastT);
    resize();
    if (reduced) {
      done = true;
      draw(END);
    } else if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && start()),
        { threshold: 0.05 }
      ).observe($("#home"));
    } else {
      start();
    }
    window.addEventListener("resize", resize);
  }

  /* ------------------------------------------------------------------
   * 6. Avvio
   * ------------------------------------------------------------------ */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  applyLang(lang);

  $("#lang-it")?.addEventListener("click", () => applyLang("it"));
  $("#lang-en")?.addEventListener("click", () => applyLang("en"));
})();
