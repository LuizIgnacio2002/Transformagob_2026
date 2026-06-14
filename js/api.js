/* ============================================================
   api.js — BACKEND SIMULADO
   ------------------------------------------------------------
   ⚠️  IMPORTANTE: Aquí NO hay un servidor real. Cada función
   simula una llamada al backend del INEN devolviendo una Promesa
   con una pequeña demora (setTimeout) para imitar la red.

   En una implementación real, cada `mockRequest(...)` se
   reemplazaría por un `fetch()` a un endpoint seguro (HTTPS),
   con token de sesión y cumpliendo la Ley N.° 29733 de
   Protección de Datos Personales. Esos puntos están marcados
   con el comentario  // [BACKEND]  a lo largo del archivo.
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});
  const { DEMO_USERS } = App.config;
  const {
    PATIENTS, PATIENT_PROGRESS, ROUTE_TEMPLATE, APPOINTMENTS,
    NOTIFICATIONS, DOCUMENTS, SUPPORT_POSTS, ADMIN_PATIENTS,
  } = App.data;

  /** Simula latencia de red y resuelve con una copia de los datos. */
  function mockRequest(data, { ms = 350, failRate = 0 } = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulación opcional de error de red para demostrar manejo de fallos
        if (Math.random() < failRate) {
          reject(new Error("No se pudo conectar con el servidor del INEN. Intenta de nuevo."));
          return;
        }
        // Devolvemos copia profunda para que las vistas no muten los datos fuente
        resolve(JSON.parse(JSON.stringify(data)));
      }, ms);
    });
  }

  /* ---------- Autenticación ----------
     [BACKEND] POST /auth/login  -> valida credenciales contra ID Perú / DNI.
     Aquí validamos contra credenciales genéricas de demostración. */
  function login(username, password) {
    const u = (username || "").trim().toLowerCase();
    const found = DEMO_USERS.find((x) => x.user === u && x.pass === password);
    if (!found) {
      return mockRequest(null, { ms: 500 }).then(() => {
        throw new Error("Usuario o contraseña incorrectos. (Prueba: maria / 123)");
      });
    }
    const session = {
      user: found.user,
      role: found.role,
      patientId: found.patientId,
      token: "demo-token-" + Math.random().toString(36).slice(2), // token simulado
      loginAt: new Date().toISOString(),
    };
    return mockRequest(session, { ms: 500 });
  }

  /* ---------- Datos de la paciente ----------
     [BACKEND] GET /patients/:id  (requiere token y autorización del titular). */
  function getPatient(patientId) {
    return mockRequest(PATIENTS[patientId]);
  }

  /** Construye la ruta diagnóstica combinando la plantilla con el progreso.
      [BACKEND] GET /patients/:id/journey */
  function getJourney(patientId) {
    const progress = PATIENT_PROGRESS[patientId] || {};
    const journey = ROUTE_TEMPLATE.map((stage) => ({
      ...stage,
      ...(progress[stage.key] || { state: "pending" }),
    }));
    return mockRequest(journey);
  }

  /* [BACKEND] GET /patients/:id/appointments */
  function getAppointments(patientId) {
    return mockRequest(APPOINTMENTS[patientId] || []);
  }

  /* [BACKEND] GET /patients/:id/notifications */
  function getNotifications(patientId) {
    return mockRequest(NOTIFICATIONS[patientId] || []);
  }

  /* [BACKEND] GET /patients/:id/documents */
  function getDocuments(patientId) {
    return mockRequest(DOCUMENTS[patientId] || []);
  }

  /* ---------- Carga de documentos (SIMULADA) ----------
     [BACKEND] POST /patients/:id/documents  (multipart/form-data, antivirus,
     cifrado en reposo). Aquí NO se sube nada: solo simulamos el resultado
     exitoso con el nombre del archivo que la usuaria seleccione. */
  function uploadDocument(patientId, file) {
    // `file` puede ser un File real del input; solo usamos su nombre/metadato.
    const fakeDoc = {
      id: "D-" + Date.now(),
      name: (file && file.name) || "documento.pdf",
      kind: "adjunto",
      date: new Date().toISOString().slice(0, 10),
      status: "en revisión", // un humano lo validaría en el backend real
    };
    return mockRequest(fakeDoc, { ms: 900 });
  }

  /* ---------- Confirmar asistencia a cita (SIMULADO) ----------
     [BACKEND] PATCH /appointments/:id  { status: "confirmada" } */
  function confirmAppointment(appointmentId) {
    return mockRequest({ id: appointmentId, status: "confirmada" }, { ms: 600 });
  }

  /* ---------- Red de apoyo ----------
     [BACKEND] GET/POST /community/posts (moderado) */
  function getSupportPosts() {
    return mockRequest(SUPPORT_POSTS);
  }

  /* ---------- Panel institucional ----------
     [BACKEND] GET /admin/patients (requiere rol y consentimiento; datos
     anonimizados/seudonimizados según Ley N.° 29733). */
  function getAdminPatients() {
    return mockRequest(ADMIN_PATIENTS);
  }

  App.api = {
    login, getPatient, getJourney, getAppointments, getNotifications,
    getDocuments, uploadDocument, confirmAppointment, getSupportPosts, getAdminPatients,
  };
})();
