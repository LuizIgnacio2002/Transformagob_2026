/* ============================================================
   mockData.js — Datos simulados (anonimizados / ficticios)
   ------------------------------------------------------------
   Todos los datos son FICTICIOS y representan información agregada o
   de ejemplo. Cumple la restricción del reto: NO se usan historias
   clínicas reales. Las cifras institucionales provienen de los
   documentos del desafío (aperturas de HC, tiempos REFCON, etc.).

   Se expone en window.App.data (scripts clásicos, sin ES Modules).
   ============================================================ */
(function () {
  "use strict";
  const App = (window.App = window.App || {});

  /* ---------- Etapas de la ruta diagnóstica (modelo de navegación) ----------
     Derivadas del flujo BPMN y de los 9 hitos del recorrido físico del INEN,
     traducidas a lenguaje claro y centrado en la paciente. */
  const ROUTE_TEMPLATE = [
    {
      key: "referencia",
      title: "Referencia recibida",
      short: "Tu establecimiento de salud envió tu caso al INEN.",
      desc: "Tu IPRESS o seguro (IAFAS) envió tu referencia y documentos clínicos al INEN a través del sistema REFCON. Aquí empieza tu ruta.",
      location: "Sistema REFCON (en línea)",
      responsible: "Establecimiento de origen",
      docs: ["Solicitud de referencia", "Hoja de referencia", "Documentos clínicos", "Documento de autorización"],
      tips: "No necesitas viajar para esta etapa. La gestionan entre tu hospital de origen y el INEN.",
    },
    {
      key: "admision",
      title: "Evaluación de admisión",
      short: "Un médico revisa que tu caso cumpla los criterios de atención.",
      desc: "Un médico del INEN evalúa tus documentos según los criterios de admisión. Si todo está conforme, se determina la especialidad que te atenderá.",
      location: "INEN · Admisión",
      responsible: "Médico de admisión",
      docs: ["Documento de identidad (DNI)", "Documentos clínicos"],
      tips: "Si falta algún documento, te avisaremos por esta app y por mensaje. Así evitas un viaje en vano.",
    },
    {
      key: "hc",
      title: "Apertura de Historia Clínica",
      short: "Se crea tu Historia Clínica (HC) en el sistema del INEN.",
      desc: "El personal administrativo abre tu Historia Clínica en el sistema SISINEN. Con tu HC ya puedes ser programada para tu primera cita.",
      location: "INEN · Módulo de Admisión",
      responsible: "Auxiliar administrativo",
      docs: ["DNI", "Hoja de referencia aprobada"],
      tips: "Lleva tu DNI físico. Si vienes de provincia, este trámite y tu primera cita pueden coordinarse el mismo día.",
    },
    {
      key: "cita1",
      title: "Programación de primera cita",
      short: "Se te asigna fecha y hora con el especialista.",
      desc: "Se verifica la disponibilidad de citas y se te asigna una fecha de atención con el médico especialista. Recibirás un recordatorio antes de tu cita.",
      location: "INEN · Programación de citas",
      responsible: "Técnico administrativo",
      docs: [],
      tips: "Esta etapa suele ser la más demorada (en promedio 3 a 4 días). Te avisaremos apenas tengas fecha confirmada.",
    },
    {
      key: "atencion1",
      title: "Primera atención (especialista)",
      short: "Tu primera consulta con el médico especialista.",
      desc: "El médico especialista te evalúa por primera vez (evaluación inicial) y solicita los exámenes de apoyo al diagnóstico que necesites.",
      location: "INEN · Consultorios (Módulos M0–M4)",
      responsible: "Médico especialista",
      docs: ["DNI", "Exámenes previos (si tienes)"],
      tips: "Anota tus dudas antes de la consulta. Puedes venir acompañada por un familiar o cuidador.",
    },
    {
      key: "examenes",
      title: "Exámenes de apoyo al diagnóstico",
      short: "Te realizas los exámenes solicitados (imágenes, laboratorio, patología).",
      desc: "Se programan y realizan los exámenes (mamografía, ecografía, biopsia, laboratorio, etc.). Los resultados se envían a tu médico especialista.",
      location: "INEN · Procesos de apoyo al diagnóstico",
      responsible: "Áreas de exámenes",
      docs: ["DNI", "Orden de exámenes"],
      tips: "Algunos exámenes requieren preparación (ayuno, etc.). Revisa las indicaciones en esta app.",
    },
    {
      key: "diagnostico",
      title: "Cita de diagnóstico",
      short: "El médico te explica tus resultados y los siguientes pasos.",
      desc: "El médico especialista revisa contigo el informe de los exámenes y te entrega el diagnóstico, definiendo el plan de tratamiento o seguimiento.",
      location: "INEN · Consultorios",
      responsible: "Médico especialista",
      docs: ["DNI"],
      tips: "Pregunta todo lo que necesites. Tienes derecho a una explicación clara y en tu idioma.",
    },
  ];

  /* ---------- Pacientes ficticios (basados en las personas del reto) ---------- */
  const PATIENTS = {
    "P-001": {
      id: "P-001",
      name: "María Quispe Huamán",
      alias: "María",
      age: 52,
      origin: "Ayacucho",
      diagnosisFocus: "Sospecha de cáncer de mama",
      digitalLevel: "Básico",
      languages: ["Quechua", "Español"],
      vulnerabilities: ["Paciente de provincia", "Barrera idiomática", "Conectividad limitada"],
      hc: "HC-2026-04412",
      refcon: "REF-AYAC-008812",
      currentStep: "cita1", // etapa en curso
      caregiver: "Ana (hija)",
    },
    "P-002": {
      id: "P-002",
      name: "Rosa Medina Flores",
      alias: "Rosa",
      age: 38,
      origin: "Lima",
      diagnosisFocus: "Cáncer de mama en seguimiento",
      digitalLevel: "Intermedio",
      languages: ["Español"],
      vulnerabilities: ["Jefa de hogar", "Poco tiempo disponible"],
      hc: "HC-2026-03980",
      refcon: "REF-LIMA-005521",
      currentStep: "examenes",
      caregiver: null,
    },
  };

  /* Estados por etapa para cada paciente (done | current | pending) con fechas */
  const PATIENT_PROGRESS = {
    "P-001": {
      referencia:  { state: "done",    date: "2026-05-28" },
      admision:    { state: "done",    date: "2026-06-03" },
      hc:          { state: "done",    date: "2026-06-05" },
      cita1:       { state: "current", date: "2026-06-16", time: "09:30", note: "Cita confirmada con Ginecología Oncológica." },
      atencion1:   { state: "pending" },
      examenes:    { state: "pending" },
      diagnostico: { state: "pending" },
    },
    "P-002": {
      referencia:  { state: "done", date: "2026-04-10" },
      admision:    { state: "done", date: "2026-04-14" },
      hc:          { state: "done", date: "2026-04-15" },
      cita1:       { state: "done", date: "2026-04-22", time: "11:00" },
      atencion1:   { state: "done", date: "2026-05-06" },
      examenes:    { state: "current", date: "2026-06-18", time: "08:00", note: "Mamografía + ecografía mamaria programada." },
      diagnostico: { state: "pending" },
    },
  };

  /* ---------- Citas ---------- */
  const APPOINTMENTS = {
    "P-001": [
      { id: "C-101", title: "Primera cita · Ginecología Oncológica", date: "2026-06-16", time: "09:30", place: "Módulo M2 - Consultorio 27", status: "confirmada", prep: "Lleva tu DNI y tus exámenes previos." },
      { id: "C-102", title: "Charla de orientación (Club de la Mama)", date: "2026-06-20", time: "16:00", place: "Virtual (videollamada)", status: "opcional", prep: "Conéctate desde tu celular." },
    ],
    "P-002": [
      { id: "C-201", title: "Mamografía + ecografía mamaria", date: "2026-06-18", time: "08:00", place: "Área de Imágenes - Piso 1", status: "confirmada", prep: "No uses desodorante ni crema el día del examen." },
      { id: "C-202", title: "Control con especialista", date: "2026-06-30", time: "10:15", place: "Módulo M1 - Consultorio 18", status: "pendiente", prep: "Trae el resultado de tus exámenes." },
    ],
  };

  /* ---------- Notificaciones / alertas ---------- */
  const NOTIFICATIONS = {
    "P-001": [
      { id: "N-1", type: "cita", icon: "📅", title: "Recordatorio de cita", body: "Tu primera cita es el 16/06 a las 09:30 en el Módulo M2, consultorio 27.", time: "Hace 2 horas", unread: true },
      { id: "N-2", type: "hito", icon: "✅", title: "Historia Clínica aperturada", body: "Tu HC fue creada correctamente. Ya puedes ser programada.", time: "Ayer", unread: true },
      { id: "N-3", type: "info", icon: "🌐", title: "Atención en tu idioma", body: "Puedes solicitar apoyo en quechua para tu próxima cita.", time: "Hace 2 días", unread: false },
    ],
    "P-002": [
      { id: "N-4", type: "examen", icon: "🔬", title: "Preparación para tu examen", body: "Recuerda: no uses desodorante el día de tu mamografía (18/06).", time: "Hace 1 hora", unread: true },
      { id: "N-5", type: "cita", icon: "📅", title: "Nueva cita pendiente de confirmar", body: "Control con especialista el 30/06. Confirma tu asistencia.", time: "Hace 3 días", unread: false },
    ],
  };

  /* ---------- Documentos (simulados) ---------- */
  const DOCUMENTS = {
    "P-001": [
      { id: "D-1", name: "Hoja de referencia (REFCON).pdf", kind: "referencia", date: "2026-05-28", status: "validado" },
      { id: "D-2", name: "DNI - escaneado.jpg", kind: "identidad", date: "2026-06-03", status: "validado" },
    ],
    "P-002": [
      { id: "D-3", name: "Resultado ecografía previa.pdf", kind: "examen", date: "2026-05-02", status: "validado" },
    ],
  };

  /* ---------- Orientación / Preguntas frecuentes (lenguaje claro) ---------- */
  const FAQ = [
    { q: "¿Qué es la ruta diagnóstica?", a: "Es el camino que sigues en el INEN desde que llega tu referencia hasta que recibes tu diagnóstico. Esta app te muestra en qué etapa estás y qué sigue, para que no te sientas perdida." },
    { q: "¿Por qué demora mi primera cita?", a: "La programación de la cita depende de la disponibilidad del especialista. En promedio toma de 3 a 4 días. Te avisaremos apenas tengas una fecha confirmada, para que no tengas que viajar sin necesidad." },
    { q: "Vengo de provincia, ¿puedo hacer todo el mismo día?", a: "Sí. Si vienes de una zona alejada, coordinamos para que la apertura de tu Historia Clínica y tu primera cita se gestionen juntas y reduzcas viajes a Lima." },
    { q: "¿Puedo ser atendida en quechua?", a: "Sí. Puedes activar el idioma quechua en esta app (botón de Accesibilidad) y solicitar apoyo de orientación en quechua para tus citas." },
    { q: "¿Puede acompañarme un familiar?", a: "Claro. Un familiar o cuidador puede acompañarte y también puede tener acceso a tu ruta y recordatorios desde su propio celular, si tú lo autorizas." },
    { q: "¿Mis datos están protegidos?", a: "Sí. El sistema cumple la Ley N.° 29733 de Protección de Datos Personales y la Ley General de Salud. Tu información es confidencial." },
  ];

  /* ---------- Red de apoyo (Club de la Mama) ---------- */
  const SUPPORT_POSTS = [
    { id: "S-1", author: "Carmen (sobreviviente y voluntaria)", role: "Club de la Mama", text: "Mujeres, no tengan miedo de preguntar. Yo también pasé por esto y hoy acompaño a otras. ¡No están solas! 💗", time: "Hace 1 día", likes: 24 },
    { id: "S-2", author: "Equipo de Enfermería INEN", role: "Orientación", text: "Recuerden traer su DNI y sus exámenes previos a la primera cita. Si tienen dudas, escríbannos por aquí.", time: "Hace 2 días", likes: 12 },
    { id: "S-3", author: "Rosa M.", role: "Paciente", text: "Gracias a los recordatorios ya no se me pasan las citas. Antes perdía días enteros esperando.", time: "Hace 3 días", likes: 31 },
  ];

  /* ============================================================
     DATOS INSTITUCIONALES (panel admin) — cifras de los documentos
     ============================================================ */

  /* Aperturas de HC, periodo 01–31/03/2025 (de "Cantidad de apertura de HC") */
  const HC_OPENINGS = {
    period: "01/03/2025 – 31/03/2025",
    conReferencia: 526,
    refcon: 434,
    manual: 92,
    sinReferencia: 669,
    get total() { return this.conReferencia + this.sinReferencia; }, // 1195
    porServicio: [
      { servicio: "ABDOMEN", refcon: 61, manual: 14, sinRef: 136 },
      { servicio: "RT", refcon: 73, manual: 12, sinRef: 1 },
      { servicio: "MTB", refcon: 55, manual: 11, sinRef: 110 },
      { servicio: "GINECOLOGIA", refcon: 50, manual: 12, sinRef: 113 },
      { servicio: "UROLOGIA", refcon: 49, manual: 4, sinRef: 87 },
      { servicio: "MEDICINA NUCLEAR", refcon: 41, manual: 3, sinRef: 3 },
      { servicio: "MEDICINA", refcon: 24, manual: 8, sinRef: 69 },
      { servicio: "CYC", refcon: 22, manual: 7, sinRef: 66 },
    ],
  };

  /* Días de atención de referencias por REFCON — 2026 */
  const REFCON_DAYS = {
    objetivo: 22,
    promedio: 11.54,
    meses: [
      { mes: "Enero", dias: 9.60 },
      { mes: "Febrero", dias: 4.92 },
      { mes: "Marzo", dias: 20.10 },
      { mes: "Abril", dias: 10.44 },
      { mes: "Mayo", dias: 12.63 },
    ],
  };

  /* Programación de primera cita (de "PPT obtención de primera cita") */
  const FIRST_APPT_STATS = {
    promedioTexto: "3 días 14 h 53 min",
    min: "15 min",
    max: "9 días 15 h",
    mayorA1dia: 93.3,
    menorA1dia: 6.7,
    distribucion: [
      { rango: "< 1 día", casos: 780 },
      { rango: "1-2 días", casos: 2470 },
      { rango: "2-3 días", casos: 1340 },
      { rango: "3-4 días", casos: 1870 },
      { rango: "4-5 días", casos: 1150 },
      { rango: "5-6 días", casos: 2020 },
      { rango: "6-7 días", casos: 1020 },
      { rango: "7-8 días", casos: 240 },
      { rango: "8-9 días", casos: 130 },
      { rango: "> 9 días", casos: 10 },
    ],
  };

  /* Casos nuevos por estadio clínico (de la PPT oficial) */
  const STAGE_STATS = [
    { estadio: "Estadio I", casos: 19212, pct: 7.14, color: "#2a9d8f" },
    { estadio: "Estadio II", casos: 33734, pct: 12.54, color: "#6fc3b9" },
    { estadio: "Estadio III", casos: 38075, pct: 14.15, color: "#db2777" },
    { estadio: "Estadio IV", casos: 39999, pct: 14.87, color: "#9d174d" },
    { estadio: "No registrado", casos: 137983, pct: 51.29, color: "#94a3b8" },
  ];

  /* Lista de pacientes para el panel institucional (priorización) */
  const ADMIN_PATIENTS = [
    { id: "P-001", name: "María Q. H.", edad: 52, origen: "Ayacucho", foco: "Mama", etapa: "Programación de cita", dias: 8, prioridad: "alta", vulnerable: true },
    { id: "P-002", name: "Rosa M. F.", edad: 38, origen: "Lima", foco: "Mama", etapa: "Exámenes", dias: 3, prioridad: "media", vulnerable: true },
    { id: "P-003", name: "Lucía T. R.", edad: 61, origen: "Huancavelica", foco: "Cuello uterino", etapa: "Admisión", dias: 12, prioridad: "alta", vulnerable: true },
    { id: "P-004", name: "Gloria S. P.", edad: 44, origen: "Lima", foco: "Cuello uterino", etapa: "Cita de diagnóstico", dias: 2, prioridad: "baja", vulnerable: false },
    { id: "P-005", name: "Inés V. C.", edad: 57, origen: "Junín", foco: "Mama", etapa: "Primera atención", dias: 6, prioridad: "media", vulnerable: true },
  ];

  App.data = {
    ROUTE_TEMPLATE, PATIENTS, PATIENT_PROGRESS, APPOINTMENTS, NOTIFICATIONS,
    DOCUMENTS, FAQ, SUPPORT_POSTS, HC_OPENINGS, REFCON_DAYS, FIRST_APPT_STATS,
    STAGE_STATS, ADMIN_PATIENTS,
  };
})();
