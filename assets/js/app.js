/* ==========================================================================
   Marco Valle — portfolio
   app.js — i18n IT/EN, animazioni (Motion), canvas delle traiettorie,
   terminale digitato, contatori, navigazione.
   Nessun framework: JavaScript moderno che degrada con grazia.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionOK = typeof window.Motion !== "undefined";

  /* ------------------------------------------------------------------
   * 1. Testi — dizionario italiano e inglese
   * ------------------------------------------------------------------ */
  const CV = {
    it: "assets/cv/Marco_Valle_CV_IT.pdf",
    en: "assets/cv/Marco_Valle_CV_EN.pdf",
  };

  const I18N = {
    it: {
      meta: {
        title: "Marco Valle — Sviluppatore Back-End & Data Analyst",
        description:
          "Sviluppatore back-end e data analyst: gestionale ERP in produzione (Django + PostgreSQL), Transformer PyTorch per le traiettorie aeree, IoT con ESP32. Python · Django · PyTorch · Docker · Linux.",
      },
      roles: [
        "Sviluppatore Back-End",
        "Data Analyst",
        "Python · Django · PostgreSQL",
        "Deep learning con PyTorch",
        "Tinkering con ESP32 e sensori",
      ],
      terminal: [
        { cmd: "python manage.py test", out: [
          { text: "Ran 480 tests in 32.4s — OK (0 failures, 0 errors)", cls: "t-ok" },
        ]},
        { cmd: "docker compose up -d", out: [
          { text: "✔ gunicorn · caddy · postgres — servizi attivi", cls: "t-dim" },
        ]},
        { cmd: "python flightprev/train.py --records 65M", out: [
          { text: "epoch 42/42 — ADE 582 m (−30% vs baseline) ✔", cls: "t-ok" },
        ]},
      ],
      "a11y.skip": "Salta al contenuto",
      "a11y.lang": "Cambia lingua",
      "a11y.menu": "Apri il menu",
      "a11y.top": "Torna su",
      "nav.about": "Chi sono",
      "nav.skills": "Competenze",
      "nav.projects": "Progetti",
      "nav.resume": "Percorso",
      "nav.contact": "Contatti",
      "hero.eyebrow": "Ciao, sono 👋",
      "hero.tagline":
        "Costruisco software che lavora davvero: un gestionale ERP in produzione, un Transformer che prevede le rotte degli aerei e firmware per l'IoT.",
      "hero.cta.projects": "Guarda i progetti",
      "hero.cta.cv": "Scarica il CV",
      "hero.meta.location": "Bergamo, Italia",
      "hero.meta.languages": "Italiano nativo · Inglese B2",
      "hero.meta.availability": "In sede e in remoto",
      "stats.tests": "test automatici",
      "stats.records": "record ADS-B elaborati",
      "stats.error": "errore medio vs baseline",
      "stats.degree": "voto di laurea",
      "about.eyebrow": "Chi sono",
      "about.title": "Dal C++ ai Transformer",
      "about.p1":
        "Sono di Bergamo e mi sono laureato in Informatica all'Università di Milano-Bicocca (99/110) con una tesi sui modelli non autoregressivi (Transformer) per la previsione di traiettorie aeree, dopo un semestre Erasmus+ a Łódź, in Polonia.",
      "about.p2":
        "In Aquaforma S.r.l. gestisco e personalizzo Odoo Enterprise e sviluppo il gestionale aziendale in Python/Django — anagrafiche, preventivi, ordini, magazzino, DDT e fatturazione elettronica SDI — oggi in produzione su VPS Linux con Docker, oltre 480 test automatici e CI su GitHub Actions.",
      "about.p3":
        "Mi piacciono i progetti difficili e le soluzioni su misura: dal modello di deep learning addestrato su 65 milioni di record ADS-B al firmware ESP32 per monitorare la chimica dell'acqua della piscina. Quando c'è un problema concreto da risolvere, è lì che voglio essere.",
      "about.facts.location": "Bergamo, Lombardia — disponibile in sede e da remoto",
      "about.facts.degree": "Laurea in Informatica (L-31), 99/110 — Milano-Bicocca",
      "about.facts.lang": "Italiano nativo · Inglese B2 certificato",
      "about.facts.scout": "Educatore scout dal 2019, tra i ragazzi dai 15 ai 19 anni",
      "skills.eyebrow": "Competenze",
      "skills.title": "Con cosa lavoro ogni giorno",
      "skills.sub": "Uno stack concreto: dal back-end ai dati, fino all'hardware.",
      "skills.backend.title": "Back-End & Web",
      "skills.data.title": "Dati & Machine Learning",
      "skills.devops.title": "DevOps & Cloud",
      "skills.embedded.title": "Embedded & Mobile",
      "skills.misc.title": "Linguaggi & ERP",
      "skills.misc.erp": "ERP & fatturazione SDI",
      "projects.eyebrow": "Progetti",
      "projects.title": "Cose vere, fatte per durare",
      "projects.sub": "Non esperimenti da tutorial: software in produzione, ricerca e hardware.",
      "projects.erp.badge1": "In produzione",
      "projects.erp.badge2": "Full-stack",
      "projects.erp.title": "Gestionale aziendale (ERP)",
      "projects.erp.sub": "Aquaforma S.r.l. · 2026 — oggi",
      "projects.erp.p1":
        "Gestionale completo in Python/Django + PostgreSQL: anagrafiche, catalogo, preventivi, ordini, magazzino, rifornimento fornitori, DDT e fatturazione elettronica verso lo SDI (XML FatturaPA FPR12 e trasmissione PEC).",
      "projects.erp.p2":
        "Deploy su VPS Linux con Docker Compose (Gunicorn, Caddy, HTTPS, backup automatici), 480+ test automatici con CI su GitHub Actions e server MCP in sola lettura per l'accesso ai dati tramite assistenti AI.",
      "projects.erp.s1": "test automatici",
      "projects.erp.s2": "GitHub Actions a ogni push",
      "projects.erp.s3": "FPR12 + PEC, in produzione",
      "projects.flight.badge1": "Deep learning",
      "projects.flight.badge2": "Ricerca personale",
      "projects.flight.title": "FlightPREV — Previsione di traiettorie aeree",
      "projects.flight.sub": "Progetto personale · 2025 — 2026 · dalla tesi di laurea",
      "projects.flight.p1":
        "Transformer in PyTorch che prevede la posizione degli aerei da 10 a 120 secondi, addestrato su oltre 65 milioni di record ADS-B con una pipeline completa: pulizia, segmentazione, ricampionamento e finestre scorrevoli.",
      "projects.flight.p2":
        "Errore medio (ADE) di 582 m contro gli 833 m della migliore baseline cinematica (−30%) grazie al residual learning; batte una reimplementazione di FlightBERT del 75–90% su tutti gli orizzonti.",
      "projects.flight.s1": "record ADS-B elaborati",
      "projects.flight.s2": "ADE medio (−30% vs baseline)",
      "projects.flight.s3": "errore vs FlightBERT",
      "projects.iot.badge1": "Hardware & mobile",
      "projects.iot.badge2": "Progetto continuo",
      "projects.iot.title": "IoT — Domotica e monitoraggio piscina",
      "projects.iot.p1":
        "Firmware ESP32 (C/C++/Arduino) per la gestione di relè e il monitoraggio della chimica dell'acqua con sensori I2C e ADC a 16 bit (pH, cloro, acido cianurico, salinità). App Android in Kotlin con controllo via Bluetooth e integrazione con Home Assistant.",
      "projects.iot.note": "Codice disponibile su richiesta.",
      "projects.others.title": "Altri progetti",
      "projects.others.supercold": 'Un "SuperHot" in C++ puro, senza librerie grafiche.',
      "projects.others.tris": "Tris in C++ puro, anche in single player.",
      "projects.others.flashcard": "Flashcard di studio per i corsi di Informatica a Bicocca.",
      "projects.others.open": "Apri su GitHub",
      "projects.others.all": "Vedi tutti i repository",
      "chart.title": "Previsione traiettoria · orizzonte +120 s",
      "chart.now": "ora",
      "chart.real": "reale",
      "resume.eyebrow": "Percorso",
      "resume.title": "Esperienza e formazione",
      "resume.work": "Esperienza",
      "resume.edu": "Formazione & volontariato",
      "resume.aqua.when": "2026 — oggi",
      "resume.aqua.role": "Socio e dipendente · Sviluppo software e gestione IT",
      "resume.aqua.r1":
        "Progettazione e sviluppo del gestionale aziendale (ERP) in Python/Django + PostgreSQL, in produzione su VPS Linux.",
      "resume.aqua.r2":
        "Deploy con Docker Compose (Gunicorn, Caddy, HTTPS) e backup automatici; 480+ test automatizzati e CI su GitHub Actions.",
      "resume.aqua.r3":
        "Gestione e personalizzazione di Odoo Enterprise (ERP/CRM); infrastruttura IT, rete e sito aziendale.",
      "resume.pavis.when": "mar. 2023 — 2025",
      "resume.pavis.role": "Installazione e manutenzione piscine",
      "resume.pavis.r1":
        "Manutenzione stagionale e analisi chimica delle acque (pH, cloro, acido cianurico, salinità); rapporti con clienti e fornitori.",
      "resume.poppies.when": "feb. — giu. 2023",
      "resume.poppies.role": "Assistenza e consulenza IT",
      "resume.poppies.r1":
        "Configurazione di servizi di rete on-premise; manutenzione e aggiornamento di postazioni di lavoro e componenti hardware.",
      "resume.unimib.where": "Università di Milano-Bicocca",
      "resume.unimib.when": "set. 2021 — mar. 2025",
      "resume.unimib.role": "Laurea in Informatica (L-31) · 99/110",
      "resume.unimib.r1":
        "Tesi: modelli non autoregressivi (Transformer) per la previsione di traiettorie aeree, in PyTorch.",
      "resume.erasmus.where": "Università di Łódź — Polonia",
      "resume.erasmus.when": "ott. 2023 — mar. 2024",
      "resume.erasmus.role": "Erasmus+",
      "resume.erasmus.r1": "Un semestre di corsi ed esami in inglese in un ambiente internazionale.",
      "resume.scout.where": "Educatore scout — Bergamo",
      "resume.scout.when": "2019 — oggi",
      "resume.scout.role": "Federazione Scout Europa",
      "resume.scout.r1":
        "Progetto e conduco attività educative per ragazzi dai 15 ai 19 anni: leadership e lavoro di squadra.",
      "contact.eyebrow": "Contatti",
      "contact.title": "Lavoriamo insieme",
      "contact.sub": "Cerchi uno sviluppatore back-end o un data analyst? Scrivimi: rispondo a tutti.",
      "contact.cv": "Curriculum vitae",
      "contact.cv.it": "Italiano · PDF",
      "contact.cv.en": "English · PDF",
      "footer.rights": "Tutti i diritti riservati",
      "footer.built": "Fatto a mano con HTML, CSS e JavaScript",
      "footer.source": "codice sorgente",
    },

    en: {
      meta: {
        title: "Marco Valle — Back-End Developer & Data Analyst",
        description:
          "Back-end developer and data analyst: ERP system running in production (Django + PostgreSQL), PyTorch Transformer for aircraft trajectories, IoT with ESP32. Python · Django · PyTorch · Docker · Linux.",
      },
      roles: [
        "Back-End Developer",
        "Data Analyst",
        "Python · Django · PostgreSQL",
        "Deep learning with PyTorch",
        "Tinkering with ESP32 and sensors",
      ],
      terminal: [
        { cmd: "python manage.py test", out: [
          { text: "Ran 480 tests in 32.4s — OK (0 failures, 0 errors)", cls: "t-ok" },
        ]},
        { cmd: "docker compose up -d", out: [
          { text: "✔ gunicorn · caddy · postgres — services up", cls: "t-dim" },
        ]},
        { cmd: "python flightprev/train.py --records 65M", out: [
          { text: "epoch 42/42 — ADE 582 m (−30% vs baseline) ✔", cls: "t-ok" },
        ]},
      ],
      "a11y.skip": "Skip to content",
      "a11y.lang": "Switch language",
      "a11y.menu": "Open menu",
      "a11y.top": "Back to top",
      "nav.about": "About",
      "nav.skills": "Skills",
      "nav.projects": "Projects",
      "nav.resume": "Resume",
      "nav.contact": "Contact",
      "hero.eyebrow": "Hi, I'm 👋",
      "hero.tagline":
        "I build software that actually works: an ERP system running in production, a Transformer predicting aircraft trajectories, and IoT firmware.",
      "hero.cta.projects": "View projects",
      "hero.cta.cv": "Download CV",
      "hero.meta.location": "Bergamo, Italy",
      "hero.meta.languages": "Italian (native) · English B2",
      "hero.meta.availability": "On-site and remote",
      "stats.tests": "automated tests",
      "stats.records": "ADS-B records processed",
      "stats.error": "average error vs baseline",
      "stats.degree": "degree score",
      "about.eyebrow": "About me",
      "about.title": "From C++ to Transformers",
      "about.p1":
        "I'm from Bergamo, Italy. I hold a BSc in Computer Science from the University of Milano-Bicocca (99/110) with a thesis on non-autoregressive (Transformer) models for air traffic trajectory prediction, after a six-month Erasmus+ exchange in Łódź, Poland.",
      "about.p2":
        "At Aquaforma S.r.l. I administer and customize Odoo Enterprise and I develop the in-house ERP in Python/Django — contacts, quotes, orders, inventory, delivery notes and Italian e-invoicing (SDI) — now in production on a Linux VPS with Docker, 480+ automated tests and CI on GitHub Actions.",
      "about.p3":
        "I like hard projects and tailored solutions: from deep learning models trained on 65 million ADS-B records to ESP32 firmware monitoring pool water chemistry. When there's a concrete problem to solve, that's where I want to be.",
      "about.facts.location": "Bergamo, Lombardy — available on-site and remotely",
      "about.facts.degree": "BSc in Computer Science (L-31), 99/110 — Milano-Bicocca",
      "about.facts.lang": "Italian (native) · English B2 certified",
      "about.facts.scout": "Scout educator since 2019, with teens aged 15 to 19",
      "skills.eyebrow": "Skills",
      "skills.title": "What I work with every day",
      "skills.sub": "A pragmatic stack: from back-end to data, all the way down to hardware.",
      "skills.backend.title": "Back-End & Web",
      "skills.data.title": "Data & Machine Learning",
      "skills.devops.title": "DevOps & Cloud",
      "skills.embedded.title": "Embedded & Mobile",
      "skills.misc.title": "Languages & ERP",
      "skills.misc.erp": "ERP & SDI e-invoicing",
      "projects.eyebrow": "Projects",
      "projects.title": "Real things, built to last",
      "projects.sub": "Not tutorial experiments: production software, research and hardware.",
      "projects.erp.badge1": "In production",
      "projects.erp.badge2": "Full-stack",
      "projects.erp.title": "Business Management System (ERP)",
      "projects.erp.sub": "Aquaforma S.r.l. · 2026 — present",
      "projects.erp.p1":
        "Full business management system in Python/Django + PostgreSQL: contacts, catalogue, quotes, orders, inventory, supplier replenishment, delivery notes and Italian e-invoicing towards SDI (FatturaPA FPR12 XML and PEC transmission).",
      "projects.erp.p2":
        "Deployed on a Linux VPS with Docker Compose (Gunicorn, Caddy, HTTPS, automatic backups), 480+ automated tests with CI on GitHub Actions and a read-only MCP server for AI-assisted data access.",
      "projects.erp.s1": "automated tests",
      "projects.erp.s2": "GitHub Actions on every push",
      "projects.erp.s3": "FPR12 + PEC, in production",
      "projects.flight.badge1": "Deep learning",
      "projects.flight.badge2": "Personal research",
      "projects.flight.title": "FlightPREV — Aircraft Trajectory Prediction",
      "projects.flight.sub": "Personal project · 2025 — 2026 · from my BSc thesis",
      "projects.flight.p1":
        "PyTorch Transformer predicting aircraft positions 10 to 120 seconds ahead, trained on over 65 million ADS-B records with a full data pipeline: cleaning, segmentation, resampling and sliding windows.",
      "projects.flight.p2":
        "Average error (ADE) of 582 m against 833 m of the best kinematic baseline (−30%) via residual learning; it outperforms a FlightBERT reimplementation by 75–90% at all horizons.",
      "projects.flight.s1": "ADS-B records processed",
      "projects.flight.s2": "average ADE (−30% vs baseline)",
      "projects.flight.s3": "error vs FlightBERT",
      "projects.iot.badge1": "Hardware & mobile",
      "projects.iot.badge2": "Ongoing project",
      "projects.iot.title": "IoT — Home automation and pool monitoring",
      "projects.iot.p1":
        "ESP32 firmware (C/C++/Arduino) for relay control and water-chemistry monitoring with I2C sensors and a 16-bit ADC (pH, chlorine, cyanuric acid, salinity). Kotlin Android app with Bluetooth control and Home Assistant integration.",
      "projects.iot.note": "Code available on request.",
      "projects.others.title": "Other projects",
      "projects.others.supercold": 'A "SuperHot" clone in pure C++, no graphics libraries.',
      "projects.others.tris": "Tic-tac-toe in pure C++, with a single-player mode.",
      "projects.others.flashcard": "Study flashcards for Computer Science courses at Bicocca.",
      "projects.others.open": "Open on GitHub",
      "projects.others.all": "See all repositories",
      "chart.title": "Trajectory prediction · horizon +120 s",
      "chart.now": "now",
      "chart.real": "actual",
      "resume.eyebrow": "Resume",
      "resume.title": "Experience and education",
      "resume.work": "Experience",
      "resume.edu": "Education & volunteering",
      "resume.aqua.when": "2026 — present",
      "resume.aqua.role": "Partner and employee · Software development and IT management",
      "resume.aqua.r1":
        "Designed and built the in-house ERP in Python/Django + PostgreSQL, now in production on a Linux VPS.",
      "resume.aqua.r2":
        "Deployment with Docker Compose (Gunicorn, Caddy, HTTPS) and automatic backups; 480+ automated tests and CI on GitHub Actions.",
      "resume.aqua.r3":
        "Administer and customize Odoo Enterprise (ERP/CRM); IT infrastructure, network and corporate website.",
      "resume.pavis.when": "Mar. 2023 — 2025",
      "resume.pavis.role": "Swimming pool installation and maintenance",
      "resume.pavis.r1":
        "Seasonal maintenance and water-chemistry analysis (pH, chlorine, cyanuric acid, salinity); customer and supplier relations.",
      "resume.poppies.when": "Feb. — Jun. 2023",
      "resume.poppies.role": "IT support and consulting",
      "resume.poppies.r1":
        "Configured on-premise network services; maintained and upgraded workstations and hardware.",
      "resume.unimib.where": "University of Milano-Bicocca",
      "resume.unimib.when": "Sep. 2021 — Mar. 2025",
      "resume.unimib.role": "BSc in Computer Science (L-31) · 99/110",
      "resume.unimib.r1":
        "Thesis: non-autoregressive models (Transformer) for air traffic trajectory prediction, in PyTorch.",
      "resume.erasmus.where": "University of Łódź — Poland",
      "resume.erasmus.when": "Oct. 2023 — Mar. 2024",
      "resume.erasmus.role": "Erasmus+",
      "resume.erasmus.r1": "One semester of courses and exams in English in an international environment.",
      "resume.scout.where": "Scout educator — Bergamo",
      "resume.scout.when": "2019 — present",
      "resume.scout.role": "Federazione Scout Europa",
      "resume.scout.r1":
        "I plan and lead educational activities for teens aged 15–19: leadership and teamwork.",
      "contact.eyebrow": "Contact",
      "contact.title": "Let's work together",
      "contact.sub": "Looking for a back-end developer or a data analyst? Write me: I answer everyone.",
      "contact.cv": "Curriculum vitae",
      "contact.cv.it": "Italiano · PDF",
      "contact.cv.en": "English · PDF",
      "footer.rights": "All rights reserved",
      "footer.built": "Handcrafted with HTML, CSS and JavaScript",
      "footer.source": "source code",
    },
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

  /* ------------------------------------------------------------------
   * 2. Terminale animato
   * ------------------------------------------------------------------ */
  const terminalBody = $("#terminal-body");
  let terminalPlayed = false;

  function renderTerminalInstant() {
    if (!terminalBody) return;
    const lines = I18N[lang].terminal;
    let html = "";
    lines.forEach((line) => {
      html += `<span class="t-prompt">$ </span>${line.cmd}\n`;
      line.out.forEach((o) => {
        html += `<span class="${o.cls}">${o.text}</span>\n`;
      });
    });
    terminalBody.innerHTML = html + '<span class="caret"></span>';
    terminalPlayed = true;
  }

  async function typeTerminal() {
    if (!terminalBody || terminalPlayed) return;
    terminalPlayed = true;
    if (reduced) {
      renderTerminalInstant();
      return;
    }
    const lines = I18N[lang].terminal;
    terminalBody.innerHTML = "";
    const caret = document.createElement("span");
    caret.className = "caret";
    terminalBody.appendChild(caret);

    const type = async (text, cls, speed = 24) => {
      const span = document.createElement(cls ? "span" : "span");
      if (cls) span.className = cls;
      terminalBody.insertBefore(span, caret);
      for (const ch of text) {
        span.textContent += ch;
        await wait(speed);
      }
    };

    for (const line of lines) {
      await type("$ ", "t-prompt", 10);
      await type(line.cmd, "", 22);
      await type("\n", "", 0);
      await wait(260);
      for (const o of line.out) {
        await type(o.text, o.cls, 4);
        await type("\n", "", 0);
      }
      await wait(420);
    }
  }

  /* ------------------------------------------------------------------
   * 3. Ruoli digitati nell'hero
   * ------------------------------------------------------------------ */
  const roleEl = $("#role-typed");
  let roleTimer = null;

  function startRoles() {
    if (!roleEl) return;
    if (roleTimer) clearTimeout(roleTimer);
    const words = I18N[lang].roles;

    if (reduced) {
      roleEl.textContent = words[0];
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIndex % words.length];
      if (!deleting) {
        charIndex++;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          roleTimer = setTimeout(tick, 2100);
          return;
        }
        roleTimer = setTimeout(tick, 42);
      } else {
        charIndex--;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex++;
          roleTimer = setTimeout(tick, 380);
          return;
        }
        roleTimer = setTimeout(tick, 20);
      }
    };
    tick();
  }

  /* ------------------------------------------------------------------
   * 4. Applicazione della lingua
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

    const cvHero = $("#cv-hero");
    if (cvHero) cvHero.setAttribute("href", CV[lang]);

    $$("[data-lang-opt]").forEach((el) => {
      el.classList.toggle("is-active", el.getAttribute("data-lang-opt") === lang);
    });

    /* Il terminale non si ri-digita a metà: si ri-renderizza subito */
    if (terminalPlayed) renderTerminalInstant();

    startRoles();
  }

  /* ------------------------------------------------------------------
   * 5. Navigazione: header, progress, menu mobile, link attivo
   * ------------------------------------------------------------------ */
  const header = $("#site-header");
  const progress = $("#progress");
  const toTop = $("#to-top");
  const burger = $("#burger");
  const navLinks = $("#nav-links");

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.setProperty("--progress", `${max > 0 ? (y / max) * 100 : 0}%`);
    header?.classList.toggle("scrolled", y > 12);
    toTop?.classList.toggle("show", y > 620);
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
  }

  /* Link interni: chiudi menu e scrolla con Lenis se attivo */
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
      lenis.scrollTo(target, { offset: -78 });
    } else {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
    try {
      history.replaceState(null, "", id);
    } catch (_) {
      /* file:// o ambienti senza history */
    }
  });

  /* Link attivo nella navbar */
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
   * 6. Rivelazioni, contatori, trigger .play
   * ------------------------------------------------------------------ */
  const revealEls = $$("[data-reveal]");
  const counters = $$(".count");
  const media = $$(".project-media");

  const runCounter = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target = Number(el.getAttribute("data-count") || "0");
    if (reduced) {
      el.textContent = String(target);
      return;
    }
    const duration = 1500;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      el.textContent = String(Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (motionOK && !reduced) {
    try {
      const { animate, inView } = window.Motion;

      revealEls.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(26px)";
      });

      inView(
        revealEls,
        (el) => {
          animate(
            el,
            { opacity: [0, 1], transform: ["translateY(26px)", "translateY(0px)"] },
            { duration: 0.72, easing: [0.2, 0.7, 0.2, 1] }
          ).finished.then(() => {
            el.style.opacity = "1";
            el.style.transform = "none";
            el.classList.add("is-in");
          });
        },
        { margin: "0px 0px -70px 0px" }
      );

      /* Ingresso dell'hero, in sequenza */
      const heroEls = $$("[data-animate]");
      heroEls.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(22px)";
        animate(
          el,
          { opacity: [0, 1], transform: ["translateY(22px)", "translateY(0px)"] },
          { duration: 0.8, delay: i * 0.09, easing: [0.2, 0.7, 0.2, 1] }
        ).finished.then(() => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      });
      onScroll();

      /* Rete di sicurezza: se qualcosa va storto, nessun contenuto resta nascosto */
      setTimeout(() => {
        revealEls.forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
              el.style.opacity = "1";
              el.style.transform = "none";
              el.classList.add("is-in");
            }
          }
        });
      }, 3500);
    } catch (_) {
      revealEls.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.classList.add("is-in");
      });
    }
  }

  /* Fallback senza Motion: si mostra tutto subito */
  if (!motionOK || reduced) {
    $$("[data-animate]").forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
    });
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-in", "play");
          if (el.matches(".terminal")) typeTerminal();
          io.unobserve(el);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" }
    );

    [...revealEls, ...media, $(".terminal")].filter(Boolean).forEach((el) => io.observe(el));

    /* I contatori della fascia numeri */
    const statsIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counters.filter((c) => entry.target.contains(c)).forEach(runCounter);
            statsIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    $("#stats") && statsIO.observe($("#stats"));
  } else {
    counters.forEach((c) => (c.textContent = c.getAttribute("data-count")));
    media.forEach((el) => el.classList.add("play"));
    typeTerminal();
  }

  /* ------------------------------------------------------------------
   * 7. Canvas — stelle e traiettorie aeree
   * ------------------------------------------------------------------ */
  const canvas = $("#sky");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let W = 0;
    let H = 0;
    let stars = [];
    let planes = [];
    let running = false;
    let rafId = null;
    let dpr = 1;
    const rand = (min, max) => min + Math.random() * (max - min);

    const makeStars = (n) => {
      stars = Array.from({ length: n }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: rand(0.4, 1.5),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.3, 1.1),
      }));
    };

    const makePlane = (seed) => {
      const fromLeft = Math.random() > 0.45;
      const start = fromLeft
        ? { x: rand(-0.05, 0.25), y: rand(0.55, 1.05) }
        : { x: rand(0.75, 1.05), y: rand(-0.05, 0.2) };
      const end = fromLeft
        ? { x: rand(0.85, 1.1), y: rand(-0.05, 0.3) }
        : { x: rand(-0.1, 0.15), y: rand(0.75, 1.05) };
      const mid = {
        x: (start.x + end.x) / 2 + rand(-0.16, 0.16),
        y: (start.y + end.y) / 2 + rand(-0.22, 0.22),
      };
      return {
        start,
        mid,
        end,
        t: seed ? Math.random() : 0,
        speed: rand(0.0016, 0.0034) * (fromLeft ? 1 : -1),
        trail: [],
        hue: Math.random() > 0.5 ? "34, 211, 238" : "167, 139, 250",
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars(W < 700 ? 70 : 130);
      planes = Array.from({ length: W < 700 ? 4 : 7 }, (_, i) => makePlane(true));
    };

    const bezier = (p, t) => {
      const u = 1 - t;
      return {
        x: u * u * p.start.x + 2 * u * t * p.mid.x + t * t * p.end.x,
        y: u * u * p.start.y + 2 * u * t * p.mid.y + t * t * p.end.y,
      };
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, W, H);

      /* stelle */
      stars.forEach((s) => {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(time * 0.001 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${0.16 * tw})`;
        ctx.fill();
      });

      /* traiettorie */
      planes.forEach((p) => {
        if (!reduced) {
          p.t += p.speed;
          const out = p.t < -0.15 || p.t > 1.15;
          if (out) Object.assign(p, makePlane(false));
        }
        const t = Math.min(Math.max(p.t, 0), 1);
        const pos = bezier(p, t);
        const posPx = { x: pos.x * W, y: pos.y * H };

        /* arco completo, appena visibile */
        ctx.beginPath();
        ctx.moveTo(p.start.x * W, p.start.y * H);
        ctx.quadraticCurveTo(p.mid.x * W, p.mid.y * H, p.end.x * W, p.end.y * H);
        ctx.strokeStyle = `rgba(${p.hue}, 0.06)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        /* scia */
        if (!reduced) {
          p.trail.push(posPx);
          if (p.trail.length > 26) p.trail.shift();
          p.trail.forEach((pt, i) => {
            const a = (i / p.trail.length) * 0.35;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.hue}, ${a})`;
            ctx.fill();
          });
        }

        /* il "velivolo" */
        ctx.beginPath();
        ctx.arc(posPx.x, posPx.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue}, 0.95)`;
        ctx.shadowColor = `rgba(${p.hue}, 0.9)`;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (running) rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      draw(0);
    } else if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0.02 }
      ).observe($("#home"));
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
        else if ($("#home").getBoundingClientRect().bottom > 0) start();
      });
    } else {
      start();
    }
  }

  /* ------------------------------------------------------------------
   * 8. Avvio
   * ------------------------------------------------------------------ */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  applyLang(lang);

  /* Primo render del terminale quando entra in vista.
     Se Motion non c'è (o il terminale è già visibile), parte comunque. */
  const termVisible = terminalBody && terminalBody.getBoundingClientRect().top < window.innerHeight;
  if (termVisible) typeTerminal();

  /* Il selettore lingua */
  $("#lang-toggle")?.addEventListener("click", () => {
    applyLang(lang === "it" ? "en" : "it");
  });
})();
