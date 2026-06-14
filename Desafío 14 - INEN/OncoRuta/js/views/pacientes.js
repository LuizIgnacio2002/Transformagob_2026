/* ============================================================
   views/pacientes.js — Lista priorizada de pacientes (rol admin)
   Apoya la priorización oportuna de casos (especialmente vulnerables).
   ============================================================ */

import { getAdminPatients } from "../api.js";
import { esc, badge } from "../components.js";
import { toast } from "../notifications.js";
import { t } from "../i18n.js";

const PRIO = { alta: "danger", media: "warn", baja: "muted" };

export async function render() {
  const patients = await getAdminPatients();
  return `
  <div class="stack">
    <div class="page-head">
      <h1>👥 ${t("nav.pacientes")}</h1>
      <p>Seguimiento de pacientes con priorización por tiempo de espera y vulnerabilidad.
         Datos ficticios para la demostración.</p>
    </div>

    <div class="card">
      <div class="row row--wrap" style="gap:.5rem;margin-bottom:.8rem">
        <button class="chip" data-filter="todas" aria-pressed="true">Todas</button>
        <button class="chip" data-filter="alta" aria-pressed="false">Prioridad alta</button>
        <button class="chip" data-filter="vulnerable" aria-pressed="false">Vulnerables</button>
      </div>
      <div class="table-wrap">
        <table class="data" id="pt-table">
          <thead>
            <tr>
              <th>Paciente</th><th>Edad</th><th>Origen</th><th>Foco</th>
              <th>Etapa actual</th><th>Días en etapa</th><th>Prioridad</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${patients.map(rowHTML).join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function rowHTML(p) {
  return `
    <tr data-prio="${p.prioridad}" data-vuln="${p.vulnerable}">
      <td><strong>${esc(p.name)}</strong> ${p.vulnerable ? '<span class="tag-soft">vulnerable</span>' : ""}</td>
      <td>${p.edad}</td>
      <td>${esc(p.origen)}</td>
      <td>${esc(p.foco)}</td>
      <td>${esc(p.etapa)}</td>
      <td>${p.dias} días ${p.dias >= 10 ? "⚠️" : ""}</td>
      <td>${badge(p.prioridad, PRIO[p.prioridad])}</td>
      <td><button class="btn btn--ghost" data-notify="${esc(p.name)}">🔔 Priorizar</button></td>
    </tr>`;
}

export function mount(root) {
  const rows = [...root.querySelectorAll("#pt-table tbody tr")];
  const chips = [...root.querySelectorAll("[data-filter]")];

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      const f = chip.dataset.filter;
      rows.forEach((r) => {
        const show = f === "todas"
          || (f === "alta" && r.dataset.prio === "alta")
          || (f === "vulnerable" && r.dataset.vuln === "true");
        r.style.display = show ? "" : "none";
      });
    })
  );

  root.querySelectorAll("[data-notify]").forEach((b) =>
    b.addEventListener("click", () => {
      // [BACKEND] En real: dispara alerta/priorización y notifica a la paciente
      toast(`Caso de ${b.dataset.notify} marcado como prioritario. Notificación enviada (simulada).`, "ok");
    })
  );
}
