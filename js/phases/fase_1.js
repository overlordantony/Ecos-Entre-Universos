/**
 * fase_1.js
 * Ecos Entre Universos — Fase 1: Abandono de la Abadía
 *
 * Gestiona:
 *   - Modal de la estrella central
 *   - Modales de cada planeta con su historia
 *   - Tracking de exploración
 *   - Modal de pista al completar los 6 planetas
 *   - Puzzle de orden
 *   - Validación de contraseña (cifrado César)
 *   - Pantalla de checkpoint al completar
 */

const Fase1 = (() => {

  // ── Estado ─────────────────────────────────────────────────────────
  const TOTAL_PLANETS = 6;
  const explored      = new Set();
  let   puzzleUnlocked = false;

  // Contraseña del puzzle: cc(Naoiy, -6) === 'hueco'
  const PUZZLE_ENCODED = 'Naoiy';
  const PUZZLE_SHIFT   = 6;

  // Orden correcto del puzzle
  const CORRECT_ORDER = ['novaris', 'selenar', 'krath', 'aureum', 'sylvara', 'aeryn'];
  let   currentOrder  = [];

  // ── Datos de planetas ──────────────────────────────────────────────
  const PLANETS = {
    novaris: {
      name:  'Nóvaris',
      tema:  'Introspección',
      color: '#1a3a6e',
      story: `
        <p>Eones atrás, existió Nóvaris. Una civilización que había elevado el progreso a la categoría de lo sagrado. Sus ciudades crecían hacia las estrellas con una velocidad que desafiaba la razón, y sus habitantes medían el valor de su existencia en logros, en conquistas, en la distancia recorrida desde el punto de partida.</p>
        <p>Dos figuras guiaban su destino: Aethon, el Arquitecto del Instante, cuya filosofía proclamaba que solo existía el ahora y que detenerse era sinónimo de morir. Y Varek la Perpetua, guardiana de los grandes proyectos, que tejía planes tan vastos que ningún ojo podía ver su totalidad. Juntos construyeron maravillas que rozaban el firmamento. Nadie preguntó si debían hacerlo. Solo si podían.</p>
        <p>Pero bajo sus cimientos perfectos, algo comenzó a filtrarse. No era agua todavía. Era el peso acumulado de todo lo que nunca se examinó: las preguntas que se postergaron, las heridas que se ignoraron, los miedos que se enterraron bajo capas de productividad y ruido.</p>
        <p>El agua llegó despacio, como siempre llegan las cosas inevitables. No como una tormenta, sino como una marea silenciosa que fue subiendo centímetro a centímetro mientras todos miraban hacia el horizonte.</p>
        <p>Lo que ves ahora son sus ruinas. Suspendidas bajo el agua, inmóviles, perfectamente conservadas en su fracaso. Un mundo que lo tuvo todo excepto la valentía de mirarse.</p>
        <p>Nos hundimos en lo que nos agobia sin verlo. Y cuando lo vemos, el orgullo a veces pesa más que el agua. Pero en ocasiones, lo único que se necesita no es fuerza propia — sino alguien que te lance un salvavidas. No hay debilidad en eso. Solo hay humanidad.</p>
      `
    },
    selenar: {
      name:  'Selenar',
      tema:  'Reflexión',
      color: '#8090a8',
      story: `
        <p>Antes de que existieran las preguntas, existía Selenar.</p>
        <p>Un mundo casi enteramente de agua, donde la tierra emergió no como continentes sino como islas de piedra oscura, perfectas en su modestia. Sobre ellas, los Tejedores de Selenar construyeron sus templos, no para adorar a ningún dios, sino para practicar el único arte que consideraban sagrado: el de sentarse con uno mismo.</p>
        <p>Los Tejedores no tenían reyes ni jerarquías. Solo tenían el Rito del Espejo. Una vez por ciclo lunar, cada habitante descendía al borde del mar, se arrodillaba frente al agua quieta y miraba su propio reflejo durante el tiempo que fuera necesario. No para buscar respuestas. Solo para ver.</p>
        <p>El Rito no tenía palabras. No tenía cánticos. Solo tenía una pregunta que cada Tejedor se formulaba en silencio: <em>¿Cómo llegué hasta aquí?</em></p>
        <p>Sus templos aún están en pie. El agua sigue quieta.</p>
        <p>Ven. Arrodíllate en el borde. No busques respuestas hoy. Solo mira. Solo siente. Solo pregúntate cómo llegaste hasta aquí. El mar ya sabe el resto.</p>
      `
    },
    krath: {
      name:  'Krath',
      tema:  'Caos',
      color: '#8a3a10',
      story: `
        <p>Nadie recuerda cómo era Krath antes del Gran Quiebre.</p>
        <p>Los registros más antiguos hablan de un mundo completo, de océanos que conectaban continentes y cielos que no tenían bordes visibles. Pero eso fue antes del cataclismo que nadie predijo: la noche en que el núcleo del planeta exhaló su último aliento y Krath se partió en mil fragmentos que quedaron suspendidos en su propia órbita, como los pedazos de un espejo roto flotando en el vacío.</p>
        <p>Durante los primeros ciclos, hubo desesperación. Los supervivientes buscaron líderes, mapas, sistemas que les devolvieran el orden que conocían. No encontraron ninguno.</p>
        <p>La respuesta llegó sola: un día, alguien saltó de su fragmento al vecino para intercambiar lo que tenía por lo que necesitaba. Luego otro hizo lo mismo. Los Krath aprendieron a saltar en el momento exacto, a confiar en el impulso, a soltar el fragmento anterior antes de haber aterrizado en el siguiente.</p>
        <p>No había guías. No había rutas. Y sin embargo, eran felices.</p>
        <p>Porque a veces el caos no es el problema que hay que resolver. Es el lugar donde aprendes quién eres cuando no tienes nada que te sostenga excepto tú mismo.</p>
      `
    },
    aureum: {
      name:  'Áureum',
      tema:  'Orden',
      color: '#c8980a',
      story: `
        <p>Dicen que los viajeros que ven Áureum por primera vez desde el espacio confunden sus ciudades con estrellas.</p>
        <p>No es metáfora. Sus torres de oro y plata pulido reflejan la luz de su sol con tanta precisión que el planeta entero parece arder sin consumirse. Áureum no tiene guerras. No tiene crimen. No tiene hambre. Cada áureo nace con un propósito asignado por Los Arquitectos Divinos.</p>
        <p>Al principio, los visitantes de otros mundos lo llaman tiranía. Los áureos se limitan a sonreír con esa calma particular que solo tienen quienes nunca han dudado. <em>"¿Tiranía?"</em>, responden. <em>"La tiranía es despertar cada mañana sin saber para qué."</em></p>
        <p>Los Arquitectos Divinos no son tiranos visibles. Su voluntad se filtró hace tanto en las leyes, los rituales y la educación que ya nadie recuerda cuándo dejó de ser imposición y se convirtió en naturaleza.</p>
        <p>La colmena no siente las paredes.</p>
        <p>Pero camina por sus calles el tiempo suficiente y notarás algo. En los ojos de los áureos hay paz, sí. Pero también hay una ausencia extraña, como una habitación perfectamente ordenada de la que alguien retiró todos los objetos personales.</p>
        <p><em>¿Qué queda de ti cuando dejas de elegir?</em></p>
      `
    },
    sylvara: {
      name:  'Sylvara',
      tema:  'Paz',
      color: '#208040',
      story: `
        <p>Sylvara no te impresiona de inmediato.</p>
        <p>No tiene torres que rocen las estrellas ni ciudades que ardan como joyas en la oscuridad. Vista desde el espacio es simplemente verde, un verde tan denso y tan vivo que parece respirar, interrumpido apenas por el destello plateado de sus ríos.</p>
        <p>Los Sylvari no construyeron su civilización. La encontraron. Hace eones, sus ancestros comprendieron que el mundo ya tenía todo lo necesario antes de que ellos llegaran. Así que en lugar de conquistar, aprendieron a escuchar.</p>
        <p>Sus clanes son pequeños, deliberadamente pequeños. Toman lo justo. Devuelven lo necesario. Ni más, ni menos.</p>
        <p>No hay en Sylvara un atisbo de lo que otras civilizaciones llamarían progreso.</p>
        <p>Y sin embargo, si te sientas en una de sus ramas más altas al atardecer, cuando la luz atraviesa el dosel y el agua de los ríos captura los últimos colores del cielo, entenderás que los Sylvari encontraron algo que Nóvaris perdió bajo el agua, que Áureum sacrificó en sus engranajes y que Krath busca aún entre sus fragmentos.</p>
        <p>Simplemente dejaron de buscar lo que ya tenían. Y en ese momento de soltar, llegó la paz.</p>
      `
    },
    aeryn: {
      name:  'Aeryn',
      tema:  'Liberación',
      color: '#3890b8',
      story: `
        <p>Aeryn no tiene suelo.</p>
        <p>Sus islas flotan en capas, algunas tan altas que rozan las nubes, otras tan bajas que casi tocan la niebla perpetua que cubre el vacío debajo. Entre ellas, puentes de cuerda y madera ligera conectan lo que quiere ser conectado y dejan sin conectar lo que prefiere estar solo.</p>
        <p>Los Aeryn son, por naturaleza y por elección, el pueblo del desapego. No porque no sientan. Sino porque hace mucho aprendieron a distinguir entre lo que merece peso y lo que no.</p>
        <p>Un viajero foráneo le preguntó una vez a una anciana Aeryn cómo podía vivir rodeada de tanta gente sin que ninguna la afectara.</p>
        <p><em>"¿Tú te fijas en cada ladrillo de una pared?"</em>, preguntó al fin. <em>"Pero sí ves la pared. Y cuando encuentras un ladrillo que de alguna forma llama tu atención, uno que tiene una grieta curiosa o un color diferente... ese sí lo ves. Ese sí te importa."</em></p>
        <p>Eso es Aeryn. Un mundo de islas que flotan libres, sin anclas innecesarias. Sus habitantes saben que la energía es finita y que derramarla en todo es la forma más silenciosa de perderlo todo.</p>
        <p>Y cuando dos islas deciden acercarse, lo hacen porque quieren. No porque deban. Solo porque algo, en el silencio del vacío entre ambas, decidió que valía la pena tender un puente.</p>
      `
    }
  };

  // ── Inicialización ─────────────────────────────────────────────────
  function init() {
    // Registrar toque largo en estrella para checkpoint (6 toques)
    document.getElementById('star-central')
      ?.addEventListener('click', () => Engine.registerCentralTap());
  }

  // ── Estrella Central ───────────────────────────────────────────────
  function onStarClick(e) {
    e.stopPropagation();
    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">
            Bienvenida a este sistema solar que creé para ti,<br>
            mi Criaturita del Bosque.
          </p>
          <p class="modal-poetic">
            Nuestro sistema solar, donde te ayudaré a abandonar lo que te perturba.
          </p>
          <div class="modal-divider"></div>
          <p class="modal-poetic">
            Explora cada mundo que orbita esta estrella.<br>
            Presta mucha atención a sus historias,<br>
            pues guardan un orden que solo quien escucha con cuidado puede descubrir.
          </p>
          <p class="modal-poetic">
            Cuando hayas visitado todos los mundos,<br>
            el universo te hablará de nuevo.
          </p>
          <p class="modal-hint">Toca cada planeta para explorar su historia.</p>
        </div>
      `
    });
  }

  // ── Modal de Planeta ───────────────────────────────────────────────
  function onPlanetClick(id) {
    const planet = PLANETS[id];
    if (!planet) return;

    // Marcar como explorado
    if (!explored.has(id)) {
      explored.add(id);
      _markExplored(id);
      _updateCounter();

      // Si todos explorados → mostrar pista al cerrar
      if (explored.size === TOTAL_PLANETS) {
        Engine.openModal({
          content: _planetModalContent(planet),
          onClose: _showHintModal
        });
        return;
      }
    }

    Engine.openModal({
      content: _planetModalContent(planet)
    });
  }

  function _planetModalContent(planet) {
    return `
      <div class="planet-modal-header">
        <div class="planet-modal-dot" style="background:${planet.color}"></div>
        <span class="planet-modal-name">${planet.name} — ${planet.tema}</span>
      </div>
      <div class="planet-story modal-reveal">${planet.story}</div>
    `;
  }

  // ── Pista Modal ────────────────────────────────────────────────────
  function _showHintModal() {
    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">
            Si la galaxia quieres seguir descubriendo,<br>
            una pista has de buscar.
          </p>
          <p class="modal-poetic">
            Pero esta pista aquí no hallarás.
          </p>
          <div class="modal-divider"></div>
          <p class="modal-poetic">
            Deberás buscar al arquitecto de este universo,<br>
            aquel que forjó esta dimensión y te la entregó<br>
            para que vivieras una experiencia sin igual.
          </p>
          <p class="modal-poetic">
            Ahora ve, joven aventurera.<br>
            Ve y encuentra al artífice de esta dimensión.<br>
            Pero no creas que te la dará sin más,<br>
            pues es una deidad caprichosa y juguetona.<br>
            Algo has de ofrecer para que este universo pueda continuar.
          </p>
          <div class="modal-divider"></div>
          <div class="phase-input-group">
            <input
              id="f1-password-input"
              type="text"
              class="modal-input"
              placeholder="La palabra del artífice..."
              autocomplete="off"
              spellcheck="false"
            />
            <button class="btn-primary" onclick="Fase1.validatePassword()">
              Continuar
            </button>
          </div>
          <p class="phase-error" id="f1-password-error"></p>
        </div>
      `
    });

    document.getElementById('f1-password-input')
      ?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') validatePassword();
      });
  }

  // ── Validación de Contraseña ───────────────────────────────────────
  function validatePassword() {
    const input = document.getElementById('f1-password-input');
    const error = document.getElementById('f1-password-error');
    if (!input || !error) return;

    const isValid = Cipher.validate(input.value, PUZZLE_ENCODED, PUZZLE_SHIFT);

    if (isValid) {
      input.classList.add('success');
      error.textContent = '';
      setTimeout(() => {
        Engine.closeModal();
        _showOrderPuzzle();
      }, 500);
    } else {
      input.classList.remove('error');
      void input.offsetWidth; // reflow para reiniciar animación
      input.classList.add('error');
      error.classList.add('visible');
      error.textContent = 'El universo no reconoce esa palabra. Busca al artífice.';
      setTimeout(() => input.classList.remove('error'), 400);
    }
  }

  // ── Puzzle de Orden ────────────────────────────────────────────────
  function _showOrderPuzzle() {
    puzzleUnlocked = true;
    currentOrder   = [];

    const items = Object.entries(PLANETS).map(([id, p]) => `
      <div
        class="puzzle-item"
        id="puzzle-item-${id}"
        data-id="${id}"
        onclick="Fase1.onPuzzleItemClick('${id}')"
        role="button"
        aria-label="${p.name}"
      >
        <div class="puzzle-dot" style="background:${p.color}"></div>
        <span class="puzzle-name">${p.name}</span>
      </div>
    `).join('');

    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">
            Los mundos tienen un orden.<br>
            No el que los ojos ven — el que las historias revelan.
          </p>
          <p class="modal-hint">Toca los mundos en el orden correcto.</p>
          <div class="modal-divider"></div>
          <div class="puzzle-grid" id="puzzle-grid">${items}</div>
          <div class="puzzle-sequence" id="puzzle-sequence">
            <span class="puzzle-seq-label">Tu orden:</span>
            <div class="puzzle-seq-dots" id="puzzle-seq-dots"></div>
          </div>
          <div class="phase-input-group" style="margin-top:var(--space-md)">
            <button class="btn-primary" onclick="Fase1.checkOrder()">Confirmar</button>
            <button class="btn-secondary" onclick="Fase1.resetOrder()">Reiniciar</button>
          </div>
          <p class="phase-error" id="f1-order-error"></p>
        </div>
      `
    });
  }

  function onPuzzleItemClick(id) {
    if (currentOrder.includes(id)) return;
    if (currentOrder.length >= TOTAL_PLANETS) return;

    currentOrder.push(id);

    // Visual: marcar como seleccionado
    const item = document.getElementById(`puzzle-item-${id}`);
    item?.classList.add('selected');

    // Actualizar secuencia visual
    const seqDots = document.getElementById('puzzle-seq-dots');
    if (seqDots) {
      const dot = document.createElement('div');
      dot.className = 'seq-dot';
      dot.style.background = PLANETS[id].color;
      dot.title = PLANETS[id].name;
      seqDots.appendChild(dot);
    }
  }

  function resetOrder() {
    currentOrder = [];
    document.querySelectorAll('.puzzle-item').forEach(el => el.classList.remove('selected'));
    const seqDots = document.getElementById('puzzle-seq-dots');
    if (seqDots) seqDots.innerHTML = '';
    const error = document.getElementById('f1-order-error');
    if (error) { error.textContent = ''; error.classList.remove('visible'); }
  }

  function checkOrder() {
    const error = document.getElementById('f1-order-error');

    if (currentOrder.length < TOTAL_PLANETS) {
      if (error) {
        error.classList.add('visible');
        error.textContent = 'El cosmos aún espera. Ordena todos los mundos.';
      }
      return;
    }

    const isCorrect = currentOrder.every((id, i) => id === CORRECT_ORDER[i]);

    if (isCorrect) {
      Engine.closeModal();
      setTimeout(() => {
        Engine.showCheckpointScreen('fase_1', () => {
          Engine.navigateTo('fase_2');
        });
      }, 300);
    } else {
      if (error) {
        error.classList.add('visible');
        error.textContent = 'El orden no es correcto. Lee de nuevo las historias — hay un hilo que las une.';
      }
      // Animación de error suave
      document.getElementById('puzzle-grid')?.classList.add('shake-grid');
      setTimeout(() => {
        document.getElementById('puzzle-grid')?.classList.remove('shake-grid');
        resetOrder();
      }, 500);
    }
  }

  // ── Helpers visuales ───────────────────────────────────────────────
  function _markExplored(id) {
    document.getElementById(`planet-${id}`)?.classList.add('explored');
    document.getElementById(`orbit-${id}`)?.classList.add('lit');
  }

  function _updateCounter() {
    const counter = document.getElementById('exploration-counter');
    if (counter) {
      counter.textContent = `${explored.size} / ${TOTAL_PLANETS} mundos explorados`;
    }
  }

  // Iniciar cuando el DOM de la fase esté listo
  init();

  return {
    onStarClick,
    onPlanetClick,
    validatePassword,
    onPuzzleItemClick,
    resetOrder,
    checkOrder,
  };

})();
