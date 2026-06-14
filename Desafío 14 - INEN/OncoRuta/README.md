# 🧭 OncoRuta Mujer Inteligente

### Sistema digital de navegación del paciente — INEN
**Hackatón Transformagob 2026 · Desafío 14 · Equipo LABINEN**

> *"Experiencia de diagnóstico oportuno, equitativo, inclusivo e intercultural"*

Prototipo funcional navegable que acompaña a **mujeres de 30 a 65 años en situación de
vulnerabilidad** con sospecha de **cáncer de mama o cuello uterino** atendidas en el
Instituto Nacional de Enfermedades Neoplásicas (INEN), ayudándolas a superar las demoras
y la fragmentación del proceso diagnóstico.

---

## 🎯 El problema

Las pacientes enfrentan procesos fragmentados, esperas prolongadas, falta de orientación
y ausencia de acompañamiento continuo. Cifras del propio INEN que sustentan el reto:

| Indicador | Dato |
|---|---|
| Aperturas de HC (marzo 2025) | **1,195** (526 con referencia + 669 sin referencia) |
| Referencias gestionadas por REFCON | **82.5%** (el resto, manual → baja interoperabilidad) |
| Días promedio de atención de referencias (REFCON 2026) | **11.54** (hasta 20 en marzo) |
| Programación de 1ª cita que tarda **+1 día** | **93.3%** (promedio: 3 días 14 h) |
| Casos nuevos **sin estadio clínico** registrado | **51.29%** |
| Casos diagnosticados en estadios avanzados (III–IV) | **~29%** |

---

## ✅ Cómo responde OncoRuta (funcionalidades mínimas exigidas)

| Requisito del reto | Implementación |
|---|---|
| **1. Centralizar el estado del caso y los siguientes pasos** | Vistas **Inicio** y **Mi ruta diagnóstica**: línea de tiempo de 7 etapas + mapa de los 9 hitos físicos del INEN, con estado (completado / en curso / pendiente). |
| **2. Recordatorios, alertas y notificaciones** | Vistas **Mis citas** (confirmar asistencia, recordatorios) y **Notificaciones** (citas, exámenes, hitos). |
| **3. Orientación clara, inclusiva e intercultural** | Vista **Orientación** (FAQ en lenguaje claro + lectura en voz alta), idioma **Español/Quechua**, alto contraste y texto ampliable. |

### Funcionalidades adicionales
- 🧑‍🤝‍🧑 **Acceso para cuidadora/familiar** (perfil "Ana" acompaña a "María").
- 💗 **Red de apoyo** (Club de la Mama y sobrevivientes voluntarias).
- 📎 **Carga de documentos** (simulada) para reducir trámites presenciales.
- 📊 **Panel institucional** (rol Equipo INEN) con indicadores y **priorización de pacientes vulnerables**.
- ♿ **Panel de accesibilidad** flotante (tamaño de letra, contraste, lectura fácil, idioma, leer página).

---

## ♿ Accesibilidad e interculturalidad

Diseñado para los **5 perfiles de usuaria** del reto (de nivel digital "muy bajo" a "alto"):

- **Multilingüe**: interfaz Español / Quechua (`js/i18n.js`).
- **Lectura en voz alta** (Web Speech API) para baja alfabetización o problemas visuales.
- **Texto ampliable** (90 %–160 %) y **alto contraste** (WCAG).
- **Lectura fácil**, navegación por teclado, `aria-live`, enlace de salto y foco visible.
- Diseño **responsive** (pensado para el celular).

---

## 🏗️ Arquitectura

SPA modular en **HTML + CSS + JavaScript (ES Modules) nativo, sin frameworks ni dependencias**.

```
OncoRuta/
├── index.html              # Shell + carga de módulos
├── assets/                 # logo.svg, favicon.svg
├── css/
│   ├── tokens.css          # Variables de diseño (paleta INEN + salud de la mujer)
│   ├── base.css            # Reset, tipografía, utilidades a11y
│   ├── layout.css          # Shell, sidebar, topbar, grids, responsive
│   ├── components.css      # Botones, tarjetas, timeline, tablas, charts, modales
│   ├── views.css           # Estilos por vista
│   └── accessibility.css   # Panel de accesibilidad
└── js/
    ├── app.js              # Bootstrap (punto de entrada)
    ├── config.js           # Constantes, credenciales demo, rutas por rol
    ├── i18n.js             # Traducciones es/qu
    ├── mockData.js         # Datos ficticios + cifras institucionales del reto
    ├── api.js              # ⚙️ BACKEND SIMULADO (promesas con latencia)
    ├── store.js            # Estado + persistencia de sesión (localStorage)
    ├── router.js           # Enrutador hash + armado del shell por rol
    ├── components.js       # Helpers de render (charts, badges, fechas…)
    ├── notifications.js    # Toasts + anuncios accesibles
    ├── a11y.js             # Accesibilidad e interculturalidad
    └── views/              # Una vista por archivo (dashboard, ruta, citas, …)
```

**Separación de responsabilidades**: datos (`mockData`) → backend simulado (`api`) →
estado (`store`) → enrutado (`router`) → vistas (`views/*`) → presentación (`css/*`).

---

## ⚙️ Backend simulado

> **No hay servidor real.** Todo el "backend" está simulado en `js/api.js`.

- Cada función devuelve una **Promesa con latencia** (`setTimeout`) que imita la red.
- Los puntos donde iría una llamada real al INEN están marcados con `// [BACKEND]`
  (ej.: `POST /auth/login`, `GET /patients/:id/journey`, `POST /documents`).
- **Carga de archivos**: se acepta cualquier archivo genérico y se **simula** el éxito;
  no se sube nada.
- **Contenido condicionado**: las vistas reaccionan al rol y al estado simulado
  (paciente / cuidadora / admin, etapa actual, citas confirmadas, etc.).

### 🔑 Credenciales de demostración (genéricas)

| Usuario | Contraseña | Rol |
|---|---|---|
| `maria` | `123` | Paciente (provincia, Quechua) |
| `rosa` | `123` | Paciente (Lima, en exámenes) |
| `ana` | `123` | Cuidadora (acompaña a María) |
| `usuario1` | `123` | Paciente |
| `admin` | `123` | Equipo INEN (panel institucional) |

---

## ▶️ Cómo ejecutar

Al usar **ES Modules**, debe servirse por HTTP (no abrir con `file://`). Desde esta carpeta:

```bash
# Opción 1 — Python
python -m http.server 8080

# Opción 2 — Node
npx serve .
```

Luego abre **http://localhost:8080** e inicia sesión con una cuenta de demostración.

> En VS Code también puedes usar la extensión **Live Server**.

---

## 🔒 Cumplimiento y alcance

- Cumple el enfoque de **Ley N.° 29733** (Protección de Datos Personales) y **Ley General de Salud**:
  **no se usan historias clínicas reales**; todos los datos son ficticios/anonimizados.
- **Interoperabilidad progresiva**: pensado para conectarse gradualmente con SISINEN/REFCON
  (sin sustituirlos), sin afectar la operación clínica.
- **Fuera de alcance** (por diseño): diagnóstico médico automático por IA, historia clínica
  electrónica completa, integración obligatoria con todos los sistemas o implementación en producción.

---

## 🧩 Mapeo con el flujo BPMN del INEN

La ruta del paciente traduce el flujo oficial a 7 etapas centradas en la paciente:

`Referencia (REFCON)` → `Evaluación de admisión` → `Apertura de HC (SISINEN)` →
`Programación de 1ª cita` → `Primera atención (especialista)` →
`Exámenes de apoyo al diagnóstico` → `Cita de diagnóstico`.

---

## 👥 Equipo LABINEN

Yura Toledo Morote · Jhimy Sangay Vega · Ruth Angulo Fernández ·
Sandra Portocarrero Coral · Vanesa Valencia Cuadros · Gary De La Cruz Antialon

---

*Prototipo desarrollado para la Hackatón Transformagob 2026 · #PorUnPerúDigital · INEN / PCM / CLAD / CAF*
