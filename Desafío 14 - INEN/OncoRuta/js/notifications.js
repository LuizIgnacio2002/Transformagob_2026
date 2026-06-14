/* ============================================================
   notifications.js — Toasts y anuncios accesibles
   ============================================================ */

const root = () => document.getElementById("toast-root");
const live = () => document.getElementById("a11y-live");

/** Muestra una notificación tipo toast. type: ok | warn | info | "" */
export function toast(message, type = "", { timeout = 4000 } = {}) {
  const node = document.createElement("div");
  node.className = `toast ${type ? "toast--" + type : ""}`;
  node.setAttribute("role", "status");
  node.innerHTML = `
    <span>${message}</span>
    <button class="toast__close" aria-label="Cerrar notificación">✕</button>`;
  node.querySelector(".toast__close").addEventListener("click", () => node.remove());
  root().appendChild(node);
  announce(message);
  if (timeout) setTimeout(() => node.remove(), timeout);
}

/** Anuncia un mensaje en la región aria-live (lectores de pantalla). */
export function announce(message) {
  const region = live();
  if (!region) return;
  region.textContent = "";
  // pequeño retraso para asegurar que el lector detecte el cambio
  setTimeout(() => { region.textContent = message; }, 50);
}
