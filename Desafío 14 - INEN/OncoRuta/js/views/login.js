/* ============================================================
   views/login.js — Pantalla de inicio de sesión
   Autenticación SIMULADA (ver js/api.js). Credenciales genéricas.
   ============================================================ */

import { login as apiLogin } from "../api.js";
import { setSession } from "../store.js";
import { toast } from "../notifications.js";
import { renderRoute } from "../router.js";

export function render() {
  return `
  <div class="auth">
    <section class="auth__hero">
      <img src="assets/logo.svg" alt="OncoRuta Mujer Inteligente" width="220" style="filter:brightness(0) invert(1);margin-bottom:1.5rem" />
      <h1>Tu ruta de diagnóstico, clara y acompañada</h1>
      <p>Sistema digital de navegación del paciente del INEN para un diagnóstico
         oportuno, equitativo, inclusivo e intercultural.</p>
      <div class="auth__features">
        <div class="auth__feature"><span class="ico">🧭</span><div><strong>Sabe en qué etapa estás</strong><br><span class="small">Tu caso centralizado y tus siguientes pasos.</span></div></div>
        <div class="auth__feature"><span class="ico">🔔</span><div><strong>Recordatorios y alertas</strong><br><span class="small">Citas, exámenes e hitos importantes.</span></div></div>
        <div class="auth__feature"><span class="ico">💬</span><div><strong>Orientación en tu idioma</strong><br><span class="small">Español y quechua, con lectura en voz alta.</span></div></div>
      </div>
    </section>

    <section class="auth__panel">
      <div class="card card--pad-lg auth__card">
        <h2>Iniciar sesión</h2>
        <p class="muted small">Ingresa con tu cuenta del Portal de Atención al Paciente.</p>

        <form id="login-form" novalidate>
          <div class="field">
            <label for="lg-user">Usuario o N° de documento (DNI)</label>
            <input class="input" id="lg-user" name="user" autocomplete="username" required placeholder="Ej. maria" />
          </div>
          <div class="field">
            <label for="lg-pass">Contraseña</label>
            <input class="input" id="lg-pass" name="pass" type="password" autocomplete="current-password" required placeholder="••••" />
          </div>
          <button class="btn btn--block btn--lg" type="submit" id="lg-submit">Iniciar sesión</button>
        </form>

        <div class="auth__demo">
          <strong>Cuentas de demostración</strong> (clic para autocompletar):
          <div class="row row--wrap" style="margin-top:.5rem;gap:.4rem">
            <button data-demo="maria">👩🏽 Paciente (María)</button>
            <button data-demo="rosa">👩🏻 Paciente (Rosa)</button>
            <button data-demo="ana">👩🏽‍🦱 Cuidadora (Ana)</button>
            <button data-demo="admin">🏥 Equipo INEN</button>
          </div>
          <div class="small muted" style="margin-top:.5rem">Todas usan la contraseña <strong>123</strong>.</div>
        </div>

        <div class="gov-strip">
          🇵🇪 INEN · Hackatón Transformagob 2026 · #PorUnPerúDigital
        </div>
      </div>
    </section>
  </div>`;
}

export function mount(root) {
  const form = root.querySelector("#login-form");
  const userInput = root.querySelector("#lg-user");
  const passInput = root.querySelector("#lg-pass");
  const submit = root.querySelector("#lg-submit");

  // Botones de demo: autocompletan credenciales
  root.querySelectorAll("[data-demo]").forEach((b) =>
    b.addEventListener("click", () => {
      userInput.value = b.dataset.demo;
      passInput.value = "123";
      passInput.focus();
    })
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!userInput.value.trim() || !passInput.value) {
      toast("Completa usuario y contraseña.", "warn");
      return;
    }
    submit.disabled = true;
    submit.textContent = "Verificando…";
    try {
      // [BACKEND] Llamada simulada de autenticación
      const session = await apiLogin(userInput.value, passInput.value);
      setSession(session);
      toast(`Bienvenida, ${session.user}.`, "ok");
      location.hash = "#/";
      renderRoute();
    } catch (err) {
      toast(err.message, "warn");
      submit.disabled = false;
      submit.textContent = "Iniciar sesión";
    }
  });
}
