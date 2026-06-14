/* ============================================================
   views/citas.js — Mis citas + recordatorios/confirmación
   Requisito mínimo 2: recordatorios, alertas y notificaciones.
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const views = (App.views = App.views || {});
  const { esc, badge, dayMonth, emptyState } = App.components;
  const { t } = App.i18n;

  async function render(ctx) {
    const appts = await App.api.getAppointments(ctx.session.patientId);
    const sorted = appts.slice().sort((a, b) => a.date.localeCompare(b.date));

    return `
    <div class="stack">
      <div class="page-head">
        <h1>📅 ${t("nav.citas")}</h1>
        <p>Aquí ves tus citas, sus recordatorios y la preparación que necesitas.
           Confirma tu asistencia para reservar tu cupo.</p>
      </div>

      <div class="card">
        ${sorted.length ? sorted.map(citaRow).join("") : emptyState("📭", "No tienes citas registradas.")}
      </div>

      <div class="card" style="background:var(--brand-50)">
        <strong>🔔 ¿Cómo recibirás tus recordatorios?</strong>
        <p class="mb-0 small">Te avisaremos por esta app, y —en la versión integrada— también por
        SMS y mensajería, especialmente útil para pacientes con conectividad limitada.
        <em>(Envío de SMS simulado en este prototipo.)</em></p>
      </div>
    </div>`;
  }

  function citaRow(c) {
    const dm = dayMonth(c.date);
    const kind = c.status === "confirmada" ? "ok" : c.status === "pendiente" ? "warn" : "info";
    return `
      <div class="cita-item" data-id="${esc(c.id)}">
        <div class="cita-date"><div class="d">${dm.d}</div><div class="m">${dm.m}</div></div>
        <div class="cita-body">
          <h4>${esc(c.title)}</h4>
          <div class="muted small">🕘 ${esc(c.time)} · 📍 ${esc(c.place)}</div>
          <div class="small" style="margin-top:.3rem">📋 ${esc(c.prep)}</div>
          <div style="margin-top:.4rem">${badge(c.status, kind)}</div>
        </div>
        <div class="stack" style="gap:.4rem">
          ${c.status !== "confirmada"
            ? `<button class="btn btn--subtle" data-confirm="${esc(c.id)}">Confirmar</button>`
            : `<span class="badge badge--ok">✓ Confirmada</span>`}
          <button class="btn btn--ghost" data-remind="${esc(c.id)}">🔔 Recordar</button>
        </div>
      </div>`;
  }

  function mount(root) {
    const { toast } = App.notify;

    // Confirmar asistencia (SIMULADO -> api.confirmAppointment)
    root.querySelectorAll("[data-confirm]").forEach((b) =>
      b.addEventListener("click", async () => {
        b.disabled = true; b.textContent = "Confirmando…";
        try {
          await App.api.confirmAppointment(b.dataset.confirm);
          toast("¡Cita confirmada! Te enviaremos un recordatorio.", "ok");
          const item = b.closest(".cita-item");
          const badgeInBody = item.querySelector(".cita-body .badge");
          if (badgeInBody) badgeInBody.outerHTML = badge("confirmada", "ok");
          const span = document.createElement("span");
          span.className = "badge badge--ok";
          span.textContent = "✓ Confirmada";
          b.replaceWith(span);
        } catch (err) {
          toast(err.message, "warn"); b.disabled = false; b.textContent = "Confirmar";
        }
      })
    );

    // Activar recordatorio (simulado)
    root.querySelectorAll("[data-remind]").forEach((b) =>
      b.addEventListener("click", () => {
        toast("Recordatorio activado. Te avisaremos 24 h antes (SMS simulado).", "info");
      })
    );
  }

  views.citas = { render, mount };
})();
