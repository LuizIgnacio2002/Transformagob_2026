/* ============================================================
   views/panel.js — Panel institucional (rol admin / Equipo INEN)
   Visión general con KPIs derivados de los documentos del desafío.
   ============================================================ */

import { HC_OPENINGS, REFCON_DAYS, FIRST_APPT_STATS, STAGE_STATS } from "../mockData.js";
import { donut, barChart, esc } from "../components.js";
import { t } from "../i18n.js";

export async function render() {
  const refconPct = Math.round((HC_OPENINGS.refcon / HC_OPENINGS.conReferencia) * 100);

  return `
  <div class="stack">
    <div class="page-head">
      <h1>📊 ${t("nav.panel")}</h1>
      <p>Visión institucional para reducir demoras y priorizar a pacientes vulnerables.
         Datos agregados del proceso diagnóstico (referenciales, anonimizados).</p>
    </div>

    <div class="grid grid-4">
      <div class="card kpi"><span class="kpi__value">${HC_OPENINGS.total.toLocaleString("es-PE")}</span><span class="kpi__label">Aperturas de HC</span><span class="kpi__hint">${esc(HC_OPENINGS.period)}</span></div>
      <div class="card kpi kpi--accent"><span class="kpi__value">${REFCON_DAYS.promedio}</span><span class="kpi__label">Días prom. atención REFCON</span><span class="kpi__hint">objetivo: ${REFCON_DAYS.objetivo} días</span></div>
      <div class="card kpi kpi--warn"><span class="kpi__value">${FIRST_APPT_STATS.mayorA1dia}%</span><span class="kpi__label">Citas que tardan +1 día</span><span class="kpi__hint">prom: ${esc(FIRST_APPT_STATS.promedioTexto)}</span></div>
      <div class="card kpi"><span class="kpi__value">${STAGE_STATS[4].pct}%</span><span class="kpi__label">Casos sin estadio clínico</span><span class="kpi__hint">oportunidad de registro</span></div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <div class="card__title"><h3>Canal de apertura de HC</h3></div>
        <p class="small muted">El ${refconPct}% de las referencias se gestiona por REFCON y el resto manualmente
          (oportunidad de interoperabilidad).</p>
        ${barChart([
          { label: "REFCON", value: HC_OPENINGS.refcon, display: HC_OPENINGS.refcon },
          { label: "Manual", value: HC_OPENINGS.manual, display: HC_OPENINGS.manual },
          { label: "Sin referencia", value: HC_OPENINGS.sinReferencia, display: HC_OPENINGS.sinReferencia },
        ])}
      </div>

      <div class="card">
        <div class="card__title"><h3>Casos nuevos por estadio clínico</h3></div>
        ${donut(STAGE_STATS.map((s) => ({ pct: s.pct, color: s.color, label: s.estadio })))}
        <p class="small muted" style="margin-top:.8rem">Más del 51% sin estadio registrado y ~29% en estadios avanzados (III–IV):
          el diagnóstico temprano es clave.</p>
      </div>
    </div>

    <div class="card">
      <div class="card__title"><h3>Tiempo de atención de referencias por REFCON (2026)</h3></div>
      ${barChart(REFCON_DAYS.meses.map((m) => ({
        label: m.mes, value: m.dias, display: m.dias.toFixed(2),
      })), { accent: true })}
      <p class="small muted" style="margin-top:.6rem">Meta: ${REFCON_DAYS.objetivo} días. Aunque se cumple la meta,
        el tiempo real (hasta 20 días en marzo) sigue demorando el inicio del diagnóstico.</p>
    </div>

    <div class="grid grid-2">
      <a class="card" href="#/pacientes" style="text-decoration:none;color:inherit">
        <div class="card__title"><h3>👥 Pacientes en seguimiento →</h3></div>
        <p class="mb-0 small muted">Lista priorizada de pacientes y su etapa actual.</p>
      </a>
      <a class="card" href="#/indicadores" style="text-decoration:none;color:inherit">
        <div class="card__title"><h3>📈 Indicadores detallados →</h3></div>
        <p class="mb-0 small muted">Distribución de tiempos de programación de cita y más.</p>
      </a>
    </div>
  </div>`;
}
