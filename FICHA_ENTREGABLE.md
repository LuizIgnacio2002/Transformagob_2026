# FICHA ENTREGABLE DE PROPUESTA DE SOLUCIÓN
### Hackatón Nacional Transformagob 2026

---

## 1. Datos generales

| Campo | Información |
|---|---|
| **Desafío seleccionado** | Desafío 14 – INEN (Instituto Nacional de Enfermedades Neoplásicas) |
| **Título de la solución** | **OncoRuta Mujer Inteligente** — Navegador digital del paciente para el diagnóstico oncológico oportuno, equitativo, inclusivo e intercultural |
| **Nombre del equipo** | _[Completar: nombre del equipo o, si es individual, tu nombre]_ |
| **Nombre y apellido del representante del equipo** | _[Completar: representante del equipo]_ |

---

## 2. Descripción de la solución

### Solución propuesta

**OncoRuta Mujer Inteligente** es un **sistema digital de navegación del paciente** (*patient navigation*) que acompaña a las mujeres de 30 a 65 años en situación de vulnerabilidad —con sospecha de cáncer de mama o cuello uterino atendidas en el INEN— a lo largo de **todo su proceso diagnóstico**, atacando directamente la **tensión central del desafío: las demoras y la fragmentación del recorrido diagnóstico**.

La solución traduce el complejo flujo institucional (BPMN con 5 carriles: IAFAS/IPRESS, Médico, Auxiliar, Especialista y Apoyo al diagnóstico) y los **9 hitos del recorrido físico** en una **ruta clara de 7 etapas centradas en la paciente**, mostrándole en todo momento *en qué etapa está, qué sigue, qué necesita llevar y cuánto puede demorar*. Sobre esa base aporta tres respuestas de valor público:

1. **Reduce la incertidumbre y la ansiedad** (insight clave del trabajo de campo): la paciente deja de "ir de un servicio a otro sin que nadie le explique".
2. **Reduce viajes y trámites innecesarios** —crítico para el 70 % de pacientes que se desplazaban repetidamente y para quienes vienen de provincia— mediante recordatorios, alertas y carga anticipada de documentos.
3. **Equidad, inclusión e interculturalidad reales**: interfaz **bilingüe español/quechua**, **lectura en voz alta**, texto ampliable y alto contraste (WCAG), pensada desde los 5 perfiles de usuaria (de nivel digital "muy bajo" a "alto").

**Elementos diferenciales que el laboratorio no había contemplado explícitamente** (valor agregado):
- **Acceso para cuidadora/familiar autorizado**, que sigue la ruta y recibe los recordatorios desde su propio celular (responde a la persona "Ana, hija cuidadora").
- **Red de apoyo entre pares** integrada al flujo (Club de la Mama y sobrevivientes voluntarias), convirtiendo el acompañamiento emocional en una funcionalidad, no en un anexo.
- **Panel institucional con priorización de pacientes vulnerables** basado en tiempo de espera y condición de vulnerabilidad, que transforma los datos de demora (REFCON, programación de cita) en una herramienta de gestión proactiva para el INEN.

### Funcionamiento del prototipo

El prototipo es una **aplicación web funcional y navegable (SPA)** con autenticación por rol y backend simulado. Secuencia de uso:

1. **Inicio de sesión por rol** (paciente / cuidadora / equipo INEN). Incluye cuentas de demostración de un clic.
2. **Panel de inicio (paciente)**: saludo personalizado + KPIs (avance de la ruta, próxima cita, avisos, N.° de HC/REFCON) y, destacado, **"Tu siguiente paso"** con lugar, fecha, responsable, consejo y botón *Escuchar*.
3. **Mi ruta diagnóstica**: línea de tiempo de las **7 etapas** (Referencia REFCON → Admisión → Apertura de HC → Programación de 1.ª cita → Primera atención → Exámenes de apoyo → Cita de diagnóstico) con estado *completado / en curso / pendiente*, más el **mapa de los 9 hitos físicos** del INEN.
4. **Mis citas**: detalle, preparación, **confirmación de asistencia** y **recordatorios** (con aviso por SMS simulado para conectividad limitada).
5. **Notificaciones**: recordatorios de citas, alertas de exámenes e hitos; marcado como leído.
6. **Mis documentos**: **carga simulada** de cualquier archivo (referencia, DNI, exámenes) para reducir trámites presenciales.
7. **Orientación**: preguntas frecuentes en lenguaje claro, con lectura en voz alta y enfoque intercultural.
8. **Red de apoyo**: muro moderado del Club de la Mama.
9. **Panel institucional (equipo INEN)**: indicadores reales del desafío (1,195 aperturas de HC; 11.54 días promedio REFCON; 93.3 % de citas que tardan +1 día; 51.29 % sin estadio clínico), **gráficos** y **lista priorizada de pacientes**.

> **Backend simulado y trazable:** toda interacción con servidor está encapsulada en `js/api.js` y marcada con el comentario `// [BACKEND]`, mostrando el endpoint real equivalente (p. ej. `POST /auth/login`, `GET /patients/:id/journey`). Esto hace la migración a producción **directa y predecible** (basta reemplazar cada simulación por un `fetch` seguro).

### Componentes abiertos y reutilizables

- **Stack 100 % abierto y sin dependencias propietarias**: HTML5 + CSS3 + JavaScript estándar (sin frameworks, sin librerías de pago, sin *lock-in*). Funciona abriendo `index.html` directamente o en cualquier hosting estático (GitHub Pages, etc.).
- **Arquitectura modular reutilizable** (un archivo por responsabilidad, registrados en `window.App`):
  - `i18n.js` — **módulo de internacionalización es/qu** reutilizable por otras entidades públicas.
  - `a11y.js` — **módulo de accesibilidad** (escala de fuente, alto contraste, lectura fácil, texto a voz, cambio de idioma) **transversal y reaprovechable** en cualquier servicio digital del Estado.
  - `components.js` — librería propia de componentes (tarjetas KPI, línea de tiempo, gráficos de barras y *donut* sin librerías externas).
  - `api.js` — **capa de servicio desacoplada**: contrato de datos documentado que cualquier equipo puede conectar a SISINEN/REFCON.
- **Diseño orientado a interoperabilidad progresiva**: el modelo de datos refleja entidades institucionales reales (HC, REFCON, IAFAS/IPRESS, hitos del BPMN), facilitando la integración por etapas **sin afectar la operación clínica**.
- **Documentación completa para reutilización**: `README.md` (arquitectura, credenciales, ejecución), `COMO_DESPLEGAR.txt` (despliegue) y comentarios en español en todo el código.
- **Cumplimiento del marco normativo peruano**: alineado con la **interoperabilidad y reutilización del Estado (D. L. 1412, art. 29 – Gobierno Digital)**, la **Ley N.° 29733 de Protección de Datos Personales** y la **Ley General de Salud**.

### Riesgos identificados y mitigación

| Riesgo | Mitigación |
|---|---|
| **Protección de datos personales sensibles de salud** (Ley N.° 29733) | En el prototipo **no se usan historias clínicas reales** (datos ficticios). En producción: cifrado en tránsito (HTTPS) y reposo, consentimiento informado, minimización de datos, control de acceso por rol y seudonimización. |
| **Baja interoperabilidad** con sistemas aislados (SISINEN, REFCON, Correo) | Capa de servicio desacoplada (`api.js`) e **integración progresiva** vía estándares de gobierno digital; no requiere reemplazar los sistemas existentes. |
| **Conectividad limitada** (pacientes de provincia / zonas alejadas) | Diseño ligero (carga rápida, sin dependencias pesadas), **recordatorios por SMS** como canal alternativo y funcionamiento incluso sin servidor. |
| **Brecha de alfabetización digital** (perfiles "muy bajo") | Interfaz simple, letras grandes, **lectura en voz alta**, lenguaje claro y **acceso para cuidador/familiar**. |
| **Barrera idiomática y cultural** (quechua) | Interfaz bilingüe es/qu y orientación intercultural; ampliable a más lenguas. |
| **Riesgo clínico / expectativas** | La app **no realiza diagnóstico ni sustituye la decisión médica**; mensajes explícitos de "no reemplaza la atención médica" y derivación a emergencia. |
| **Adopción institucional y del personal** | Onboarding sencillo, panel de gestión que aporta valor al INEN (priorización) y ruta de continuidad con el Club de la Mama para validación con usuarias reales. |

### Próximos pasos sugeridos para el prototipo/solución

1. **Validación con usuarias reales** (Club de la Mama y voluntarias) y ajustes de UX e interculturalidad.
2. **Integración progresiva** con SISINEN y REFCON vía API segura, partiendo del estado de la referencia y la programación de citas (mayor cuello de botella: 93.3 % de citas tardan +1 día).
3. **Habilitar canal de notificaciones real** (SMS/WhatsApp/mensajería) para pacientes con conectividad limitada.
4. **Auditoría de seguridad y privacidad** y modelo de consentimiento conforme a la Ley N.° 29733; **certificación de accesibilidad** (lineamientos PCM/WCAG).
5. **Piloto controlado** en una especialidad de alta demanda (p. ej., Ginecología o MTB) con métricas de reducción de demoras y diagnósticos tempranos.
6. **Ampliación funcional**: más lenguas originarias, tele-orientación, y módulo analítico predictivo de priorización para el equipo INEN.
7. **Incubación institucional** dentro del compromiso post-hackatón del INEN (evaluación, incubación y pilotaje de la solución ganadora).

---

> 📦 **Prototipo y documentación técnica:** repositorio del proyecto (app web funcional `index.html`, código fuente comentado en `/js` y `/css`, `README.md` y `COMO_DESPLEGAR.txt`). Cuentas de demostración: `maria/123` (paciente), `ana/123` (cuidadora), `admin/123` (equipo INEN).

*Hackatón Transformagob 2026 · INEN · #PorUnPerúDigital*
