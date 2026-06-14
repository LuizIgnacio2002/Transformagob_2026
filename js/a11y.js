/* ============================================================
   a11y.js — Accesibilidad e interculturalidad
   ------------------------------------------------------------
   - Escala de tamaño de letra
   - Alto contraste
   - Modo "lectura fácil"
   - Cambio de idioma (Español / Quechua)
   - Lectura en voz alta (Web Speech API / SpeechSynthesis)
   - Panel flotante de accesibilidad
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const { getPrefs, setPref } = App.store;
  const { setLang, getLang, t } = App.i18n;
  const { announce } = App.notify;

  const FONT_MIN = 0.9, FONT_MAX = 1.6, FONT_STEP = 0.1;

  /** Aplica las preferencias guardadas al <body>. */
  function applyPrefs() {
    const p = getPrefs();
    document.body.style.setProperty("--font-scale", p.fontScale);
    document.body.dataset.fontScale = p.fontScale;
    document.body.dataset.contrast = p.contrast;
    document.body.dataset.readable = p.readable;
    setLang(p.lang);
  }

  /* ---------- Controles individuales ---------- */
  function changeFont(dir) {
    const p = getPrefs();
    let v = +(p.fontScale + dir * FONT_STEP).toFixed(2);
    v = Math.min(FONT_MAX, Math.max(FONT_MIN, v));
    setPref("fontScale", v);
    applyPrefs();
    announce(`${t("a11y.fontSize")}: ${Math.round(v * 100)}%`);
  }

  function toggleContrast() {
    const p = getPrefs();
    setPref("contrast", p.contrast === "high" ? "normal" : "high");
    applyPrefs();
  }

  function toggleReadable() {
    const p = getPrefs();
    setPref("readable", p.readable === "on" ? "off" : "on");
    applyPrefs();
  }

  function switchLanguage(lang) {
    setPref("lang", lang);
    setLang(lang);
    applyPrefs();
    // Notificar a la app para re-renderizar la vista actual
    window.dispatchEvent(new CustomEvent("lang:change", { detail: lang }));
  }

  /* ---------- Lectura en voz alta (texto a voz) ---------- */
  let currentUtterance = null;

  function speak(text, btn) {
    if (!("speechSynthesis" in window)) {
      announce("La lectura en voz alta no está disponible en este navegador.");
      return;
    }
    // Si ya está leyendo, lo detenemos (toggle)
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      document.querySelectorAll(".tts-btn[aria-pressed='true']").forEach((b) => b.setAttribute("aria-pressed", "false"));
      if (currentUtterance && currentUtterance._btn === btn) { currentUtterance = null; return; }
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-PE"; // voz en español (no hay voz quechua estándar disponible)
    u.rate = 0.95;
    u._btn = btn;
    if (btn) btn.setAttribute("aria-pressed", "true");
    u.onend = () => { if (btn) btn.setAttribute("aria-pressed", "false"); currentUtterance = null; };
    currentUtterance = u;
    window.speechSynthesis.speak(u);
  }

  /** Lee el contenido principal completo de la página actual. */
  function readPage() {
    const main = document.getElementById("main-content") || document.getElementById("app");
    if (main) speak(main.innerText.slice(0, 4000));
  }

  /* ---------- Panel flotante de accesibilidad ---------- */
  function mountA11yPanel() {
    if (document.querySelector(".a11y-fab")) return;

    const fab = document.createElement("button");
    fab.className = "a11y-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Abrir opciones de accesibilidad");
    fab.setAttribute("aria-expanded", "false");
    fab.textContent = "♿";

    const panel = document.createElement("div");
    panel.className = "a11y-panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Opciones de accesibilidad");
    panel.innerHTML = panelHTML();

    document.body.append(fab, panel);

    fab.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      fab.setAttribute("aria-expanded", String(open));
      if (open) {
        const first = panel.querySelector("button, [tabindex]");
        if (first) first.focus();
      }
    });

    // Delegación de eventos del panel
    panel.addEventListener("click", (e) => {
      const target = e.target.closest("[data-a11y]");
      const act = target && target.dataset.a11y;
      if (!act) return;
      if (act === "font-up") changeFont(+1);
      if (act === "font-down") changeFont(-1);
      if (act === "contrast") toggleContrast();
      if (act === "readable") toggleReadable();
      if (act === "lang-es") switchLanguage("es");
      if (act === "lang-qu") switchLanguage("qu");
      if (act === "read-page") readPage();
      refreshPanel(panel);
    });

    refreshPanel(panel);
  }

  function panelHTML() {
    return `
      <h3>♿ <span data-i18n="a11y.title">Accesibilidad</span></h3>
      <div class="a11y-row">
        <span data-i18n="a11y.fontSize">Tamaño de letra</span>
        <div class="a11y-controls">
          <button class="a11y-btn" data-a11y="font-down" aria-label="Reducir letra">A−</button>
          <button class="a11y-btn" data-a11y="font-up" aria-label="Aumentar letra">A+</button>
        </div>
      </div>
      <div class="a11y-row">
        <span data-i18n="a11y.contrast">Alto contraste</span>
        <button class="a11y-btn" data-a11y="contrast" aria-pressed="false" aria-label="Alternar alto contraste">◑</button>
      </div>
      <div class="a11y-row">
        <span data-i18n="a11y.readable">Lectura fácil</span>
        <button class="a11y-btn" data-a11y="readable" aria-pressed="false" aria-label="Alternar lectura fácil">¶</button>
      </div>
      <div class="a11y-row">
        <span data-i18n="a11y.language">Idioma</span>
        <div class="lang-switch">
          <button data-a11y="lang-es" aria-pressed="true">ES</button>
          <button data-a11y="lang-qu" aria-pressed="false">QU</button>
        </div>
      </div>
      <div class="a11y-row">
        <span data-i18n="a11y.tts">Leer página</span>
        <button class="a11y-btn" data-a11y="read-page" aria-label="Leer la página en voz alta">🔊</button>
      </div>`;
  }

  /** Refresca los estados visuales (pressed) y textos i18n del panel. */
  function refreshPanel(panel) {
    const p = getPrefs();
    panel.querySelector('[data-a11y="contrast"]').setAttribute("aria-pressed", String(p.contrast === "high"));
    panel.querySelector('[data-a11y="readable"]').setAttribute("aria-pressed", String(p.readable === "on"));
    panel.querySelector('[data-a11y="lang-es"]').setAttribute("aria-pressed", String(p.lang === "es"));
    panel.querySelector('[data-a11y="lang-qu"]').setAttribute("aria-pressed", String(p.lang === "qu"));
    panel.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n, node.textContent);
    });
  }

  /* ---------- Delegación global para botones de "Escuchar" ---------- */
  function initTTSDelegation() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".tts-btn[data-tts]");
      if (btn) speak(btn.dataset.tts, btn);
    });
  }

  App.a11y = {
    applyPrefs, changeFont, toggleContrast, toggleReadable, switchLanguage,
    speak, readPage, mountA11yPanel, initTTSDelegation,
  };
})();
