/* ============================================================
   app.js — Punto de entrada / bootstrap de la aplicación
   ------------------------------------------------------------
   Orquesta el arranque: carga preferencias, monta accesibilidad,
   inicializa el router y renderiza la ruta inicial.
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});

  function boot() {
    // 1) Recuperar sesión y preferencias persistidas
    App.store.loadFromStorage();

    // 2) Aplicar preferencias de accesibilidad (idioma, contraste, tamaño)
    App.a11y.applyPrefs();

    // 3) Montar panel flotante de accesibilidad y delegación de "leer en voz alta"
    App.a11y.mountA11yPanel();
    App.a11y.initTTSDelegation();

    // 4) Inicializar enrutador y pintar la vista correspondiente
    App.router.initRouter();

    // Ruta por defecto si no hay hash
    if (!location.hash) location.hash = "#/";
    App.router.renderRoute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
