/* ============================================================
   config.js — Constantes y configuración de la aplicación
   ------------------------------------------------------------
   Scripts clásicos (sin ES Modules) -> se registra en window.App
   para poder abrir index.html directamente (file://).
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});

  const APP = {
    name: "OncoRuta Mujer Inteligente",
    entity: "Instituto Nacional de Enfermedades Neoplásicas (INEN)",
    lab: "LABINEN",
    version: "1.0.0 (prototipo Hackatón Transformagob 2026)",
    supportPhone: "(01) 201-6500 anexo 1051 / 1071",
  };

  /*
    CREDENCIALES GENÉRICAS DE DEMOSTRACIÓN
    --------------------------------------
    En un sistema real, la autenticación se haría contra el backend del INEN
    (por ejemplo vía ID Perú / DNI + contraseña). Aquí se usan credenciales
    genéricas y públicas SOLO para fines de la maqueta navegable.

    >>> El "backend" está SIMULADO en js/api.js (no hay servidor real). <<<
  */
  const DEMO_USERS = [
    { user: "maria",    pass: "123", role: "paciente",  patientId: "P-001" },
    { user: "rosa",     pass: "123", role: "paciente",  patientId: "P-002" },
    { user: "ana",      pass: "123", role: "cuidadora", patientId: "P-001" }, // cuida a María
    { user: "usuario1", pass: "123", role: "paciente",  patientId: "P-001" },
    { user: "admin",    pass: "123", role: "admin",     patientId: null },
  ];

  /* Rutas de la SPA (hash router). Cada una mapea a una vista. */
  const ROUTES = {
    PACIENTE: ["dashboard", "ruta", "citas", "documentos", "orientacion", "notificaciones", "apoyo", "perfil"],
    CUIDADORA: ["dashboard", "ruta", "citas", "documentos", "notificaciones", "apoyo", "perfil"],
    ADMIN: ["panel", "pacientes", "indicadores", "perfil"],
  };

  /* Clave de almacenamiento local para simular la "sesión" y persistencia */
  const STORAGE_KEY = "oncoruta:v1";

  App.config = { APP, DEMO_USERS, ROUTES, STORAGE_KEY };
})();
