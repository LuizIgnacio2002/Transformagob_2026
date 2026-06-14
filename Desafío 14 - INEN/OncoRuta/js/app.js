/* ============================================================
   app.js — Punto de entrada / bootstrap de la aplicación
   ------------------------------------------------------------
   Orquesta el arranque: carga preferencias, monta accesibilidad,
   inicializa el router y renderiza la ruta inicial.
   ============================================================ */

import { loadFromStorage } from "./store.js";
import { applyPrefs, mountA11yPanel, initTTSDelegation } from "./a11y.js";
import { initRouter, renderRoute } from "./router.js";

function boot() {
  // 1) Recuperar sesión y preferencias persistidas
  loadFromStorage();

  // 2) Aplicar preferencias de accesibilidad (idioma, contraste, tamaño)
  applyPrefs();

  // 3) Montar panel flotante de accesibilidad y delegación de "leer en voz alta"
  mountA11yPanel();
  initTTSDelegation();

  // 4) Inicializar enrutador y pintar la vista correspondiente
  initRouter();

  // Ruta por defecto si no hay hash
  if (!location.hash) location.hash = "#/";
  renderRoute();
}

document.addEventListener("DOMContentLoaded", boot);
