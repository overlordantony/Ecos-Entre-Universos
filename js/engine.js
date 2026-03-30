/**
 * engine.js
 * Ecos Entre Universos — Motor Global del Juego
 *
 * Gestiona:
 *   - Navegación entre fases
 *   - Sistema de modales globales
 *   - Modal de checkpoint (6 toques en elemento central)
 *   - Carga dinámica de fases
 */

const Engine = (() => {

  // ── Estado global ──────────────────────────────────────────────────
  let currentPhase     = null;
  let tapCount         = 0;
  let tapTimer         = null;
  const TAP_TARGET     = 6;
  const TAP_TIMEOUT_MS = 2000;

  // ── Inicialización ────────────────────────────────────────────────
  function init() {
    _buildCheckpointModal();
    _buildGlobalModal();
    navigateTo('index');
  }

  // ── Navegación ────────────────────────────────────────────────────

  /**
   * Navega a una fase o al index.
   * Carga el HTML de la fase en el contenedor principal.
   *
   * @param {string} phase - 'index' | 'fase_1' | 'fase_2' | 'fase_3' | 'fase_final'
   */
  async function navigateTo(phase) {
    currentPhase = phase;
    tapCount = 0;

    const container = document.getElementById('game-container');
    container.classList.add('fade-out');

    await _delay(400);

    if (phase === 'index') {
      container.innerHTML = _indexHTML();
    } else {
      try {
        const res  = await fetch(`phases/${phase}.html`);
        const html = await res.text();
        container.innerHTML = html;
        _loadPhaseScript(phase);
      } catch (e) {
        console.error(`Error cargando fase: ${phase}`, e);
      }
    }

    container.classList.remove('fade-out');
    container.classList.add('fade-in');
    setTimeout(() => container.classList.remove('fade-in'), 600);
  }

  /**
   * Carga dinámicamente el script JS de una fase.
   */
  function _loadPhaseScript(phase) {
    const existing = document.getElementById(`script-${phase}`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id  = `script-${phase}`;
    script.src = `js/phases/${phase}.js`;
    document.body.appendChild(script);
  }

  // ── Sistema de Modales Globales ───────────────────────────────────

  /**
   * Abre el modal global con contenido personalizado.
   *
   * @param {object} options
   * @param {string}   options.title    - Título del modal (opcional)
   * @param {string}   options.content  - HTML del contenido
   * @param {Function} options.onClose  - Callback al cerrar (opcional)
   */
  function openModal({ title = '', content = '', onClose = null }) {
    const modal      = document.getElementById('global-modal');
    const modalTitle = document.getElementById('global-modal-title');
    const modalBody  = document.getElementById('global-modal-body');

    if (title) {
      modalTitle.textContent = title;
      modalTitle.style.display = 'block';
    } else {
      modalTitle.style.display = 'none';
    }

    modalBody.innerHTML = content;
    modal.classList.add('active');
    modal._onClose = onClose;

    // Trampa de foco para accesibilidad
    modal.focus();
  }

  function closeModal() {
    const modal = document.getElementById('global-modal');
    modal.classList.remove('active');
    if (typeof modal._onClose === 'function') {
      modal._onClose();
      modal._onClose = null;
    }
  }

  // ── Sistema de Checkpoint (6 toques) ─────────────────────────────

  /**
   * Registra un toque en el elemento central de la fase.
   * Al llegar a 6 toques seguidos en menos de 2s → abre modal de checkpoint.
   */
  function registerCentralTap() {
    tapCount++;
    clearTimeout(tapTimer);

    if (tapCount >= TAP_TARGET) {
      tapCount = 0;
      _openCheckpointModal();
      return;
    }

    tapTimer = setTimeout(() => { tapCount = 0; }, TAP_TIMEOUT_MS);
  }

  function _openCheckpointModal() {
    const modal = document.getElementById('checkpoint-modal');
    modal.classList.add('active');
    document.getElementById('checkpoint-input').value = '';
    document.getElementById('checkpoint-error').textContent = '';
    document.getElementById('checkpoint-input').focus();
  }

  function _closeCheckpointModal() {
    document.getElementById('checkpoint-modal').classList.remove('active');
  }

  function _handleCheckpointSubmit() {
    const code   = document.getElementById('checkpoint-input').value;
    const result = Checkpoint.validate(code);

    if (result.valid) {
      _closeCheckpointModal();
      if (result.destination === 'completed') {
        openModal({
          content: `
            <p class="modal-poetic">Ya recorriste este universo completo.</p>
            <p class="modal-poetic">No hay más fases. Solo lo que construiste.</p>
          `
        });
      } else {
        navigateTo(result.destination);
      }
    } else {
      document.getElementById('checkpoint-error').textContent =
        'Código no reconocido. El universo no recuerda ese eco.';
    }
  }

  // ── HTML del Index ────────────────────────────────────────────────

  function _indexHTML() {
    return `
      <div class="index-screen">
        <div class="index-title-block">
          <h1 class="index-title">Ecos Entre Universos</h1>
          <p class="index-subtitle">El Lugar Donde Coincidimos en el Tiempo</p>
        </div>

        <div class="index-actions">
          <button class="btn-primary" onclick="Engine.navigateTo('fase_1')">
            Comenzar el viaje
          </button>
          <button class="btn-secondary" onclick="Engine._openCheckpointModal()">
            Continuar desde un eco
          </button>
        </div>

        <p class="index-hint">
          Si ya recorriste parte del universo, usa tu código de eco para continuar.
        </p>
      </div>
    `;
  }

  // ── Construcción de Modales Globales ─────────────────────────────

  function _buildGlobalModal() {
    const modal = document.createElement('div');
    modal.id        = 'global-modal';
    modal.className = 'modal-overlay';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" onclick="Engine.closeModal()" aria-label="Cerrar">✕</button>
        <h2 class="modal-title" id="global-modal-title"></h2>
        <div class="modal-body" id="global-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);

    // Cerrar al click fuera del box
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function _buildCheckpointModal() {
    const modal = document.createElement('div');
    modal.id        = 'checkpoint-modal';
    modal.className = 'modal-overlay checkpoint-overlay';
    modal.innerHTML = `
      <div class="modal-box checkpoint-box">
        <button class="modal-close" onclick="Engine._closeCheckpointModal()" aria-label="Cerrar">✕</button>
        <p class="modal-poetic">
          Veo que buscas continuar donde te quedaste.
        </p>
        <p class="modal-poetic">
          Si este lugar ya lo conoces bien, dime cómo se llama
          el último lugar que visitaste y allí te llevaré.
        </p>
        <div class="checkpoint-input-group">
          <input
            id="checkpoint-input"
            type="text"
            class="modal-input"
            placeholder="Tu código de eco..."
            autocomplete="off"
            spellcheck="false"
          />
          <button class="btn-primary" onclick="Engine._handleCheckpointSubmit()">
            Ir
          </button>
        </div>
        <p class="modal-error" id="checkpoint-error"></p>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) _closeCheckpointModal();
    });

    document.getElementById('checkpoint-input')
      ?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') _handleCheckpointSubmit();
      });
  }

  // ── Utilidades ────────────────────────────────────────────────────

  function _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ── Pantalla de Checkpoint completado ────────────────────────────

  /**
   * Muestra el código de checkpoint al completar una fase.
   *
   * @param {string} phase - Fase recién completada
   * @param {Function} onContinue - Callback para avanzar a la siguiente fase
   */
  function showCheckpointScreen(phase, onContinue) {
    const code = Checkpoint.getCode(phase);
    openModal({
      content: `
        <div class="checkpoint-reveal">
          <p class="modal-poetic">El universo recordará este momento.</p>
          <p class="modal-poetic">Si alguna vez necesitas volver,<br>usa este eco:</p>
          <div class="checkpoint-code">${code}</div>
          <p class="modal-hint">Anótalo o haz una captura de pantalla.</p>
          <button class="btn-primary" onclick="Engine.closeModal()">
            Continuar
          </button>
        </div>
      `,
      onClose: onContinue || null
    });
  }

  // ── API pública ───────────────────────────────────────────────────
  return {
    init,
    navigateTo,
    openModal,
    closeModal,
    registerCentralTap,
    showCheckpointScreen,
    _openCheckpointModal,
    _closeCheckpointModal,
    _handleCheckpointSubmit,
  };

})();

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => Engine.init());
