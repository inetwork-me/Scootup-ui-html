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
        const t = document.querySelector("#contact");
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
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
})();
