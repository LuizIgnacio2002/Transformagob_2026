/* ============================================================
   views/notificaciones.js — Centro de notificaciones / alertas
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const views = (App.views = App.views || {});
  const { esc, emptyState } = App.components;
  const { t } = App.i18n;

  const TYPE_COLOR = {
    cita: "var(--info-100)", hito: "var(--ok-100)", examen: "var(--accent-100)", info: "var(--brand-50)",
  };

  async function render(ctx) {
    const notifs = await App.api.getNotifications(ctx.session.patientId);
    const unread = notifs.filter((n) => n.unread).length;

    return `
    <div class="stack">
      <div class="page-head">
        <div class="row between row--wrap">
          <div>
            <h1>🔔 ${t("nav.notificaciones")}</h1>
            <p class="mb-0">Recordatorios de citas, alertas de exámenes y avisos de hitos importantes.</p>
          </div>
          ${unread ? `<button class="btn btn--ghost" id="mark-all">Marcar todo como leído (${unread})</button>` : ""}
        </div>
      </div>

      <div class="stack" id="notif-list">
        ${notifs.length ? notifs.map(notifRow).join("") : emptyState("🔕", "No tienes notificaciones.")}
      </div>
    </div>`;
  }

  function notifRow(n) {
    return `
      <div class="notif ${n.unread ? "notif--unread" : ""}" data-id="${esc(n.id)}">
        <span class="notif__ico" style="background:${TYPE_COLOR[n.type] || "var(--brand-50)"}">${n.icon}</span>
        <div style="flex:1">
          <div class="row between">
            <strong>${esc(n.title)}</strong>
            ${n.unread ? `<span class="badge badge--accent">nuevo</span>` : ""}
          </div>
          <div class="small">${esc(n.body)}</div>
          <div class="notif__time">${esc(n.time)}</div>
        </div>
      </div>`;
  }

  function mount(root) {
    const { toast } = App.notify;
    const markBtn = root.querySelector("#mark-all");
    if (markBtn) markBtn.addEventListener("click", (e) => {
      root.querySelectorAll(".notif--unread").forEach((node) => {
        node.classList.remove("notif--unread");
        const b = node.querySelector(".badge--accent");
        if (b) b.remove();
      });
      e.target.remove();
      toast("Todas las notificaciones marcadas como leídas.", "ok");
    });
  }

  views.notificaciones = { render, mount };
})();
