/* ============================================================
   components.js — Helpers de renderizado reutilizables
   ------------------------------------------------------------
   Funciones puras que devuelven cadenas HTML, más utilidades de
   DOM. Mantiene las vistas más legibles y evita repetición.
   ============================================================ */

/** Escapa texto para evitar inyección de HTML al interpolar datos. */
export function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

/** Atajo: crea un elemento desde una cadena HTML. */
export function el(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

/** Mapa de estado de etapa -> etiqueta y clase de badge. */
export const STATE_META = {
  done:    { label: "Completado", badge: "badge--ok",   icon: "✓" },
  current: { label: "En curso",   badge: "badge--accent", icon: "●" },
  pending: { label: "Pendiente",  badge: "badge--muted", icon: "○" },
};

/** Tarjeta KPI. */
export function kpi({ value, label, hint = "", variant = "" }) {
  return `
    <div class="card kpi ${variant}">
      <span class="kpi__value">${esc(value)}</span>
      <span class="kpi__label">${esc(label)}</span>
      ${hint ? `<span class="kpi__hint">${esc(hint)}</span>` : ""}
    </div>`;
}

/** Badge genérico. */
export function badge(text, kind = "muted") {
  return `<span class="badge badge--${kind}">${esc(text)}</span>`;
}

/** Gráfico de barras horizontal simple (sin librerías). */
export function barChart(rows, { accent = false } = {}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return `<div class="barchart">${rows.map((r) => `
    <div class="barchart__row">
      <span class="barchart__label">${esc(r.label)}</span>
      <span class="bar ${accent ? "bar--accent" : ""}"><span style="width:${Math.round((r.value / max) * 100)}%"></span></span>
      <span class="barchart__val">${esc(r.display ?? r.value)}</span>
    </div>`).join("")}</div>`;
}

/** Donut con conic-gradient a partir de segmentos {pct, color, label}. */
export function donut(segments) {
  let acc = 0;
  const stops = segments.map((s) => {
    const start = acc; acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");
  const legend = segments.map((s) =>
    `<div><span class="dot" style="background:${s.color}"></span>${esc(s.label)} — <strong>${s.pct}%</strong></div>`
  ).join("");
  return `
    <div class="row row--wrap" style="gap:1.5rem">
      <div class="donut" style="background: conic-gradient(${stops})" role="img" aria-label="Gráfico de distribución"></div>
      <div class="legend">${legend}</div>
    </div>`;
}

/** Formatea una fecha ISO (YYYY-MM-DD) a texto legible en español. */
const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","set","oct","nov","dic"];
const MESES_LARGO = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","noviembre","diciembre"];
export function fmtDate(iso, long = false) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (long) return `${d} de ${MESES_LARGO[m - 1]} de ${y}`;
  return `${d} ${MESES[m - 1]} ${y}`;
}
export function dayMonth(iso) {
  if (!iso) return { d: "—", m: "" };
  const [, m, d] = iso.split("-").map(Number);
  return { d: String(d).padStart(2, "0"), m: MESES[m - 1] };
}

/** Estado vacío. */
export function emptyState(icon, text) {
  return `<div class="empty"><div class="big">${icon}</div><p>${esc(text)}</p></div>`;
}

/** Botón de lectura en voz alta para un bloque de texto. */
export function ttsButton(text) {
  return `<button class="tts-btn" data-tts="${esc(text)}" type="button" aria-pressed="false">🔊 Escuchar</button>`;
}
