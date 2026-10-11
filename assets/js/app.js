/* ==========================================================================
   Marco Valle — portfolio
   app.js — i18n IT/EN, console statica, navigazione e lo "scope" dell'hero:
   tracce ADS-B disegnate una sola volta all'avvio. Degrada con grazia.
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
          "Gestionale ERP in produzione con Django e PostgreSQL, Transformer in PyTorch per le traiettorie aeree su 65 milioni di record ADS-B, firmware ESP32 per sensori. Python, Django, PyTorch, Docker, Linux.",
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
        "Costruisco gestionali in Python e Django: quello di Aquaforma S.r.l. è in produzione da mesi. Fuori dall'orario di lavoro addestro modelli che prevedono dove andranno gli aerei.",
      "hero.cta.projects": "Vedi i progetti",
      "hero.cta.cv": "Scarica il CV",
      "hero.spec.r1.label": "Gestionale aziendale",
      "hero.spec.r1.value": "in produzione",
      "hero.spec.r1.where": "Aquaforma S.r.l.",
      "hero.spec.r2.label": "Record ADS-B elaborati",
      "hero.spec.r2.value": "65 milioni",
      "hero.spec.r3.label": "Errore medio di previsione",
      "hero.spec.r3.value": "582 m, −30%",
      "hero.spec.r4.label": "Test automatici",
      "hero.spec.r4.value": "480+",
      "hero.spec.r4.where": "CI a ogni push",
      "about.title": "Chi sono",
      "about.p1":
        "Mi sono laureato in Informatica all'Università di Milano-Bicocca nel 2025, con 99/110, discutendo una tesi sui modelli Transformer per la previsione delle traiettorie aeree. Prima della laurea ho passato un semestre Erasmus a Łódź, in Polonia.",
      "about.p2":
        "In Aquaforma S.r.l., a Treviolo, gestisco l'IT aziendale e sviluppo il gestionale che oggi è il sistema di gestione principale: anagrafiche, preventivi, ordini, magazzino, DDT e fatturazione elettronica verso lo SDI. È in produzione su un VPS Linux con Docker, e 480 test automatici girano a ogni push.",
      "about.p3":
        "Il resto lo faccio fuori dall'orario di lavoro: 65 milioni di record ADS-B per insegnare a un modello dove andranno gli aerei, un firmware ESP32 che misura la chimica dell'acqua della piscina, un'app Android che comanda i relè. Mi interessano i problemi concreti, quelli che finiscono in produzione.",
      "about.facts.seat": "Sede",
      "about.facts.seat.v": "Bergamo, Lombardia",
      "about.facts.lang": "Lingue",
      "about.facts.lang.v": "Italiano nativo, inglese B2",
      "about.facts.edu": "Formazione",
      "about.facts.edu.v": "Laurea in Informatica, 99/110",
      "about.facts.vol": "Volontariato",
      "about.facts.vol.v": "Educatore scout dal 2019",
      "console.title": "sessione locale",
      "skills.title": "Competenze",
      "skills.intro": "Gli strumenti con cui lavoro ogni giorno, in produzione o su questi progetti.",
      "skills.r1.area": "Back-end e web",
      "skills.r1.list": "Python, Django, PostgreSQL, SQLite, HTML, CSS",
      "skills.r2.area": "Dati e machine learning",
      "skills.r2.list": "PyTorch, NumPy, pandas, Matplotlib",
      "skills.r3.area": "DevOps",
      "skills.r3.list": "Docker e Docker Compose, Gunicorn, Caddy, Linux, Git, GitHub Actions",
      "skills.r4.area": "Embedded e mobile",
      "skills.r4.list": "ESP32 e Arduino (C/C++), I2C, ADC a 16 bit, Bluetooth, Kotlin, Android, Gradle",
      "skills.r5.area": "Gestionale e integrazione",
      "skills.r5.list": "Odoo (ERP/CRM), XML FatturaPA nel formato FPR12, PEC, server MCP",
      "projects.title": "Progetti",
      "projects.intro":
        "Tre cose vere: un gestionale in produzione, un modello che è nato come tesi, un impianto che gestisce l'acqua di una piscina.",
      "projects.erp.title": "Gestionale aziendale",
      "projects.erp.meta": "Aquaforma S.r.l., Treviolo. In produzione dal 2026.",
      "projects.erp.p1":
        "Anagrafiche, catalogo, preventivi, ordini, magazzino, rifornimento fornitori, DDT e fatture: è il sistema con cui Aquaforma lavora tutti i giorni.",
      "projects.erp.p2":
        "La fatturazione elettronica genera l'XML FatturaPA nel formato FPR12 e lo trasmette allo SDI via PEC. Il deploy è su un VPS Linux con Docker Compose, 480 test automatici girano in CI a ogni push, e un server MCP in sola lettura espone i dati agli assistenti AI.",
      "projects.flight.meta": "Progetto personale, 2025–2026. Nato dalla tesi di laurea.",
      "projects.flight.p1":
        "Un Transformer in PyTorch prevede la posizione di un aereo da 10 a 120 secondi nel futuro. È addestrato su 65 milioni di record ADS-B passati attraverso una pipeline completa: pulizia, segmentazione, ricampionamento e finestre scorrevoli.",
      "projects.flight.p2":
        "L'errore medio di previsione (ADE) è di 582 metri contro gli 833 della migliore baseline cinematica: il 30% in meno, grazie al residual learning. E la previsione batte anche una reimplementazione del paper FlightBERT, del 75–90% su tutti gli orizzonti.",
      "projects.iot.title": "Domotica e monitoraggio piscina",
      "projects.iot.meta": "Progetto continuo. Codice su richiesta.",
      "projects.iot.p1":
        "Firmware ESP32 in C++ che comanda i relè dell'impianto e legge le sonde della chimica dell'acqua: pH, cloro, acido cianurico e salinità, su un ADC a 16 bit collegato via I2C.",
      "projects.iot.p2":
        "Un'app Android in Kotlin dialoga con il modulo via Bluetooth, e l'impianto è integrato con Home Assistant per la gestione di tutti i giorni.",
      "art.erp.caption": "Fattura elettronica, XML FatturaPA (FPR12)",
      "art.erp.stamp": "trasmessa allo SDI",
      "art.flight.caption": "Una traccia reale e una previsione a 120 secondi.",
      "art.flight.pred": "previsione +120 s",
      "art.flight.err": "errore 582 m",
      "art.flight.err.note": "(media dei test)",
      "art.flight.legend.real": "traccia reale",
      "art.flight.legend.pred": "previsione",
      "art.flight.legend.cone": "incertezza",
      "art.flight.chart.base": "baseline cinematica, 833 m",
      "art.flight.note": "Curve illustrative. 833 m e 582 m sono le medie misurate nei test, da 10 a 120 secondi.",
      "art.flight.pred120": "+120 s",
      "art.flight.canvas.err": "errore 582 m",
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
      "contact.lead": "Se hai una posizione aperta o un progetto su cui lavorare, scrivimi. Rispondo a tutti.",
      "contact.cv.it": "CV in italiano",
      "contact.cv.en": "CV in inglese",
      "footer.built": "HTML, CSS e JavaScript scritti a mano. Animazioni con Motion, scroll con Lenis.",
      "footer.source": "codice sorgente",
    },

    en: {
      meta: {
        title: "Marco Valle, back-end developer and data analyst",
        description:
          "ERP system in production with Django and PostgreSQL, a PyTorch Transformer predicting aircraft trajectories from 65 million ADS-B records, ESP32 sensor firmware. Python, Django, PyTorch, Docker, Linux.",
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
        "I build management systems in Python and Django: the one running at Aquaforma S.r.l. is in production. Off the clock I train models that predict where aircraft will be.",
      "hero.cta.projects": "See the projects",
      "hero.cta.cv": "Download the CV",
      "hero.spec.r1.label": "Business management system",
      "hero.spec.r1.value": "in production",
      "hero.spec.r1.where": "Aquaforma S.r.l.",
      "hero.spec.r2.label": "ADS-B records processed",
      "hero.spec.r2.value": "65 million",
      "hero.spec.r3.label": "Average prediction error",
      "hero.spec.r3.value": "582 m, −30%",
      "hero.spec.r4.label": "Automated tests",
      "hero.spec.r4.value": "480+",
      "hero.spec.r4.where": "CI on every push",
      "about.title": "About me",
      "about.p1":
        "I graduated in Computer Science at the University of Milano-Bicocca in 2025, with 99/110, defending a thesis on Transformer models for aircraft trajectory prediction. Before graduating I spent one Erasmus semester in Łódź, Poland.",
      "about.p2":
        "At Aquaforma S.r.l., in Treviolo, I run the company IT and develop the management system that is now the core of the business: contacts, quotes, orders, inventory, delivery notes and Italian e-invoicing towards SDI. It runs in production on a Linux VPS with Docker, and 480 automated tests run on every push.",
      "about.p3":
        "The rest happens off the clock: 65 million ADS-B records to teach a model where aircraft will be, ESP32 firmware that measures pool water chemistry, an Android app driving the relays. I care about concrete problems, the ones that end up in production.",
      "about.facts.seat": "Based in",
      "about.facts.seat.v": "Bergamo, Lombardy",
      "about.facts.lang": "Languages",
      "about.facts.lang.v": "Italian (native), English B2",
      "about.facts.edu": "Education",
      "about.facts.edu.v": "BSc in Computer Science, 99/110",
      "about.facts.vol": "Volunteering",
      "about.facts.vol.v": "Scout educator since 2019",
      "console.title": "local session",
      "skills.title": "Skills",
      "skills.intro": "The tools I work with every day, in production or on the projects below.",
      "skills.r1.area": "Back-end and web",
      "skills.r1.list": "Python, Django, PostgreSQL, SQLite, HTML, CSS",
      "skills.r2.area": "Data and machine learning",
      "skills.r2.list": "PyTorch, NumPy, pandas, Matplotlib",
      "skills.r3.area": "DevOps",
      "skills.r3.list": "Docker and Docker Compose, Gunicorn, Caddy, Linux, Git, GitHub Actions",
      "skills.r4.area": "Embedded and mobile",
      "skills.r4.list": "ESP32 and Arduino (C/C++), I2C, 16-bit ADC, Bluetooth, Kotlin, Android, Gradle",
      "skills.r5.area": "Business systems and integration",
      "skills.r5.list": "Odoo (ERP/CRM), FatturaPA XML, FPR12 format, PEC, MCP server",
      "projects.title": "Projects",
      "projects.intro":
        "Three real things: a system in production, a model that started as a thesis, a plant that manages a swimming pool's water.",
      "projects.erp.title": "Business management system",
      "projects.erp.meta": "Aquaforma S.r.l., Treviolo. In production since 2026.",
      "projects.erp.p1":
        "Contacts, catalogue, quotes, orders, inventory, supplier replenishment, delivery notes and invoices: it is the system Aquaforma works with every day.",
      "projects.erp.p2":
        "The e-invoicing module generates FatturaPA XML in the FPR12 format and transmits it to SDI over PEC. It is deployed on a Linux VPS with Docker Compose, 480 automated tests run in CI on every push, and a read-only MCP server exposes the data to AI assistants.",
      "projects.flight.meta": "Personal project, 2025–2026. Born from my BSc thesis.",
      "projects.flight.p1":
        "A PyTorch Transformer predicts where an aircraft will be from 10 to 120 seconds ahead. It is trained on 65 million ADS-B records through a full pipeline: cleaning, segmentation, resampling and sliding windows.",
      "projects.flight.p2":
        "The average prediction error (ADE) is 582 metres against 833 for the best kinematic baseline: 30% lower, thanks to residual learning. It also outperforms a reimplementation of the FlightBERT paper by 75–90% at all horizons.",
      "projects.iot.title": "Home automation and pool monitoring",
      "projects.iot.meta": "Ongoing project. Code available on request.",
      "projects.iot.p1":
        "ESP32 firmware in C++ that drives the plant relays and reads the water chemistry probes: pH, chlorine, cyanuric acid and salinity, on a 16-bit ADC over I2C.",
      "projects.iot.p2":
        "A Kotlin Android app talks to the module over Bluetooth, and the plant is integrated with Home Assistant for everyday use.",
      "art.erp.caption": "E-invoice, FatturaPA XML (FPR12)",
      "art.erp.stamp": "sent to SDI",
      "art.flight.caption": "A real track and a 120-second prediction.",
      "art.flight.pred": "prediction +120 s",
      "art.flight.err": "error 582 m",
      "art.flight.err.note": "(test average)",
      "art.flight.legend.real": "real track",
      "art.flight.legend.pred": "prediction",
      "art.flight.legend.cone": "uncertainty",
      "art.flight.chart.base": "kinematic baseline, 833 m",
      "art.flight.note": "Illustrative curves. 833 m and 582 m are the averages measured in testing, from 10 to 120 seconds.",
      "art.flight.pred120": "+120 s",
      "art.flight.canvas.err": "error 582 m",
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
      "contact.lead": "If you have an open role or a project to work on, write me. I answer everyone.",
      "contact.cv.it": "CV in Italian",
      "contact.cv.en": "CV in English",
      "footer.built": "HTML, CSS and JavaScript, written by hand. Motion for animation, Lenis for scrolling.",
      "footer.source": "source code",
    },
  };

  /* Console: output mostrato in modo statico, per lingua */
  const CONSOLE = {
    it: [
      { cmd: "python manage.py test", out: [{ t: "Ran 480 tests in 32.4s" }, { t: "OK", ok: true }] },
      { cmd: "docker compose up -d", out: [{ t: "gunicorn, caddy, postgres, worker: avviati" }] },
      {
        cmd: "python train.py --records 65M --encoder transformer",
        out: [{ t: "epoca 42/42, ADE 582 m (−30% vs baseline)" }],
      },
    ],
    en: [
      { cmd: "python manage.py test", out: [{ t: "Ran 480 tests in 32.4s" }, { t: "OK", ok: true }] },
      { cmd: "docker compose up -d", out: [{ t: "gunicorn, caddy, postgres, worker: up" }] },
      {
        cmd: "python train.py --records 65M --encoder transformer",
        out: [{ t: "epoch 42/42, ADE 582 m (−30% vs baseline)" }],
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
    /* Allinea Lenis alla posizione reale della pagina (es. reload a metà
       pagina): evita che le due "scroll" si contendano la posizione. */
    const syncLenis = () => {
      try {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      } catch (_) {
        /* niente: Lenis non accetta l'opzione in questa versione */
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
   *    (testo che entra come un blocco unico + scope che si disegna)
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
   * 5. Lo scope: tracce ADS-B disegnate una volta, poi immobili.
   *    Coordinate di progetto (1200×760) ancorate al bordo destro,
   *    così il testo dell'hero resta sempre libero a sinistra.
   * ------------------------------------------------------------------ */
  const canvas = $("#scope");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const PAPER = "239, 230, 212";
    const BRASS = "233, 161, 59";
    const SIGNAL = "220, 100, 64";

    const tracks = [
      /* [punti], alpha, larghezza, inizio, durata */
      { pts: [[640, 110], [790, 140], [930, 190], [1080, 262]], a: 0.3, w: 1.5, t0: 500, dt: 700 },
      { pts: [[1180, 70], [1080, 160], [980, 250], [910, 318]], a: 0.26, w: 1.5, t0: 700, dt: 700 },
      { pts: [[660, 700], [810, 688], [960, 662], [1130, 640]], a: 0.28, w: 1.5, t0: 900, dt: 750 },
      { pts: [[140, 70], [330, 100], [520, 128]], a: 0.22, w: 1.5, t0: 1050, dt: 650 },
    ];
    const hero = {
      past: [[660, 620], [740, 545], [815, 465], [895, 385]],
      pred: { p0: [895, 385], c: [1010, 300], p1: [1120, 205] },
      actual: { p0: [895, 385], c: [1005, 318], p1: [1082, 248] },
      cone: [[895, 385], [1120, 180], [1120, 232]],
      error: { a: [1120, 205], b: [1082, 248] },
      label: "MV582  FL340  458 kt",
      labelEnd: [878, 352],
    };
    const bottomLabel = { text: "FB218  118 kt", pos: [700, 660], t0: 1900 };
    const END = 3400;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let rafId = null;
    let started = false;
    let done = false;
    let lastT = 0;

    const ease = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
    const prog = (t, start, dur) => ease((t - start) / dur);

    let view = { s: 1, ox: 0, oy: 0 };

    function computeView() {
      const designW = W < 720 ? 700 : 1200;
      const s = Math.min(W / designW, H / 760);
      return { s, ox: W - 1200 * s, oy: (H - 760 * s) / 2 };
    }

    const tx = (x) => view.ox + x * view.s;
    const ty = (y) => view.oy + y * view.s;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      view = computeView();
      draw(done || reduced ? END : lastT);
    }

    function drawPoly(pts, p, color, width, dash) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      const total = pts.length - 1;
      const upto = p * total;
      for (let i = 0; i < pts.length - 1; i++) {
        const segEnd = Math.min(Math.max(upto - i, 0), 1);
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        const x2 = x0 + (x1 - x0) * segEnd;
        const y2 = y0 + (y1 - y0) * segEnd;
        if (i === 0) ctx.moveTo(tx(x0), ty(y0));
        ctx.lineTo(tx(x2), ty(y2));
        if (segEnd < 1) break;
      }
      ctx.stroke();
      ctx.restore();
    }

    const quadPoints = (q, n = 32) =>
      Array.from({ length: n + 1 }, (_, i) => {
        const t = i / n;
        const u = 1 - t;
        return [
          u * u * q.p0[0] + 2 * u * t * q.c[0] + t * t * q.p1[0],
          u * u * q.p0[1] + 2 * u * t * q.c[1] + t * t * q.p1[1],
        ];
      });

    function text(str, x, y, color, size, align = "start") {
      ctx.save();
      ctx.font = `600 ${size}px "JetBrains Mono", monospace`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(str, tx(x), ty(y));
      ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const s = view.s;
      if (s <= 0) return;

      /* graticule: piccole croci su tutta l'area */
      const g = prog(t, 0, 350);
      if (g > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(${PAPER}, ${0.12 * g})`;
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

      /* tracce secondarie + punti */
      tracks.forEach((tr) => {
        const p = prog(t, tr.t0, tr.dt);
        if (p <= 0) return;
        drawPoly(tr.pts, p, `rgba(${PAPER}, ${tr.a})`, tr.w * Math.max(s, 0.8));
        if (p >= 1) {
          const [lx, ly] = tr.pts[tr.pts.length - 1];
          ctx.beginPath();
          ctx.arc(tx(lx), ty(ly), 2.4 * Math.max(s, 0.8), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${PAPER}, ${tr.a + 0.12})`;
          ctx.fill();
        }
      });

      /* traccia evidenziata: passato */
      const php = prog(t, 1450, 700);
      if (php > 0) {
        drawPoly(hero.past, php, `rgba(${PAPER}, 0.95)`, 2 * Math.max(s, 0.8));
        if (php >= 1) {
          ctx.beginPath();
          ctx.arc(tx(895), ty(385), 4 * Math.max(s, 0.8), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${PAPER}, 0.95)`;
          ctx.fill();
        }
      }

      /* cono di incertezza */
      const cp = prog(t, 2050, 500);
      if (cp > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tx(hero.cone[0][0]), ty(hero.cone[0][1]));
        ctx.lineTo(tx(hero.cone[1][0]), ty(hero.cone[1][1]));
        ctx.lineTo(tx(hero.cone[2][0]), ty(hero.cone[2][1]));
        ctx.closePath();
        ctx.fillStyle = `rgba(${BRASS}, ${0.09 * cp})`;
        ctx.fill();
        ctx.restore();
      }

      /* previsione */
      const pp = prog(t, 2200, 650);
      if (pp > 0) {
        drawPoly(quadPoints(hero.pred), pp, `rgba(${BRASS}, 0.95)`, 2 * Math.max(s, 0.8), [6, 6]);
      }

      /* traccia reale oltre il punto */
      const ap = prog(t, 2750, 500);
      if (ap > 0) {
        drawPoly(quadPoints(hero.actual), ap, `rgba(${SIGNAL}, 0.9)`, 1.6 * Math.max(s, 0.8));
      }

      /* scostamento */
      const ep = prog(t, 3100, 350);
      if (ep > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(${SIGNAL}, ${0.7 * ep})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx(hero.error.a[0]), ty(hero.error.a[1]));
        ctx.lineTo(tx(hero.error.b[0]), ty(hero.error.b[1]));
        ctx.stroke();
        ctx.restore();
      }

      /* etichette */
      if (W >= 620) {
        const lp = prog(t, 1900, 450);
        if (lp > 0) {
          const size = Math.max(10, Math.round(12 * s));
          text(hero.label, hero.labelEnd[0], hero.labelEnd[1], `rgba(${PAPER}, ${0.85 * lp})`, size, "end");
          if (bottomLabel.t0 <= t) {
            const bp = prog(t, bottomLabel.t0, 450);
            text(bottomLabel.text, bottomLabel.pos[0], bottomLabel.pos[1], `rgba(${PAPER}, ${0.7 * bp})`, size);
          }
          if (ep > 0.6) {
            text(I18N[lang]["art.flight.pred120"], 1120, 168, `rgba(${BRASS}, ${0.9 * ep})`, size, "end");
            text(I18N[lang]["art.flight.canvas.err"], 1074, 268, `rgba(${SIGNAL}, ${0.9 * ep})`, size, "end");
          }
        }
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
