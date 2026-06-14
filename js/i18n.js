/* ============================================================
   i18n.js — Internacionalización (Español / Quechua)
   Enfoque intercultural exigido por el reto. El quechua cubre la
   interfaz esencial; los contenidos clínicos extensos permanecen en
   español con apoyo de lectura en voz alta.
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});

  const DICT = {
    es: {
      "nav.dashboard": "Inicio",
      "nav.ruta": "Mi ruta diagnóstica",
      "nav.citas": "Mis citas",
      "nav.documentos": "Mis documentos",
      "nav.orientacion": "Orientación",
      "nav.notificaciones": "Notificaciones",
      "nav.apoyo": "Red de apoyo",
      "nav.perfil": "Mi perfil",
      "nav.panel": "Panel institucional",
      "nav.pacientes": "Pacientes",
      "nav.indicadores": "Indicadores",
      "action.logout": "Cerrar sesión",
      "action.login": "Iniciar sesión",
      "action.readAloud": "Leer en voz alta",
      "greet.hello": "Hola",
      "greet.welcome": "Bienvenida a tu ruta de diagnóstico",
      "step.next": "Tu siguiente paso",
      "step.done": "Completado",
      "step.current": "En curso",
      "step.pending": "Pendiente",
      "a11y.title": "Accesibilidad",
      "a11y.fontSize": "Tamaño de letra",
      "a11y.contrast": "Alto contraste",
      "a11y.readable": "Lectura fácil",
      "a11y.language": "Idioma",
      "a11y.tts": "Leer página",
      "common.viewAll": "Ver todo",
      "common.location": "Lugar",
      "common.date": "Fecha",
      "common.status": "Estado",
    },
    qu: {
      "nav.dashboard": "Qallariy",
      "nav.ruta": "Hampikuy ñanniy",
      "nav.citas": "Tupanaykuna",
      "nav.documentos": "Qillqaykuna",
      "nav.orientacion": "Yanapakuy willay",
      "nav.notificaciones": "Willaykuna",
      "nav.apoyo": "Yanapaq masikuna",
      "nav.perfil": "Ñuqap willayniy",
      "nav.panel": "Wasipa panelnin",
      "nav.pacientes": "Onqoqkuna",
      "nav.indicadores": "Tupuykuna",
      "action.logout": "Lluqsiy",
      "action.login": "Yaykuy",
      "action.readAloud": "Kunka willay",
      "greet.hello": "Napaykullayki",
      "greet.welcome": "Hampikuy ñanniykiman allin hamuy",
      "step.next": "Qatiq ruwayniyki",
      "step.done": "Tukusqa",
      "step.current": "Ruwakuchkan",
      "step.pending": "Suyachkan",
      "a11y.title": "Yaykuna atiy",
      "a11y.fontSize": "Qillqa sayaynin",
      "a11y.contrast": "Sumaq rikuy",
      "a11y.readable": "Facil ñawinchay",
      "a11y.language": "Simi",
      "a11y.tts": "Pankata ñawinchay",
      "common.viewAll": "Llapanta qaway",
      "common.location": "Maypi",
      "common.date": "Pacha",
      "common.status": "Imayna",
    },
  };

  let current = "es";

  function setLang(lang) {
    current = DICT[lang] ? lang : "es";
    document.body.setAttribute("data-lang", current);
  }

  function getLang() { return current; }

  /** Traduce una clave; si no existe, devuelve la clave o el fallback. */
  function t(key, fallback) {
    return (DICT[current] && DICT[current][key]) || fallback || key;
  }

  App.i18n = { setLang, getLang, t };
})();
