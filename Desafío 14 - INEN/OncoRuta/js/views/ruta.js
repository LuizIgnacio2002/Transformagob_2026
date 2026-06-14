/* ============================================================
   views/ruta.js — "Mi ruta diagnóstica" (timeline + mapa físico)
   Requisito mínimo 1: centralizar el estado del caso y los pasos.
   ============================================================ */

import { getJourney, getPatient } from "../api.js";
import { esc, badge, fmtDate, STATE_META, ttsButton } from "../components.js";
import { t } from "../i18n.js";

export async function render(ctx) {
  const pid = ctx.session.patientId;
  const [patient, journey] = await Promise.all([getPatient(pid), getJourney(pid)]);

  const done = journey.filter((s) => s.state === "done").length;
  const pct = Math.round((done / journey.length) * 100);

  return `
  <div class="stack">
    <div class="page-head">
      <h1>🧭 ${t("nav.ruta")}</h1>
      <p>Este es tu recorrido en el INEN, desde la referencia hasta tu diagnóstico.
         Te mostramos en qué etapa estás y qué sigue, paso a paso.</p>
    </div>

    <div class="card">
      <div class="row between row--wrap">
        <div>
          <strong>${esc(patient.name)}</strong> · ${esc(patient.diagnosisFocus)}<br>
          <span class="muted small">HC: ${esc(patient.hc)} · Origen: ${esc(patient.origin)}</span>
        </div>
        <div style="min-width:200px">
          <div class="small muted">Avance general: <strong>${pct}%</strong></div>
          <div class="bar bar--accent"><span style="width:${pct}%"></span></div>
        </div>
      </div>
    </div>

    <!-- Línea de tiempo -->
    <div class="timeline">
      ${journey.map(stepHTML).join("")}
    </div>

    <!-- Mapa físico del recorrido (9 hitos INEN) -->
    <div class="card">
      <div class="card__title"><h3>🗺️ Tu recorrido físico en el INEN (referencia)</h3></div>
      <p class="muted small">Hitos del recorrido presencial. Con OncoRuta buscamos reducir
         desplazamientos y esperas innecesarias.</p>
      <div class="map-grid">
        ${PHYSICAL_MILESTONES.map((m, i) => mapNode(m, i, journey)).join("")}
      </div>
    </div>
  </div>`;
}

function stepHTML(s, i) {
  const meta = STATE_META[s.state] || STATE_META.pending;
  const stateLabel = t(`step.${s.state}`, meta.label);
  const dateTxt = s.date ? fmtDate(s.date, true) + (s.time ? ` · ${s.time}` : "") : "Por confirmar";
  return `
    <div class="tl-step" data-state="${s.state}">
      <div class="tl-step__rail">
        <span class="tl-step__dot" aria-hidden="true">${s.state === "done" ? "✓" : i + 1}</span>
        <span class="tl-step__line"></span>
      </div>
      <div class="tl-step__body">
        <div class="tl-step__card">
          <div class="tl-step__title">
            <h4>${esc(s.title)}</h4>
            ${badge(stateLabel, s.state === "done" ? "ok" : s.state === "current" ? "accent" : "muted")}
          </div>
          <p class="mb-0">${esc(s.desc)}</p>
          <div class="tl-step__meta" style="margin-top:.6rem">
            <span>📍 ${esc(s.location)}</span>
            <span>📆 ${dateTxt}</span>
            <span>👤 ${esc(s.responsible)}</span>
          </div>
          ${s.note ? `<div class="card" style="background:var(--brand-50);margin-top:.7rem">${esc(s.note)}</div>` : ""}
          ${s.docs && s.docs.length ? `<div class="small muted" style="margin-top:.6rem">📎 Lleva: ${s.docs.map(esc).join(", ")}</div>` : ""}
          ${s.tips ? `<div class="row between row--wrap" style="margin-top:.6rem;gap:.5rem"><span class="small">💡 ${esc(s.tips)}</span>${ttsButton(`${s.title}. ${s.desc}. ${s.tips}`)}</div>` : ""}
        </div>
      </div>
    </div>`;
}

/* Los 9 hitos físicos del recorrido (de la PPT oficial del INEN) */
const PHYSICAL_MILESTONES = [
  { n: 1, t: "Obtención de ticket", k: "admision" },
  { n: 2, t: "Presentación de documentos", k: "admision" },
  { n: 3, t: "Revisión de documentos", k: "admision" },
  { n: 4, t: "Generación de HC", k: "hc" },
  { n: 5, t: "Traslado a módulo de cita", k: "cita1" },
  { n: 6, t: "Traslado de documentación", k: "cita1" },
  { n: 7, t: "Obtención de 1ra cita", k: "cita1" },
  { n: 8, t: "Primera atención", k: "atencion1" },
  { n: 9, t: "Exámenes y cita de diagnóstico", k: "examenes" },
];

function mapNode(m, i, journey) {
  const stage = journey.find((s) => s.key === m.k);
  const state = stage?.state || "pending";
  return `
    <div class="map-node" data-state="${state}">
      <span class="num">${m.n}</span>
      <strong class="small">${esc(m.t)}</strong>
      <div style="margin-top:.4rem">${badge(t(`step.${state}`), state === "done" ? "ok" : state === "current" ? "accent" : "muted")}</div>
    </div>`;
}
