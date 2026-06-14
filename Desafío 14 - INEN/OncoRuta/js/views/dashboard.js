/* ============================================================
   views/dashboard.js — Inicio del paciente / cuidadora
   Centraliza el estado del caso y el siguiente paso (requisito mínimo 1).
   ============================================================ */

import { getPatient, getJourney, getAppointments, getNotifications } from "../api.js";
import { esc, badge, fmtDate, dayMonth, ttsButton, emptyState } from "../components.js";
import { t } from "../i18n.js";

export async function render(ctx) {
  const pid = ctx.session.patientId;
  const [patient, journey, appts, notifs] = await Promise.all([
    getPatient(pid), getJourney(pid), getAppointments(pid), getNotifications(pid),
  ]);

  const current = journey.find((s) => s.state === "current") || journey[journey.length - 1];
  const done = journey.filter((s) => s.state === "done").length;
  const pct = Math.round((done / journey.length) * 100);
  const nextAppt = appts.slice().sort((a, b) => a.date.localeCompare(b.date))[0];
  const unread = notifs.filter((n) => n.unread).length;

  const isCaregiver = ctx.session.role === "cuidadora";
  const initials = patient.alias?.[0] || patient.name[0];

  return `
  <div class="stack">
    <!-- Saludo -->
    <div class="hero-greet">
      <span class="avatar" aria-hidden="true">${esc(initials)}</span>
      <div>
        <h2>${t("greet.hello")}, ${esc(patient.alias)} 👋</h2>
        <p>${isCaregiver ? `Estás acompañando a <strong>${esc(patient.name)}</strong>. ` : ""}${t("greet.welcome")}.</p>
      </div>
      <div class="hero-greet__cta">
        <a class="btn btn--accent" href="#/ruta">Ver mi ruta completa →</a>
      </div>
    </div>

    <!-- KPIs rápidos -->
    <div class="grid grid-4">
      <div class="card kpi"><span class="kpi__value">${pct}%</span><span class="kpi__label">Avance de tu ruta</span><span class="kpi__hint">${done} de ${journey.length} etapas</span></div>
      <div class="card kpi kpi--accent"><span class="kpi__value">${appts.length}</span><span class="kpi__label">Citas programadas</span><span class="kpi__hint">próxima: ${nextAppt ? fmtDate(nextAppt.date) : "—"}</span></div>
      <div class="card kpi"><span class="kpi__value">${unread}</span><span class="kpi__label">Notificaciones nuevas</span><span class="kpi__hint"><a href="#/notificaciones">ver todas</a></span></div>
      <div class="card kpi"><span class="kpi__value">${esc(patient.hc)}</span><span class="kpi__label">Tu Historia Clínica</span><span class="kpi__hint">REFCON: ${esc(patient.refcon)}</span></div>
    </div>

    <!-- Siguiente paso destacado -->
    <div class="card next-step">
      <div class="row between row--wrap">
        <div class="card__title">${badge(t("step.next"), "accent")} <h3 style="margin:0">${esc(current.title)}</h3></div>
        ${ttsButton(`${current.title}. ${current.desc}. ${current.tips || ""}`)}
      </div>
      <p>${esc(current.desc)}</p>
      <div class="grid grid-3">
        <div><span class="muted small">${t("common.location")}</span><br><strong>${esc(current.location)}</strong></div>
        <div><span class="muted small">${t("common.date")}</span><br><strong>${current.date ? fmtDate(current.date, true) : "Por confirmar"}</strong></div>
        <div><span class="muted small">Responsable</span><br><strong>${esc(current.responsible)}</strong></div>
      </div>
      ${current.tips ? `<div class="card" style="background:#fff;margin-top:1rem"><strong>💡 Consejo:</strong> ${esc(current.tips)}</div>` : ""}
    </div>

    <div class="grid grid-2">
      <!-- Próxima cita -->
      <div class="card">
        <div class="card__title"><h3>📅 Tu próxima cita</h3></div>
        ${nextAppt ? citaCard(nextAppt) : emptyState("📭", "No tienes citas próximas.")}
        <a class="btn btn--ghost btn--block" href="#/citas" style="margin-top:.8rem">Ver todas mis citas</a>
      </div>

      <!-- Notificaciones recientes -->
      <div class="card">
        <div class="card__title"><h3>🔔 Avisos recientes</h3></div>
        ${notifs.slice(0, 3).map(notifRow).join("") || emptyState("🔕", "Sin avisos.")}
        <a class="btn btn--ghost btn--block" href="#/notificaciones" style="margin-top:.8rem">Ver todas</a>
      </div>
    </div>
  </div>`;
}

function citaCard(c) {
  const dm = dayMonth(c.date);
  return `
    <div class="cita-item">
      <div class="cita-date"><div class="d">${dm.d}</div><div class="m">${dm.m}</div></div>
      <div class="cita-body">
        <h4>${esc(c.title)}</h4>
        <div class="muted small">🕘 ${esc(c.time)} · 📍 ${esc(c.place)}</div>
        <div style="margin-top:.3rem">${badge(c.status, c.status === "confirmada" ? "ok" : "info")}</div>
      </div>
    </div>`;
}

function notifRow(n) {
  return `
    <div class="notif ${n.unread ? "notif--unread" : ""}">
      <span class="notif__ico" style="background:var(--brand-50)">${n.icon}</span>
      <div>
        <strong>${esc(n.title)}</strong>
        <div class="small muted">${esc(n.body)}</div>
        <div class="notif__time">${esc(n.time)}</div>
      </div>
    </div>`;
}
