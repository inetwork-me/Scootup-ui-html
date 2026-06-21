/* ============================================================
   Scoot Up — interaction + animation layer (vanilla JS)
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

  /* ---------- THEME SWITCH ---------- */
  const THEMES = ["light", "dark", "forest"];
  const root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("su-theme", t); } catch (e) {}
    document.querySelectorAll("[data-theme-dot]").forEach((d) => {
      d.setAttribute("aria-pressed", d.dataset.themeDot === t ? "true" : "false");
    });
  }
  let saved = "light";
  try { saved = localStorage.getItem("su-theme") || "light"; } catch (e) {}
  setTheme(THEMES.includes(saved) ? saved : "light");
  document.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-theme-dot]");
    if (dot) setTheme(dot.dataset.themeDot);
  });

  /* ---------- TEXT SPLIT (Framer-style word rise) ---------- */
  function readStructured(el) {
    // walk child nodes so editor-injected attributes never leak into words;
    // <br> becomes a newline marker, everything else contributes plain text
    let out = "";
    el.childNodes.forEach((n) => {
      if (n.nodeType === 3) out += n.textContent;
      else if (n.tagName === "BR") out += "\n";
      else out += n.textContent;
    });
    return out;
  }
  function splitText(el) {
    if (el.dataset.split === "done") return;
    const base = parseFloat(el.dataset.revealDelay || "0") || 0;
    const lines = readStructured(el).split("\n");
    el.innerHTML = "";
    let idx = 0;
    lines.forEach((line) => {
      const lineEl = document.createElement("span");
      lineEl.className = "rv-line";
      const words = line.replace(/\s+/g, " ").trim().split(" ");
      words.forEach((w) => {
        if (!w) return;
        const wrap = document.createElement("span");
        wrap.className = "rv-w";
        const inner = document.createElement("span");
        inner.className = "rv-wi";
        inner.textContent = w;
        inner.style.transitionDelay = (base + idx * 0.05).toFixed(2) + "s";
        idx++;
        wrap.appendChild(inner);
        lineEl.appendChild(wrap);
        lineEl.appendChild(document.createTextNode(" "));
      });
      el.appendChild(lineEl);
    });
    el.dataset.split = "done";
  }
  document.querySelectorAll("[data-reveal='words']").forEach(splitText);

  /* ---------- follow-cursor pill helper ---------- */
  function attachCursorPill(target, label, filter) {
    const cur = document.createElement("div");
    cur.className = "cursor-cta";
    cur.setAttribute("aria-hidden", "true");
    const uid = "curp" + Math.random().toString(36).slice(2, 7);
    const rim = (label.toUpperCase() + " \u2022 ").repeat(2);
    cur.innerHTML =
      '<span class="cursor-cta-in">' +
        '<svg class="cur-ring" viewBox="0 0 100 100">' +
          '<defs><path id="' + uid + '" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"></path></defs>' +
          '<text><textPath href="#' + uid + '" textLength="238" lengthAdjust="spacingAndGlyphs">' + rim + '</textPath></text>' +
        '</svg>' +
        '<svg class="cur-arrow" aria-hidden="true"><use href="#i-arrow-tr"></use></svg>' +
      '</span>';
    document.body.appendChild(cur);
    let cx = 0, cy = 0, mx = 0, my = 0, raf = false;
    const tick = () => {
      cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      if (Math.abs(mx - cx) > 0.3 || Math.abs(my - cy) > 0.3) requestAnimationFrame(tick);
      else raf = false;
    };
    const update = (e) => {
      if (!filter || filter(e)) cur.classList.add("on");
      else cur.classList.remove("on");
    };
    target.addEventListener("mouseenter", (e) => {
      mx = cx = e.clientX; my = cy = e.clientY;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      update(e);
    });
    target.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      update(e);
      if (!raf) { raf = true; requestAnimationFrame(tick); }
    });
    target.addEventListener("mouseleave", () => cur.classList.remove("on"));
  }

  /* ---------- HERO ROTATING WORD ---------- */
  const rotHost = document.querySelector("[data-rotator-host]");
  if (rotHost) {
    const words = (rotHost.getAttribute("data-rotator-words") || "").split("|").map((s) => s.trim()).filter(Boolean);
    const seed = rotHost.getAttribute("data-rotator-seed") || words[0];
    let host = null;
    rotHost.querySelectorAll(".rv-wi").forEach((wi) => { if (!host && wi.textContent.trim() === seed) host = wi; });
    if (host && words.length > 1) {
      host.classList.add("rot-host");
      host.textContent = "";
      const stack = document.createElement("span");
      stack.className = "rot-stack";
      words.concat(words[0]).forEach((w) => {
        const s = document.createElement("span");
        s.className = "rot-word";
        s.textContent = w;
        stack.appendChild(s);
      });
      host.appendChild(stack);

      /* --- custom CTA cursor over the rotating word --- */
      host.classList.add("rot-cta");
      attachCursorPill(host, "Let\u2019s start yours");
      host.addEventListener("click", () => {
        window.location.href = "contact.html";
      });

      const sizeHost = () => {
        const h = stack.firstChild.getBoundingClientRect().height;
        if (h) host.style.height = h + "px";
        return h;
      };
      sizeHost();
      window.addEventListener("resize", sizeHost);
      if (!reduce) {
        let i = 0;
        const advance = () => {
          const pitch = stack.firstChild.getBoundingClientRect().height;
          i++;
          stack.style.transition = "transform .6s cubic-bezier(.76,0,.24,1)";
          stack.style.transform = "translateY(" + (-i * pitch) + "px)";
          if (i === words.length) {
            setTimeout(() => {
              stack.style.transition = "none";
              i = 0;
              stack.style.transform = "translateY(0px)";
            }, 620);
          }
        };
        setTimeout(() => { sizeHost(); setInterval(advance, 2200); }, 1800);
      }
    }
  }

  /* ---------- SCROLL REVEALS (rect-based, robust) ---------- */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if (reduce) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    let pending = revealEls.slice();
    const checkReveal = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < vh * 0.92) { el.classList.add("is-in"); return false; }
        return true;
      });
      if (!pending.length) window.removeEventListener("scroll", checkReveal);
    };
    window.addEventListener("scroll", checkReveal, { passive: true });
    window.addEventListener("resize", checkReveal, { passive: true });
    requestAnimationFrame(checkReveal);
    window.addEventListener("load", () => requestAnimationFrame(checkReveal));
    // safety net: never leave content hidden
    setTimeout(() => revealEls.forEach((el) => el.classList.add("is-in")), 2600);
  }

  /* ---------- HERO STAT COUNT-UP ---------- */
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  if (counters.length && !reduce) {
    counters.forEach((el) => { el.textContent = (0).toFixed(parseInt(el.dataset.dec || "0", 10)); });
    setTimeout(() => {
      counters.forEach((el, k) => {
        const end = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.dec || "0", 10);
        const dur = 1200;
        const t0 = performance.now() + k * 70;
        const step = (now) => {
          const p = Math.min(1, Math.max(0, (now - t0) / dur));
          const e = 1 - Math.pow(1 - p, 4); // ease-out quart
          el.textContent = (end * e).toFixed(dec);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, 1350);
  }

  /* ---------- STICKY NAV STATE ---------- */
  const nav = document.querySelector("[data-nav]");
  if (nav) {
    const onScroll = () => nav.classList.toggle("nav-solid", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      const strength = 0.32;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- 3D FLIP CTA BUTTONS ---------- */
  /* wrap each CTA's label in a duplicated face stack that rolls on hover */
  if (!reduce) {
    document.querySelectorAll("[data-flip]").forEach((btn) => {
      if (btn.dataset.flipReady) return;
      const faceA = document.createElement("span");
      faceA.className = "flip-face flip-face--a";
      while (btn.firstChild) faceA.appendChild(btn.firstChild);
      const faceB = faceA.cloneNode(true);
      faceB.className = "flip-face flip-face--b";
      faceB.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.className = "flip-3d";
      inner.appendChild(faceA);
      inner.appendChild(faceB);
      btn.appendChild(inner);
      btn.classList.add("flip-btn");
      btn.dataset.flipReady = "1";
    });
  }

  /* ---------- SHOWCASE CAROUSEL (revolving-door orbit) ---------- */
  const stage = document.querySelector("[data-carousel]");
  if (stage) {
    const slides = Array.from(stage.querySelectorAll("[data-car-slide]"));
    const n = slides.length;
    let cardW = 0;
    const measure = () => { cardW = slides[0].offsetWidth || 1; };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    let pos = 0, targetPos = 0, spinning = false;
    /* each card sits on a circular orbit: front = big & centered,
       sides peek out, back passes behind the center card — opacity never changes */
    const render = (t) => {
      const frontIdx = ((Math.round(t) % n) + n) % n;
      slides.forEach((s, i) => {
        const th = ((i - t) / n) * Math.PI * 2;
        const f = (Math.cos(th) + 1) / 2;                 // 1 = front, 0 = back
        const x = Math.sin(th) * cardW * (0.45 + 0.6 * f); // orbit narrows toward the back
        const sc = 0.6 + 0.4 * f;                          // recedes = smaller
        s.style.transform = `translate(calc(-50% + ${x}px), -50%) scale(${sc})`;
        s.style.zIndex = String(Math.round(1 + f * 100));  // back cards hide behind front
        s.classList.toggle("is-front", i === frontIdx);
      });
    };
    render(0);
    const tick = () => {
      pos += (targetPos - pos) * 0.07;
      if (Math.abs(targetPos - pos) < 0.002) { pos = targetPos; spinning = false; }
      render(pos);
      if (spinning) requestAnimationFrame(tick);
    };
    const spinTo = (t) => {
      targetPos = t;
      if (!spinning) { spinning = true; requestAnimationFrame(tick); }
    };
    if (!reduce) setInterval(() => spinTo(targetPos + 1), 2400);
    slides.forEach((s, i) => s.addEventListener("click", () => {
      let d = (i - targetPos) % n;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      if (Math.abs(d) > 0.01) spinTo(targetPos + d);
    }));
    attachCursorPill(stage, "View Project", (e) => !!e.target.closest(".car-card.is-front"));
    stage.addEventListener("click", (e) => {
      if (e.target.closest(".car-card.is-front")) {
        window.location.href = "work-project.html";
      }
    });
  }

  /* ---------- DROPDOWN MENU ---------- */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (menuToggle && menu) {
    const links = Array.from(menu.querySelectorAll(".menu-link"));
    const pill = menu.querySelector(".su-menu-pill");
    let activeIdx = links.findIndex((l) => l.hasAttribute("data-active"));
    const placePill = (i) => {
      if (i < 0) {
        links.forEach((x) => x.classList.remove("on"));
        if (pill) pill.style.height = "0";
        return;
      }
      const l = links[i];
      if (!l || !pill) return;
      pill.style.height = l.offsetHeight + "px";
      pill.style.transform = "translateY(" + l.offsetTop + "px)";
      links.forEach((x, j) => x.classList.toggle("on", j === i));
    };
    const openMenu = () => {
      menu.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close menu");
      // place pill instantly (no grow-from-zero flash), then restore transition for hover
      if (pill) pill.style.transition = "none";
      placePill(activeIdx);
      requestAnimationFrame(() => { if (pill) pill.style.transition = ""; });
    };
    const closeMenu = () => {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    };
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });
    links.forEach((l, i) => l.addEventListener("mouseenter", () => placePill(i)));
    const list = menu.querySelector(".su-menu-list");
    if (list) list.addEventListener("mouseleave", () => placePill(activeIdx));
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        const idx = links.indexOf(a);
        if (idx > -1) activeIdx = idx;
        closeMenu();
      });
    });
    // close on outside click / Escape
    document.addEventListener("mousedown", (e) => {
      if (!menu.classList.contains("open")) return;
      if (e.target.closest("[data-menu]") || e.target.closest("[data-menu-toggle]")) return;
      closeMenu();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", () => { if (menu.classList.contains("open")) placePill(activeIdx); });
  }

  /* ---------- SMOOTH ANCHOR NAV ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
    });
  });

  /* ---------- year ---------- */
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* ============================================================
     PAGE-SPECIFIC HANDLERS (consolidated from per-page mockups)
     Each block queries its own targets and bails when absent,
     so it is a safe no-op on pages that don't use it.
     ============================================================ */

  /* ---------- SERVICES CTA CARD ARROW (index #services) ---------- */
  const svcCtaCard = document.getElementById("svc-cta-card");
  const svcCtaArrow = document.getElementById("svc-cta-arrow");
  if (svcCtaCard && svcCtaArrow) {
    svcCtaCard.addEventListener("mouseenter", () => {
      svcCtaArrow.style.transform = "rotate(-45deg) scale(1.15)";
    });
    svcCtaCard.addEventListener("mouseleave", () => {
      svcCtaArrow.style.transform = "rotate(0deg) scale(1)";
    });
  }

  /* ---------- SERVICES ACCORDION + STAT SWAP (index #services) ---------- */
  const svcTabs = Array.from(document.querySelectorAll(".svc-tab"));
  if (svcTabs.length) {
    const SVC_DATA = [
      { sv: "4.9★", sl: "Avg. Client Rating", sv2: "38+", sl2: "Projects Delivered", bar: "55%" },
      { sv: "4.8★", sl: "Avg. Client Rating", sv2: "52+", sl2: "Projects Delivered", bar: "72%" },
      { sv: "5.0★", sl: "Avg. Client Rating", sv2: "24+", sl2: "Brands Built", bar: "88%" },
      { sv: "4.9★", sl: "Avg. Client Rating", sv2: "200+", sl2: "Reels Produced", bar: "95%" },
      { sv: "4.7★", sl: "Avg. Client Rating", sv2: "4.2x", sl2: "Avg. ROAS Achieved", bar: "78%" },
      { sv: "4.9★", sl: "Avg. Client Rating", sv2: "41+", sl2: "Sites & Apps Shipped", bar: "65%" },
    ];
    const svcImgs = Array.from(document.querySelectorAll("[data-svc-img]"));
    const svcSv = document.getElementById("svc-sv");
    const svcSl = document.getElementById("svc-sl");
    const svcSv2 = document.getElementById("svc-sv2");
    const svcSl2 = document.getElementById("svc-sl2");
    const svcBar = document.getElementById("svc-accent-bar");
    let svcCur = 0;
    const svcSwap = (el, txt) => {
      if (!el) return;
      el.style.transition = "opacity .15s ease, transform .15s ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(7px)";
      setTimeout(() => {
        el.textContent = txt;
        el.style.transition = "opacity .42s cubic-bezier(.22,1,.36,1), transform .42s cubic-bezier(.22,1,.36,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 160);
    };
    const svcActivate = (i) => {
      if (i === svcCur || !SVC_DATA[i]) return;
      if (svcTabs[svcCur]) svcTabs[svcCur].classList.remove("is-open");
      if (svcImgs[svcCur]) svcImgs[svcCur].classList.remove("is-active");
      svcCur = i;
      if (svcTabs[svcCur]) svcTabs[svcCur].classList.add("is-open");
      if (svcImgs[svcCur]) svcImgs[svcCur].classList.add("is-active");
      const d = SVC_DATA[svcCur];
      svcSwap(svcSv, d.sv); svcSwap(svcSl, d.sl); svcSwap(svcSv2, d.sv2); svcSwap(svcSl2, d.sl2);
      if (svcBar) { svcBar.style.transition = "width .5s cubic-bezier(.22,1,.36,1)"; svcBar.style.width = d.bar; }
    };
    svcTabs.forEach((t, i) => {
      const hd = t.querySelector(".svc-tab-hd");
      if (hd) hd.addEventListener("click", () => svcActivate(i));
    });
    const svcGrid = document.querySelector(".svc-grid");
    if (svcGrid) {
      const svcResize = () => {
        svcGrid.style.gridTemplateColumns = window.innerWidth < 900 ? "1fr" : "1fr 1fr";
      };
      svcResize();
      window.addEventListener("resize", svcResize, { passive: true });
      /* entrance: slide columns in when section enters viewport */
      if (reduce) {
        svcGrid.classList.add("svc-loaded");
      } else {
        const svcSection = document.getElementById("services");
        let svcTriggered = false;
        const checkSvc = () => {
          if (svcTriggered || !svcSection) return;
          if (svcSection.getBoundingClientRect().top < window.innerHeight * 0.85) {
            svcTriggered = true;
            svcGrid.classList.add("svc-loaded");
            window.removeEventListener("scroll", checkSvc);
          }
        };
        window.addEventListener("scroll", checkSvc, { passive: true });
        window.addEventListener("load", () => requestAnimationFrame(checkSvc));
      }
    }
  }

  /* ---------- ABOUT SECTION REVEAL + PROCESS STEPS (index #about) ---------- */
  const aboutSection = document.getElementById("about");
  const aboutGrid = document.getElementById("about-grid");
  if (aboutSection && aboutGrid) {
    const aboutLabel = aboutSection.querySelector(".about-label");
    const aboutSteps = Array.from(aboutSection.querySelectorAll(".process-step, .process-line"));
    if (reduce) {
      if (aboutLabel) aboutLabel.classList.add("is-in");
      aboutSection.classList.add("about-section-loaded");
      aboutGrid.classList.add("about-loaded");
      aboutSteps.forEach((s) => s.classList.add("is-in"));
    } else {
      /* stagger: word-reveal inner spans get sequential delays */
      Array.from(aboutSection.querySelectorAll(".about-left .rv-wi")).forEach((wi, i) => {
        wi.style.transitionDelay = i * 0.05 + "s";
      });
      let aboutTriggered = false;
      const aboutTrigger = () => {
        if (aboutTriggered) return;
        if (aboutSection.getBoundingClientRect().top < window.innerHeight * 0.82) {
          aboutTriggered = true;
          if (aboutLabel) aboutLabel.classList.add("is-in");
          requestAnimationFrame(() => {
            aboutGrid.classList.add("about-loaded");
            aboutSection.classList.add("about-section-loaded");
          });
          window.removeEventListener("scroll", aboutTrigger);
        }
      };
      let aboutPending = aboutSteps.slice();
      const aboutCheckSteps = () => {
        const vh = window.innerHeight;
        aboutPending = aboutPending.filter((el) => {
          if (el.getBoundingClientRect().top < vh * 0.92) { el.classList.add("is-in"); return false; }
          return true;
        });
        if (!aboutPending.length) window.removeEventListener("scroll", aboutCheckSteps);
      };
      window.addEventListener("scroll", aboutTrigger, { passive: true });
      window.addEventListener("scroll", aboutCheckSteps, { passive: true });
      requestAnimationFrame(aboutTrigger);
      requestAnimationFrame(aboutCheckSteps);
    }
  }

  /* ---------- CTA PARALLAX COLUMNS (index/about — data-par-dir) ---------- */
  /* scroll-driven: columns move opposite directions tied to page scroll.
     Binds to every section that contains .cta-col so it works on any page. */
  if (!reduce) {
    document.querySelectorAll(".cta-col").forEach((col) => {
      if (col.dataset.parReady) return;
      col.dataset.parReady = "1";
    });
    const parSections = Array.from(document.querySelectorAll("section")).filter(
      (s) => s.querySelector(".cta-col")
    );
    parSections.forEach((section) => {
      const cols = Array.from(section.querySelectorAll(".cta-col"));
      if (!cols.length) return;
      const STRENGTH = 180;
      let ticking = false;
      const update = () => {
        ticking = false;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const sectionMid = rect.top + rect.height / 2;
        const raw = (vh / 2 - sectionMid) / (vh * 0.8);
        const progress = Math.min(1, Math.max(-1, raw));
        cols.forEach((col) => {
          const dir = parseFloat(col.dataset.parDir || "-1");
          col.style.transform = "translateY(" + dir * progress * STRENGTH + "px)";
        });
      };
      window.addEventListener("scroll", () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener("resize", update, { passive: true });
      update();
    });
  }

  /* ---------- HOMEPAGE PARTNER ROW INJECTION ---------- */
  const partnerRows = document.querySelectorAll("[data-partner-row]");
  if (partnerRows.length) {
    const partners = ["NORTHWIND", "LUMEN", "Pacer", "VERDE", "Halcyon", "ONSET", "Meridian", "Kindling", "VANTAGE", "Saffron", "Cobalt", "Atlas"];
    partnerRows.forEach((row) => {
      partners.forEach((p) => {
        const s = document.createElement("span");
        s.className = "partner-chip";
        s.textContent = p;
        row.appendChild(s);
      });
    });
  }

  /* ---------- REELS: DASHBOARD GRID REVEAL (reels) ---------- */
  const dbGrid = document.getElementById("db-grid");
  if (dbGrid) {
    const checkDb = () => {
      if (!dbGrid.classList.contains("db-loaded") &&
          dbGrid.getBoundingClientRect().top < window.innerHeight * 0.85) {
        dbGrid.classList.add("db-loaded");
        window.removeEventListener("scroll", checkDb);
      }
    };
    if (reduce) {
      dbGrid.classList.add("db-loaded");
    } else {
      window.addEventListener("scroll", checkDb, { passive: true });
      window.addEventListener("load", () => requestAnimationFrame(checkDb));
      requestAnimationFrame(checkDb);
    }
  }

  /* ---------- REELS: REEL SNAP SLIDER (reels) ---------- */
  (function () {
    const col = document.getElementById("rh-slider-col");
    const track = document.getElementById("rh-slider-track");
    if (!col || !track) return;

    /* clone all cards once for seamless infinite forward loop */
    const origCards = Array.from(track.querySelectorAll(".rh-card"));
    const N = origCards.length;
    if (!N) return;
    origCards.forEach((c) => track.appendChild(c.cloneNode(true)));
    const allCards = Array.from(track.querySelectorAll(".rh-card")); /* 2N */

    const GAP = 20;
    const AUTO_DELAY = 3000;
    const SNAP_MS = 820;
    const SNAP_EASE = "cubic-bezier(0.28,1,0.38,1)";

    let isHoriz = false;
    let cardSize = 0;
    let slotSize = 0;
    let currentIdx = 0;
    let currentPos = 0;
    let autoTimer = null;
    let snapping = false;

    let dragActive = false;
    let dragOrigin = 0;
    let dragBase = 0;
    let dragLast = 0;
    let dragLastT = 0;
    let dragVel = 0;

    const measure = () => {
      isHoriz = window.matchMedia("(max-width:960px)").matches;
      const c = allCards[0];
      if (!c) return false;
      const r = c.getBoundingClientRect();
      const cs = isHoriz ? r.width : r.height;
      if (cs < 10) return false;
      cardSize = cs;
      slotSize = cardSize + GAP;
      return true;
    };
    const posOf = (idx) => -(idx * slotSize);
    const applyTransform = (pos, animated) => {
      currentPos = pos;
      track.style.transition = animated ? "transform " + SNAP_MS + "ms " + SNAP_EASE : "none";
      track.style.transform = isHoriz ? "translateX(" + pos + "px)" : "translateY(" + pos + "px)";
    };
    const highlight = (idx) => {
      allCards.forEach((c) => c.classList.remove("is-center"));
      const i = ((idx % allCards.length) + allCards.length) % allCards.length;
      if (allCards[i]) allCards[i].classList.add("is-center");
    };
    const scheduleNext = () => {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => snapTo(currentIdx + 1, true), AUTO_DELAY);
    };
    function snapTo(idx, animated) {
      clearTimeout(autoTimer);
      snapping = animated;
      currentIdx = idx;
      applyTransform(posOf(idx), animated);
      highlight(idx);
      setTimeout(() => {
        snapping = false;
        if (currentIdx >= N) {
          currentIdx -= N;
          applyTransform(posOf(currentIdx), false);
          highlight(currentIdx);
        }
        scheduleNext();
      }, animated ? SNAP_MS + 60 : 0);
    }

    const getCoord = (e) => {
      const t = e.touches ? (e.touches[0] || e.changedTouches[0]) : e;
      return isHoriz ? t.clientX : t.clientY;
    };
    const onDown = (e) => {
      if (snapping) return;
      dragActive = true;
      dragOrigin = getCoord(e);
      dragBase = currentPos;
      dragLast = dragOrigin;
      dragLastT = performance.now();
      dragVel = 0;
      clearTimeout(autoTimer);
      track.style.transition = "none";
    };
    const onMove = (e) => {
      if (!dragActive) return;
      const c = getCoord(e);
      const now = performance.now();
      const dt = now - dragLastT;
      if (dt > 0) dragVel = (c - dragLast) / dt;
      dragLast = c;
      dragLastT = now;
      let pos = dragBase + (c - dragOrigin);
      const lo = posOf(N - 1), hi = posOf(0);
      if (pos > hi) pos = hi + (pos - hi) * 0.22;
      if (pos < lo) pos = lo + (pos - lo) * 0.22;
      currentPos = pos;
      track.style.transform = isHoriz ? "translateX(" + pos + "px)" : "translateY(" + pos + "px)";
      if (e.cancelable) e.preventDefault();
    };
    const onUp = () => {
      if (!dragActive) return;
      dragActive = false;
      const projected = currentPos + dragVel * 140;
      let idx = Math.round(-projected / slotSize);
      idx = Math.max(0, Math.min(N - 1, idx));
      snapTo(idx, true);
    };

    col.addEventListener("mousedown", onDown);
    col.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mousemove", onMove);
    col.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    col.addEventListener("touchend", onUp);
    col.addEventListener("mouseleave", () => { if (dragActive) onUp(); });
    window.addEventListener("resize", () => {
      if (measure()) applyTransform(posOf(currentIdx), false);
    }, { passive: true });

    const init = () => {
      if (!measure()) { setTimeout(init, 200); return; }
      applyTransform(posOf(0), false);
      highlight(0);
      scheduleNext();
    };
    requestAnimationFrame(() => requestAnimationFrame(init));
    setTimeout(() => { if (cardSize < 10) init(); }, 600);
  })();

  /* ---------- REELS: STICKY HORIZONTAL PROCESS TIMELINE (reels) ---------- */
  (function () {
    const outer = document.getElementById("proc-outer");
    const sticky = document.getElementById("proc-sticky");
    const track = document.getElementById("proc-track");
    const lineFill = document.getElementById("proc-line-fill");
    if (!outer || !track || !sticky) return;

    const cards = Array.from(track.querySelectorAll(".proc-card"));
    let totalScroll = 0;
    let startOffset = 0;

    const setup = () => {
      const viewW = sticky.clientWidth;
      const trackW = track.scrollWidth;
      const padL = parseFloat(getComputedStyle(track).paddingLeft) || viewW * 0.06;
      const cardEl = cards[0];
      const cardW = cardEl ? cardEl.offsetWidth : 290;
      const GAP = 24;
      const twoW = padL + cardW + GAP + cardW;
      startOffset = Math.max(0, viewW - twoW);
      const endX = -(Math.max(0, trackW - viewW));
      totalScroll = startOffset - endX;
      if (totalScroll < 10) totalScroll = window.innerHeight * 1.5;
      outer.style.height = window.innerHeight + totalScroll + "px";
    };
    let procTicking = false;
    const apply = () => {
      procTicking = false;
      if (!totalScroll) return;
      const rect = outer.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / totalScroll));
      const tx = startOffset - progress * totalScroll;
      track.style.transform = "translateX(" + tx + "px)";
      if (lineFill) lineFill.style.width = progress * 100 + "%";
      cards.forEach((card) => {
        const cr = card.getBoundingClientRect();
        card.classList.toggle("is-passed", cr.left < sticky.clientWidth * 0.55);
      });
    };
    const onScroll = () => {
      if (!procTicking) { procTicking = true; requestAnimationFrame(apply); }
    };
    setup();
    window.addEventListener("load", () => { setup(); apply(); });
    window.addEventListener("resize", () => { setup(); apply(); }, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
  })();

  /* ---------- TESTIMONIAL MARQUEE ROWS (reels + about) ---------- */
  (function () {
    const SPEED = 0.55; /* px per frame */
    const setupRow = (trackId, direction) => {
      const track = document.getElementById(trackId);
      if (!track) return;
      const originals = Array.from(track.children);
      if (!originals.length) return;
      originals.forEach((c) => track.appendChild(c.cloneNode(true)));
      const halfW = track.scrollWidth / 2;
      let pos = direction > 0 ? 0 : -halfW;
      let paused = false;
      track.style.transform = "translateX(" + pos + "px)";
      track.addEventListener("mouseenter", () => { paused = true; });
      track.addEventListener("mouseleave", () => { paused = false; });
      if (reduce) return;
      const tick = () => {
        if (!paused) {
          pos -= direction * SPEED;
          if (direction > 0 && pos <= -halfW) pos += halfW;
          if (direction < 0 && pos >= 0) pos -= halfW;
          track.style.transform = "translateX(" + pos + "px)";
        }
        requestAnimationFrame(tick);
      };
      tick();
    };
    setupRow("testi-track-1", 1);
    setupRow("testi-track-2", -1);
    setupRow("ab-testi-track-1", 1);
    setupRow("ab-testi-track-2", -1);
  })();

  /* ---------- REELS: PLATFORM CARD STACK CYCLE (reels) ---------- */
  (function () {
    const stack = document.querySelector(".plat-stack");
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll(".pc"));
    if (!cards.length) return;
    const transforms = [
      "rotate(14deg) translate(130px,-56px)",
      "rotate(9deg) translate(90px,-36px)",
      "rotate(5deg) translate(48px,-16px)",
      "rotate(1deg) translate(12px,4px)",
      "rotate(-3deg) translate(-24px,20px)",
    ];
    const applyPositions = () => {
      cards.forEach((c, i) => {
        c.style.transform = transforms[i];
        c.style.zIndex = String(i + 1);
      });
    };
    applyPositions();
    if (!reduce) {
      setInterval(() => {
        cards.unshift(cards.pop());
        applyPositions();
      }, 1800);
    }
  })();

  /* ---------- CONTACT: SECTION ENTRANCE + FIELD REVEALS (contact) ---------- */
  const contactSection = document.getElementById("contact-form");
  if (contactSection) {
    Array.from(document.querySelectorAll(".form-field")).forEach((f, i) => {
      f.style.transitionDelay = 0.06 + i * 0.06 + "s";
    });
    if (reduce) {
      contactSection.classList.add("contact-section-loaded");
    } else {
      let contactTriggered = false;
      const checkContact = () => {
        if (contactTriggered) return;
        if (contactSection.getBoundingClientRect().top < window.innerHeight * 0.95) {
          contactTriggered = true;
          contactSection.classList.add("contact-section-loaded");
          window.removeEventListener("scroll", checkContact);
        }
      };
      window.addEventListener("scroll", checkContact, { passive: true });
      window.addEventListener("load", () => requestAnimationFrame(checkContact));
      setTimeout(checkContact, 400);
    }
  }

  /* ---------- CONTACT: COPY EMAIL BUTTON (contact) ---------- */
  const copyBtn = document.getElementById("copy-email-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      /* prefer explicit data-copy-email, fall back to the adjacent email link/text */
      const adjacent = copyBtn.closest(".cinfo-value")
        ? copyBtn.closest(".cinfo-value").querySelector("a")
        : (copyBtn.parentElement && copyBtn.parentElement.querySelector("a"));
      const email = (copyBtn.dataset.copyEmail
        || (adjacent && adjacent.textContent.trim())
        || "hello@scootup.studio").trim();
      const showCopied = () => {
        copyBtn.classList.add("copied");
        copyBtn.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-check"></use></svg> Copied!';
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-copy"></use></svg> Copy';
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(() => {});
      } else {
        showCopied();
      }
    });
  }

  /* ---------- CONTACT: FORM SUCCESS (contact) ---------- */
  /* The mockup hijacked the form's submit to fade the form out and reveal the
     success panel. In WordPress the form is now Contact Form 7 (AJAX), which
     fires the `wpcf7mailsent` event on document after a successful send — so we
     listen for that instead of intercepting submit. A graceful fallback still
     hooks a raw <form> submit when CF7 is not present (e.g. static preview). */
  const formSuccessEl = document.getElementById("form-success");
  if (formSuccessEl) {
    const revealSuccess = () => {
      const formEl = document.getElementById("contact-form-el")
        || document.querySelector("#contact-form .cf7-wrapper");
      if (formEl) {
        formEl.style.transition = "opacity .4s ease";
        formEl.style.opacity = "0";
        setTimeout(() => {
          formEl.style.display = "none";
          formSuccessEl.style.display = "block";
          formSuccessEl.style.opacity = "0";
          formSuccessEl.style.transition = "opacity .5s ease";
          requestAnimationFrame(() => { formSuccessEl.style.opacity = "1"; });
        }, 400);
      } else {
        formSuccessEl.style.display = "block";
      }
    };
    /* CF7 AJAX success */
    document.addEventListener("wpcf7mailsent", revealSuccess);
    /* fallback: only when CF7 is absent, mirror the mockup's submit takeover */
    const formEl = document.getElementById("contact-form-el");
    if (formEl && typeof window.wpcf7 === "undefined" && !formEl.querySelector(".wpcf7-form-control")) {
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = formEl.querySelector(".submit-btn");
        if (btn) btn.classList.add("loading");
        setTimeout(revealSuccess, 900);
      });
    }
  }
})();
