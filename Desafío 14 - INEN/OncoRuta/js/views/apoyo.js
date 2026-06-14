/* ============================================================
   views/apoyo.js — Red de apoyo (Club de la Mama) y pares
   Canal organizado para grupos de apoyo / sobrevivientes voluntarias.
   ============================================================ */

import { getSupportPosts } from "../api.js";
import { esc } from "../components.js";
import { toast } from "../notifications.js";
import { t } from "../i18n.js";

export async function render() {
  const posts = await getSupportPosts();
  return `
  <div class="stack">
    <div class="page-head">
      <h1>💗 ${t("nav.apoyo")}</h1>
      <p>Un espacio acompañado por el <strong>Club de la Mama</strong>, sobrevivientes voluntarias
         y el equipo del INEN. No estás sola.</p>
    </div>

    <div class="card">
      <div class="card__title"><h3>Comparte o pregunta</h3></div>
      <textarea class="textarea" id="post-text" rows="2" placeholder="Escribe tu mensaje para la comunidad…"></textarea>
      <div class="row between" style="margin-top:.6rem">
        <span class="small muted">Mensajes moderados por el equipo de orientación.</span>
        <button class="btn btn--accent" id="post-send">Publicar</button>
      </div>
    </div>

    <div id="post-list" class="stack">
      ${posts.map(postCard).join("")}
    </div>

    <div class="card" style="background:var(--brand-50)">
      <strong>📅 Próxima charla virtual:</strong> "Tu primera cita en el INEN, paso a paso" —
      sábado 16:00, por videollamada. <em>(Inscripción simulada en este prototipo.)</em>
    </div>
  </div>`;
}

function postCard(p) {
  const initials = p.author.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return `
    <div class="post">
      <div class="post__head">
        <span class="post__avatar">${esc(initials)}</span>
        <div><strong>${esc(p.author)}</strong><div class="small muted">${esc(p.role)} · ${esc(p.time)}</div></div>
      </div>
      <p class="mb-0">${esc(p.text)}</p>
      <div class="row" style="margin-top:.6rem">
        <button class="btn btn--ghost" data-like>💗 <span>${p.likes}</span></button>
      </div>
    </div>`;
}

export function mount(root) {
  const text = root.querySelector("#post-text");
  const list = root.querySelector("#post-list");

  root.querySelector("#post-send").addEventListener("click", () => {
    const val = text.value.trim();
    if (!val) { toast("Escribe un mensaje antes de publicar.", "warn"); return; }
    // [BACKEND] En real: POST /community/posts (con moderación previa)
    const fake = { author: "Tú", role: "Paciente", text: val, time: "Ahora", likes: 0 };
    list.insertAdjacentHTML("afterbegin", postCard(fake));
    text.value = "";
    bindLikes(list);
    toast("Tu mensaje fue enviado a moderación.", "ok");
  });

  bindLikes(list);
}

function bindLikes(list) {
  list.querySelectorAll("[data-like]").forEach((b) => {
    if (b._bound) return; b._bound = true;
    b.addEventListener("click", () => {
      const span = b.querySelector("span");
      span.textContent = (+span.textContent + 1);
    });
  });
}
