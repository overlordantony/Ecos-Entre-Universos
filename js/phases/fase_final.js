/**
 * fase_final.js
 * Ecos Entre Universos — Fase Final: Un Nuevo Universo
 */

const FaseFinal = (() => {

  const read = new Set();
  const TOTAL = 3;

  const STARS = {
    origen: {
      name:  'Origen',
      color: '#6090d0',
      story: `
        <p>Llegaste como llegan las cosas que cambian todo: sin anunciarte.</p>
        <p>Eras un apoyo temporal. Una incorporación nueva. Algo a lo que ni presté atención. Una cosa indeterminada en el espacio, como llamo a todo lo que aún no me importa.</p>
        <p>Pero algo ocurrió. No sé qué fue. Ni siquiera yo lo entiendo del todo. Un día sentí la necesidad de hablar contigo. Inventé pretextos. Pregunté cosas que no necesitaba saber. Me senté en escritorios ajenos solo para ver tu reacción a mis chistes ácidos.</p>
        <p>Porque así funciono: primero provoco. Primero incomodo. Primero veo qué hay detrás de la superficie.</p>
        <p>Y detrás de la superficie había algo que no esperaba.</p>
        <p>Alguien me dijo que le gustabas a la cosa nueva. Me lo tomé en broma. Pero en el fondo, algo se movió.</p>
        <p>Y desde ese día dejé de inventar excusas para ir. Simplemente iba. Porque sí. Porque tú.</p>
      `
    },
    presente: {
      name:  'Presente',
      color: '#f0e8d0',
      story: `
        <p>Hubo una noche que lo cambió todo.</p>
        <p>Una moto. Un lugar que no conocía. Una cena. Una conversación. Y una confesión que correspondiste antes de que terminara de procesar lo que estaba pasando.</p>
        <p>Y luego un beso. Rápido. Inesperado. A la velocidad de la luz. Que me sacó de toda duda.</p>
        <p>Desde entonces ha habido más besos. Y caricias. Y conversaciones. Y abrazos sentidos. Y mordidas de labios que no estaban en ningún plan. Y risas en una oficina que por capricho del universo es solo mía.</p>
        <p>Aprendí que eres rara. Inteligente. Críptica cuando quieres. Que lees cosas que me hicieron querer leer. Que te enojas de formas que me resultan interesantes. Que cuando algo te gusta vuelves, aunque hayas dicho que eras mala en ello.</p>
        <p>Y aprendí algo sobre mí también: que no cualquiera rompe mi paisaje.</p>
        <p>Tú lo rompiste. Desde el primer día, aunque tardé en notarlo.</p>
      `
    },
    pacto: {
      name:  'Pacto',
      color: '#e8a020',
      story: `
        <p>Soy de los que quieren todo ya. De los que se aburren de la calma y van a molestar a la gente. De los que hacen las cosas rápido para sentirse libres. Y cuando están libres, buscan la siguiente cosa que valga la pena.</p>
        <p>Tú eres la siguiente cosa que vale la pena. Y la que sigue. Y la que sigue después.</p>
        <p>Sé que dijimos que necesitábamos tiempo. Sé que lo correcto es esperar. Pero no quiero. No quiero seguir sabiendo lo que siento y no decírtelo de la única forma que importa.</p>
        <p>Este universo lo construí para ti. Cada fase, cada puzzle, cada historia, cada cifrado imposible. Todo fue un pretexto. El mismo tipo de pretexto con que me senté en tu escritorio el primer día.</p>
        <p>Así que aquí está, sin rodeos y sin más cifrados:</p>
      `,
      proposal: true
    }
  };

  // ── Init ───────────────────────────────────────────────────────────
  function init() {
    document.getElementById('galaxy-core')
      ?.addEventListener('click', () => Engine.registerCentralTap());
  }

  // ── Core click — bienvenida ────────────────────────────────────────
  function onCoreClick(e) {
    e.stopPropagation();
    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">Bienvenida, Criaturita del Bosque.</p>
          <p class="modal-poetic">Has llegado al final del viaje.</p>
          <p class="modal-poetic">Pero también al comienzo de algo nuevo.</p>
          <p class="modal-poetic" style="color:var(--ff-gold)">Un nuevo universo que iremos construyendo.</p>
          <div class="modal-divider"></div>
          <p class="modal-poetic">Hay tres estrellas esperándote.<br>Cada una tiene algo que decirte.</p>
          <p class="modal-poetic">Tómate el tiempo que necesites.</p>
          <p class="modal-poetic">Este universo no tiene prisa.</p>
          <p class="modal-poetic">Ya llegaste.</p>
        </div>
      `
    });
  }

  // ── Star click ─────────────────────────────────────────────────────
  function onStarClick(id) {
    const star = STARS[id];
    if (!star) return;

    read.add(id);
    document.getElementById(`star-${id}`)?.classList.add('read');

    Engine.openModal({
      content: _starContent(star),
      onClose: () => {
        if (read.size === TOTAL) _showFinalHint();
      }
    });
  }

  function _starContent(star) {
    const proposalBlock = star.proposal ? `
      <div class="modal-divider"></div>
      <p class="proposal-line">Quiero que seas mi novia.</p>
      <div class="modal-divider"></div>
      <p class="star-story" style="font-size:0.95rem">
        No porque deba.<br>
        No porque sea el siguiente paso lógico.<br>
        Sino porque desde que rompiste mi paisaje<br>
        no he querido que dejes de estar en él.
      </p>
      <div class="modal-divider"></div>
      <p class="star-story" style="color:var(--ff-gold);font-size:1.05rem">
        ¿Qué dices, Criaturita del Bosque?
      </p>
    ` : '';

    return `
      <div class="star-modal-header">
        <div class="star-modal-dot" style="background:${star.color}"></div>
        <span class="star-modal-name">${star.name}</span>
      </div>
      <div class="star-story modal-reveal">${star.story}</div>
      ${proposalBlock}
    `;
  }

  // ── Mensaje final ──────────────────────────────────────────────────
  function _showFinalHint() {
    const hint = document.getElementById('galaxy-final-hint');
    hint?.classList.add('visible');

    setTimeout(() => {
      Engine.showCheckpointScreen('fase_final', null);
    }, 1200);
  }

  init();

  return { onCoreClick, onStarClick };

})();
