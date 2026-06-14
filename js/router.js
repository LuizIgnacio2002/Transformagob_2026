/* ============================================================
   router.js — Enrutador hash (#/ruta) y armado del shell
   ------------------------------------------------------------
   Cada vista (App.views.*) expone { render(ctx) -> string, mount?(root, ctx) }.
   El router decide, según la sesión y el rol, qué vista mostrar y
   construye el shell (sidebar + topbar) para usuarios autenticados.
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const { getSession, clearSession } = App.store;
  const { ROUTES, APP } = App.config;
  const { t } = App.i18n;
  const { esc } = App.components;

  const VIEWS = App.views; // poblado por los scripts de js/views/*.js

  /* Iconos y etiquetas del menú por ruta */
  const MENU_META = {
    dashboard:      { icon: "🏠", i18n: "nav.dashboard" },
    ruta:           { icon: "🧭", i18n: "nav.ruta" },
    citas:          { icon: "📅", i18n: "nav.citas" },
    documentos:     { icon: "📎", i18n: "nav.documentos" },
    orientacion:    { icon: "💬", i18n: "nav.orientacion" },
    notificaciones: { icon: "🔔", i18n: "nav.notificaciones" },
    apoyo:          { icon: "💗", i18n: "nav.apoyo" },
    perfil:         { icon: "👤", i18n: "nav.perfil" },
    panel:          { icon: "📊", i18n: "nav.panel" },
    pacientes:      { icon: "👥", i18n: "nav.pacientes" },
    indicadores:    { icon: "📈", i18n: "nav.indicadores" },
  };

  function menuFor(role) {
    if (role === "admin") return ROUTES.ADMIN;
    if (role === "cuidadora") return ROUTES.CUIDADORA;
    return ROUTES.PACIENTE;
  }

  function currentRoute() {
    return (location.hash.replace(/^#\/?/, "").split("?")[0]) || "";
  }

  /** Punto de entrada del router: se llama en cada cambio de hash. */
  async function renderRoute() {
    const session = getSession();
    const app = document.getElementById("app");

    // ----- Sin sesión: pantalla de login -----
    if (!session) {
      app.innerHTML = VIEWS.login.render();
      if (VIEWS.login.mount) VIEWS.login.mount(app);
      return;
    }

    const allowed = menuFor(session.role);
    let route = currentRoute();
    if (!allowed.includes(route)) {
      route = allowed[0];
      location.hash = `#/${route}`;
      return; // el cambio de hash relanzará renderRoute
    }

    const view = VIEWS[route];
    const ctx = { session, route };

    // Shell con sidebar + topbar + contenedor de vista
    app.innerHTML = shellHTML(session, route);
    bindShell(app, session);

    const main = app.querySelector("#main-content");
    main.innerHTML = `<div class="loading muted">Cargando…</div>`;

    try {
      main.innerHTML = await view.render(ctx);
      if (view.mount) await view.mount(main, ctx);
    } catch (err) {
      main.innerHTML = `<div class="card"><h3>Ups…</h3><p class="muted">${esc(err.message || "Error al cargar la vista.")}</p></div>`;
      console.error(err);
    }
    if (main.focus) main.focus();
  }

  function shellHTML(session, route) {
    const items = menuFor(session.role).map((r) => {
      const m = MENU_META[r];
      const active = r === route ? 'aria-current="page"' : "";
      return `<button class="nav-link" data-nav="${r}" ${active}>
        <span class="ico" aria-hidden="true">${m.icon}</span>
        <span data-i18n="${m.i18n}">${t(m.i18n)}</span>
      </button>`;
    }).join("");

    const roleLabel = { paciente: "Paciente", cuidadora: "Cuidadora", admin: "Equipo INEN" }[session.role] || "";

    return `
      <div class="shell">
        <aside class="sidebar">
          <div class="sidebar__brand">
            <span class="sidebar__brand-logo" aria-hidden="true">
              <img src="assets/favicon.svg" alt="" width="26" height="26" />
            </span>
            <span class="sidebar__brand-text">
              <strong>OncoRuta</strong>
              <span>Mujer Inteligente</span>
            </span>
          </div>
          <nav aria-label="Menú principal">${items}</nav>
          <div class="sidebar__footer">
            <div>${esc(roleLabel)} · ${esc(session.user)}</div>
            <button class="nav-link" data-action="logout" style="margin-top:.4rem">
              <span class="ico">↩</span><span>${t("action.logout")}</span>
            </button>
            <div style="margin-top:.6rem;opacity:.7">${esc(APP.version)}</div>
          </div>
        </aside>

        <header class="topbar">
          <button class="a11y-btn topbar__menu-btn" data-action="toggle-nav" aria-label="Abrir menú">☰</button>
          <span class="topbar__title" data-i18n="${MENU_META[route].i18n}">${t(MENU_META[route].i18n)}</span>
          <span class="topbar__spacer"></span>
          <span class="badge badge--accent">INEN · Transformagob 2026</span>
        </header>

        <main id="main-content" class="main" tabindex="-1" aria-label="Contenido principal"></main>
      </div>`;
  }

  function bindShell(app, session) {
    app.querySelectorAll("[data-nav]").forEach((btn) =>
      btn.addEventListener("click", () => {
        location.hash = `#/${btn.dataset.nav}`;
        document.body.classList.remove("nav-open");
      })
    );
    const logoutBtn = app.querySelector('[data-action="logout"]');
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
      clearSession();
      location.hash = "#/";
      renderRoute();
    });
    const navBtn = app.querySelector('[data-action="toggle-nav"]');
    if (navBtn) navBtn.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  function initRouter() {
    window.addEventListener("hashchange", renderRoute);
    window.addEventListener("lang:change", renderRoute); // re-render al cambiar idioma
  }

  App.router = { renderRoute, initRouter };
})();
