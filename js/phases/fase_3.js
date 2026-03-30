/**
 * fase_3.js
 * Ecos Entre Universos — Fase 3: Buscando el Vacío
 */

const Fase3 = (() => {

  // Contraseña: cc(Dwrenabx, -9) === 'universo'
  const ENCODED = 'Dwrenabx';
  const SHIFT   = 9;

  let relatoShown = false;

  const RELATO_LINES = [
    'Todo está destruido.',
    '',
    'Lo que ves no es el fin del universo.',
    'Es el universo que construí para ti.',
    'Y que destruí también para ti.',
    '',
    '¿Recuerdas lo que leíste en la primera fase?',
    '¿Lo que aprendiste en la segunda?',
    '¿Lo que te hizo sentir, pensar, dudar?',
    '',
    'Ya no importa.',
    'Porque ya no existe.',
    '',
    'Lo destruí todo a propósito.',
    'No como castigo.',
    'No como olvido.',
    'Sino como símbolo.',
    '',
    'Para liberarse de lo que nos ata hay un camino:',
    'Repasar cada carga por partes.',
    'Entenderla.',
    'Racionalizarla.',
    'Y luego deshacerse de ella.',
    '',
    'Yo destruyo lo que ya no necesito.',
    'Ese es mi modo.',
    'Tú tendrás que encontrar el tuyo.',
    '',
    'Pero primero hay que entender de qué está hecha la carga.',
    'Por eso existieron las fases anteriores.',
    'Por eso existe este universo en ruinas.',
    '',
    'El vacío que queda después de destruir no es pérdida.',
    'Es espacio.',
    'Espacio para lo que viene.',
    '',
    'Sigue.'
  ];

  // ── Ruinas generativas ─────────────────────────────────────────────
  function _generateRuins() {
    const field = document.getElementById('ruins-field');
    if (!field) return;

    const count = 22;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'ruin-fragment';

      const w  = Math.random() * 40 + 8;
      const h  = Math.random() * 18 + 4;
      const x  = Math.random() * 100;
      const y  = Math.random() * 100;
      const cx = 50 - x;
      const cy = 50 - y;
      const r  = Math.random() * 360;
      const d  = Math.random() * 14 + 8;

      el.style.cssText = `
        width: ${w}px; height: ${h}px;
        left: ${x}%; top: ${y}%;
        --drift-x: ${cx * 0.3}px;
        --drift-y: ${cy * 0.3}px;
        --drift-r: ${r}deg;
        animation-duration: ${d}s;
        animation-delay: ${Math.random() * -14}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
      field.appendChild(el);
    }
  }

  // ── Init ───────────────────────────────────────────────────────────
  function init() {
    _generateRuins();
    document.getElementById('black-hole')
      ?.addEventListener('click', () => Engine.registerCentralTap());
  }

  // ── Click agujero negro ────────────────────────────────────────────
  function onBlackHoleClick(e) {
    e.stopPropagation();

    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">Bienvenida al corazón del vacío, buscadora.</p>
          <p class="modal-poetic">He aquí el fin de todo.</p>
          <p class="modal-poetic">Pero también un nuevo comienzo,<br>si hallas cómo avanzar.</p>
          <div class="modal-divider"></div>
          <p class="modal-poetic">Esta vez será diferente.<br>No hay nodos que resolver ni mundos que explorar.</p>
          <p class="modal-poetic">Solo una pregunta que hacerle al artífice de este cosmos.</p>
          <p class="modal-poetic" style="color:var(--f3-accent)">Pregúntale qué son las personas.</p>
          <p class="modal-poetic">Él te recordará la respuesta.<br>Pero no lo hará sin más — ya sabes cómo es.<br>Algo tendrás que ofrecer.</p>
          <div class="modal-divider"></div>
          <div class="phase-input-group">
            <input
              id="f3-input"
              type="text"
              class="modal-input"
              placeholder="La respuesta del artífice..."
              autocomplete="off"
              spellcheck="false"
            />
            <button class="btn-primary" onclick="Fase3.validate()">Continuar</button>
          </div>
          <p class="phase-error" id="f3-error"></p>
          <div id="f3-relato" style="display:none; margin-top:var(--space-md)"></div>
          <div id="f3-continue" style="display:none; margin-top:var(--space-md); text-align:center"></div>
        </div>
      `
    });

    setTimeout(() => {
      document.getElementById('f3-input')
        ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') validate(); });
    }, 100);
  }

  // ── Validar contraseña ─────────────────────────────────────────────
  function validate() {
    const input = document.getElementById('f3-input');
    const error = document.getElementById('f3-error');
    if (!input || !error) return;

    const isValid = Cipher.validate(input.value, ENCODED, SHIFT);

    if (isValid) {
      input.classList.add('success');
      input.disabled = true;
      error.textContent = '';

      // Ocultar el input group y mostrar el relato
      input.closest('.phase-input-group').style.display = 'none';
      setTimeout(() => _revealRelato(), 400);
    } else {
      input.classList.remove('error');
      void input.offsetWidth;
      input.classList.add('error');
      error.classList.add('visible');
      error.textContent = 'El vacío no acepta respuestas incorrectas. Busca al artífice.';
      setTimeout(() => input.classList.remove('error'), 400);
    }
  }

  // ── Revelar el relato línea a línea ───────────────────────────────
  function _revealRelato() {
    const container = document.getElementById('f3-relato');
    if (!container) return;
    container.style.display = 'block';
    relatoShown = true;

    RELATO_LINES.forEach((line, i) => {
      const el = document.createElement('p');
      el.className = `relato-line${line === '' ? ' empty' : ''}`;
      el.style.animationDelay = `${i * 180}ms`;
      el.textContent = line;
      container.appendChild(el);
    });

    // Mostrar botón de continuar al final
    const totalDelay = RELATO_LINES.length * 180 + 800;
    setTimeout(() => {
      const btn = document.getElementById('f3-continue');
      if (btn) {
        btn.style.display = 'block';
        btn.innerHTML = `<button class="btn-primary" onclick="Fase3.proceed()">Continuar el viaje</button>`;
      }
    }, totalDelay);
  }

  function proceed() {
    Engine.closeModal();
    setTimeout(() => Engine.showCheckpointScreen('fase_3', () => Engine.navigateTo('fase_final')), 300);
  }

  init();

  return { onBlackHoleClick, validate, proceed };

})();
