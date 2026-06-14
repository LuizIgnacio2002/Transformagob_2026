/* ============================================================
   views/documentos.js — Mis documentos + carga SIMULADA
   ------------------------------------------------------------
   La carga de archivos está SIMULADA: se acepta cualquier archivo
   genérico y se simula el resultado exitoso (ver api.uploadDocument).
   No se sube nada a ningún servidor.
   ============================================================ */

import { getDocuments, uploadDocument } from "../api.js";
import { esc, badge, fmtDate, emptyState } from "../components.js";
import { toast } from "../notifications.js";
import { t } from "../i18n.js";

const KIND_ICON = { referencia: "📄", identidad: "🪪", examen: "🔬", adjunto: "📎" };

export async function render(ctx) {
  const docs = await getDocuments(ctx.session.patientId);
  return `
  <div class="stack">
    <div class="page-head">
      <h1>📎 ${t("nav.documentos")}</h1>
      <p>Adjunta tus documentos (referencia, DNI, exámenes) para agilizar tu atención.
         Así reduces trámites presenciales.</p>
    </div>

    <div class="card">
      <div class="card__title"><h3>Subir un documento</h3></div>
      <!-- Carga SIMULADA: cualquier archivo genérico sirve para la demostración -->
      <label class="dropzone" id="dropzone">
        <input type="file" id="file-input" hidden />
        <div style="font-size:2rem">⬆️</div>
        <strong>Haz clic para seleccionar un archivo</strong>
        <div class="muted small">PDF, imagen o documento · (la carga es simulada en este prototipo)</div>
      </label>
      <div class="small muted" style="margin-top:.6rem">🔒 Tus archivos se tratan según la Ley N.° 29733 de Protección de Datos Personales.</div>
    </div>

    <div class="card">
      <div class="card__title"><h3>Documentos registrados</h3></div>
      <div id="doc-list">
        ${docs.length ? docs.map(docRow).join("") : emptyState("📂", "Aún no tienes documentos.")}
      </div>
    </div>
  </div>`;
}

function docRow(d) {
  const kind = d.status === "validado" ? "ok" : "warn";
  return `
    <div class="doc-row">
      <span class="doc-ico">${KIND_ICON[d.kind] || "📎"}</span>
      <div style="flex:1">
        <strong>${esc(d.name)}</strong>
        <div class="muted small">${esc(d.kind)} · ${fmtDate(d.date)}</div>
      </div>
      ${badge(d.status, kind)}
    </div>`;
}

export function mount(root, ctx) {
  const input = root.querySelector("#file-input");
  const list = root.querySelector("#doc-list");

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    toast("Subiendo documento…", "info", { timeout: 1500 });
    try {
      // [BACKEND] api.uploadDocument está SIMULADO: no envía datos reales.
      const doc = await uploadDocument(ctx.session.patientId, file);
      // Si la lista estaba vacía, limpiamos el estado vacío
      if (list.querySelector(".empty")) list.innerHTML = "";
      list.insertAdjacentHTML("afterbegin", docRow(doc));
      toast(`"${doc.name}" cargado. Quedó en revisión.`, "ok");
    } catch (err) {
      toast(err.message, "warn");
    } finally {
      input.value = "";
    }
  });
}
