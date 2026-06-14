/* ============================================================
   views/perfil.js — Perfil del usuario / accesibilidad / privacidad
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const views = (App.views = App.views || {});
  const { esc } = App.components;
  const { t } = App.i18n;

  async function render(ctx) {
    const { APP } = App.config;
    const patient = ctx.session.patientId ? await App.api.getPatient(ctx.session.patientId) : null;

    return `
    <div class="stack">
      <div class="page-head"><h1>👤 ${t("nav.perfil")}</h1></div>

      <div class="card">
        <div class="card__title"><h3>Cuenta</h3></div>
        <div class="grid grid-2">
          <div><span class="muted small">Usuario</span><br><strong>${esc(ctx.session.user)}</strong></div>
          <div><span class="muted small">Rol</span><br><strong>${esc(ctx.session.role)}</strong></div>
        </div>
      </div>

      ${patient ? `
      <div class="card">
        <div class="card__title"><h3>Datos de la paciente</h3></div>
        <div class="grid grid-2">
          <div><span class="muted small">Nombre</span><br><strong>${esc(patient.name)}</strong></div>
          <div><span class="muted small">Edad</span><br><strong>${patient.age} años</strong></div>
          <div><span class="muted small">Origen</span><br><strong>${esc(patient.origin)}</strong></div>
          <div><span class="muted small">Idiomas</span><br><strong>${patient.languages.map(esc).join(", ")}</strong></div>
          <div><span class="muted small">Nivel digital</span><br><strong>${esc(patient.digitalLevel)}</strong></div>
          <div><span class="muted small">Historia Clínica</span><br><strong>${esc(patient.hc)}</strong></div>
        </div>
        <div style="margin-top:.8rem">
          ${patient.vulnerabilities.map((v) => `<span class="tag-soft" style="margin-right:.3rem">${esc(v)}</span>`).join("")}
        </div>
        ${patient.caregiver ? `<p class="small muted" style="margin-top:.8rem">🧑‍🤝‍🧑 Cuidadora autorizada: <strong>${esc(patient.caregiver)}</strong></p>` : ""}
      </div>` : ""}

      <div class="card" style="background:var(--brand-50)">
        <div class="card__title"><h3>🔒 Privacidad y protección de datos</h3></div>
        <p class="mb-0 small">Tu información se trata conforme a la <strong>Ley N.° 29733</strong> de Protección de
          Datos Personales y la <strong>Ley General de Salud</strong>. En este prototipo no se usan
          historias clínicas reales. Puedes solicitar acceso, rectificación o eliminación de tus datos.</p>
      </div>

      <div class="card">
        <div class="row between row--wrap">
          <span class="muted small">${esc(APP.name)} · ${esc(APP.version)}</span>
          <button class="btn btn--ghost" id="open-a11y">♿ Ajustes de accesibilidad</button>
        </div>
      </div>
    </div>`;
  }

  function mount(root) {
    const btn = root.querySelector("#open-a11y");
    if (btn) btn.addEventListener("click", () => {
      const fab = document.querySelector(".a11y-fab");
      if (fab) fab.click();
    });
  }

  views.perfil = { render, mount };
})();
