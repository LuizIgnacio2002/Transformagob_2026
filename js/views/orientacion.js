/* ============================================================
   views/orientacion.js — Orientación clara, inclusiva e intercultural
   Requisito mínimo 3: orientación comprensible para la paciente.
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const views = (App.views = App.views || {});
  const { esc, ttsButton } = App.components;
  const { t } = App.i18n;

  async function render() {
    const { FAQ } = App.data;
    const { APP } = App.config;
    return `
    <div class="stack">
      <div class="page-head">
        <h1>💬 ${t("nav.orientacion")}</h1>
        <p>Información clara para acompañarte. Puedes escuchar cada respuesta en voz alta
           y cambiar el idioma desde el botón de Accesibilidad ♿.</p>
      </div>

      <div class="grid grid-3">
        <div class="card"><div class="card__title"><h3>🗣️ En tu idioma</h3></div><p class="small mb-0">Interfaz en español y quechua, con lectura en voz alta para quienes prefieren escuchar.</p></div>
        <div class="card"><div class="card__title"><h3>🧑‍🤝‍🧑 Con acompañamiento</h3></div><p class="small mb-0">Un familiar o cuidador puede seguir tu ruta y recibir tus recordatorios, si lo autorizas.</p></div>
        <div class="card"><div class="card__title"><h3>📞 Soporte humano</h3></div><p class="small mb-0">¿Dudas? Llama al ${esc(APP.supportPhone)} (L–V 8:00 a 16:00).</p></div>
      </div>

      <div class="card">
        <div class="card__title"><h3>Preguntas frecuentes</h3></div>
        <div class="accordion">
          ${FAQ.map((f, i) => `
            <div class="accordion__item">
              <button class="accordion__btn" aria-expanded="false" data-acc="${i}">
                <span>${esc(f.q)}</span><span aria-hidden="true">＋</span>
              </button>
              <div class="accordion__panel" id="acc-panel-${i}" hidden>
                <p>${esc(f.a)}</p>
                ${ttsButton(`${f.q}. ${f.a}`)}
              </div>
            </div>`).join("")}
        </div>
      </div>

      <div class="card" style="background:var(--accent-100);border-color:var(--accent-200)">
        <div class="card__title"><h3>🆘 ¿Necesitas ayuda urgente?</h3></div>
        <p class="mb-0">Si tienes una emergencia de salud, acude al servicio de emergencia más cercano
           o llama a tu establecimiento. Esta app acompaña tu proceso diagnóstico, pero
           <strong>no reemplaza la atención médica</strong>.</p>
      </div>
    </div>`;
  }

  function mount(root) {
    root.querySelectorAll("[data-acc]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const i = btn.dataset.acc;
        const panel = root.querySelector(`#acc-panel-${i}`);
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
        btn.querySelector("span:last-child").textContent = open ? "＋" : "−";
      })
    );
  }

  views.orientacion = { render, mount };
})();
