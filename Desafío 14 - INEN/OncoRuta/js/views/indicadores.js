/* ============================================================
   views/indicadores.js — Indicadores detallados (rol admin)
   ============================================================ */

import { FIRST_APPT_STATS, HC_OPENINGS } from "../mockData.js";
import { barChart, esc } from "../components.js";
import { t } from "../i18n.js";

export async function render() {
  return `
  <div class="stack">
    <div class="page-head">
      <h1>📈 ${t("nav.indicadores")}</h1>
      <p>Análisis del cuello de botella principal: la programación de la primera cita.</p>
    </div>

    <div class="grid grid-3">
      <div class="card kpi"><span class="kpi__value">${esc(FIRST_APPT_STATS.min)}</span><span class="kpi__label">Tiempo mínimo</span></div>
      <div class="card kpi kpi--warn"><span class="kpi__value">${esc(FIRST_APPT_STATS.promedioTexto)}</span><span class="kpi__label">Tiempo promedio</span></div>
      <div class="card kpi kpi--accent"><span class="kpi__value">${esc(FIRST_APPT_STATS.max)}</span><span class="kpi__label">Tiempo máximo</span></div>
    </div>

    <div class="card">
      <div class="card__title"><h3>Distribución de la programación de cita (por días)</h3></div>
      ${barChart(FIRST_APPT_STATS.distribucion.map((d) => ({
        label: d.rango, value: d.casos, display: d.casos.toLocaleString("es-PE"),
      })))}
      <p class="small muted" style="margin-top:.6rem">El ${FIRST_APPT_STATS.mayorA1dia}% de las citas tarda más de 1 día en programarse;
        solo el ${FIRST_APPT_STATS.menorA1dia}% se programa en menos de 1 día.</p>
    </div>

    <div class="card">
      <div class="card__title"><h3>Aperturas de HC por servicio (Top, ${esc(HC_OPENINGS.period)})</h3></div>
      ${barChart(HC_OPENINGS.porServicio.map((s) => ({
        label: s.servicio,
        value: s.refcon + s.manual + s.sinRef,
        display: (s.refcon + s.manual + s.sinRef).toLocaleString("es-PE"),
      })), { accent: true })}
    </div>

    <div class="card" style="background:var(--brand-50)">
      <strong>💡 Oportunidad de mejora:</strong> digitalizar y automatizar la programación de la
      primera cita y la apertura de HC reduciría las esperas presenciales y los tiempos muertos,
      beneficiando especialmente a pacientes de provincia y en situación de vulnerabilidad.
    </div>
  </div>`;
}
