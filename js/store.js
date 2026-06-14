/* ============================================================
   store.js — Estado global mínimo + persistencia de sesión
   ------------------------------------------------------------
   Simula la persistencia de la "sesión" en localStorage. En un
   sistema real, el token de sesión viviría en una cookie segura
   (HttpOnly) gestionada por el backend.
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const { STORAGE_KEY } = App.config;

  const state = {
    session: null, // { user, role, patientId, token }
    prefs: { lang: "es", fontScale: 1, contrast: "normal", readable: "off" },
  };

  const listeners = new Set();

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ session: state.session, prefs: state.prefs }));
    } catch (_) { /* almacenamiento no disponible: la app sigue funcionando en memoria */ }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.session) state.session = parsed.session;
        if (parsed.prefs) state.prefs = { ...state.prefs, ...parsed.prefs };
      }
    } catch (_) { /* ignorar */ }
  }

  function getState() { return state; }
  function getSession() { return state.session; }

  function setSession(session) { state.session = session; persist(); emit(); }
  function clearSession() { state.session = null; persist(); emit(); }

  function getPrefs() { return state.prefs; }
  function setPref(key, value) { state.prefs[key] = value; persist(); emit(); }

  /* Suscripción simple (patrón observador) */
  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  function emit() { listeners.forEach((fn) => fn(state)); }

  App.store = {
    loadFromStorage, getState, getSession, setSession, clearSession,
    getPrefs, setPref, subscribe,
  };
})();
