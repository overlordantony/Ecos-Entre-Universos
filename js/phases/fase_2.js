/**
 * fase_2.js
 * Ecos Entre Universos — Fase 2: Bastión Hueco
 *
 * Gestiona los 8 nodos de lógica deductiva,
 * las máscaras de Escorpio y el laberinto de decisiones.
 */

const Fase2 = (() => {

  // ── Estado ─────────────────────────────────────────────────────────
  const solved = new Set();
  const TOTAL  = 8;

  // Contraseña del puzzle de orden: cc(Ydflr, -3) === 'vacio'
  const PUZZLE_ENCODED = 'Ydflr';
  const PUZZLE_SHIFT   = 3;

  // Orden correcto del puzzle final
  const CORRECT_ORDER = [
    'constante','variable','condicion','funcion',
    'objeto','modelo','compuertas','ciclo'
  ];
  let currentOrder = [];

  // Estado del laberinto
  const labChoices = {};

  // Estado de máscaras
  const maskChoices = { ponerse: null, guardar: null, soltar: null };

  // ── Datos de nodos ─────────────────────────────────────────────────
  const NODES = {
    constante: {
      label: 'const',
      titulo: 'Constante',
      tema:   'Identidad',
      intro:  'En cualquier sistema existe algo que no cambia. No porque no pueda. Sino porque fue declarado así desde el inicio. Se llama constante. Encuentra la constante en este sistema.',
      code: `Escenario 1: x = 5,  y = 3,  z = 8,  k = 10
Escenario 2: x = 2,  y = 7,  z = 9,  k = 10
Escenario 3: x = 11, y = 1,  z = 4,  k = 10
Escenario 4: x = 6,  y = 8,  z = 2,  k = 10`,
      question: '¿Cuál es la constante?',
      type: 'input',
      answer: 'k',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'k siempre fue 10.',
        'No importó cuánto cambiaron x, y, z a su alrededor.',
        'No negoció su valor. No se adaptó. No cedió.',
        'Simplemente era lo que era.',
        'Yo también tengo constantes.',
        'Cosas que no cambian sin importar el contexto, el entorno o quien esté alrededor.',
        'No por rigidez.',
        'Sino porque fueron declaradas desde el inicio y no requieren revisión.',
        '¿Cuáles son las tuyas?',
        'No las que crees que deberían ser.',
        'Las que realmente no han cambiado sin importar todo lo que ha pasado.'
      ],
      extended: 'masks'
    },
    variable: {
      label: 'var',
      titulo: 'Variable',
      tema:   'Decisión',
      intro:  'Una variable no elige su valor. Lo recibe. Analiza este sistema y determina el valor final de x.',
      code: `x = 2
x = x + 3
x = x * 2
x = x - 1`,
      question: '¿Cuál es el valor final de x?',
      type: 'input',
      answer: '9',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'x empezó siendo 2.',
        'Pero cada operación que encontró en el camino la transformó.',
        'No eligió ser 9.',
        'Llegó a 9 porque eso era lo que el sistema le hacía ser.',
        'Las decisiones funcionan igual.',
        'Crees que eliges libremente.',
        'Pero cada decisión que tomas ya fue operada por tu historia, tu entorno y quienes te conocen.',
        '¿Cuánto de tu valor actual es tuyo?',
        '¿Y cuánto te lo asignaron las operaciones del camino?'
      ],
      extended: 'labyrinth'
    },
    condicion: {
      label: 'if',
      titulo: 'Condición',
      tema:   'Miedo',
      intro:  'Un sistema solo ejecuta lo que sus condiciones le permiten ver. Lo que no evalúa, no procesa. Analiza este sistema y determina qué imprime.',
      code: `x = 7

if x > 20:
    print("A")
elif x > 15:
    print("B")
elif x > 5:
    print("C")
else:
    print("D")`,
      question: '¿Qué imprime el sistema?',
      type: 'options',
      options: ['A', 'B', 'C', 'D'],
      answer: 'C',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'El sistema evaluó x > 20 primero.',
        'Falso. Siguió.',
        'Evaluó x > 15.',
        'Falso. Siguió.',
        'Evaluó x > 5.',
        'Verdadero. Se detuvo. Imprimió C.',
        'Nunca llegó a D aunque existía como opción.',
        'Porque ya no importaba.',
        'El miedo funciona igual.',
        'Es una condición que el sistema evalúa antes que todo lo demás.',
        'Y si se cumple, el sistema se detiene ahí.',
        '¿Cuántas veces no llegaste a evaluar lo que venía después porque el miedo devolvió verdadero demasiado rápido?'
      ]
    },
    funcion: {
      label: 'fn()',
      titulo: 'Función',
      tema:   'Propósito',
      intro:  'Toda función existe para hacer algo específico. Recibe. Procesa. Retorna. Sin retorno útil, la función no tiene razón de existir. Analiza estas funciones y determina cuál tiene un propósito real.',
      code: `def funcion_a(x):
    y = x * 2
    z = y + 1
    return z

def funcion_b(x):
    y = x * 2
    z = y + 1

def funcion_c(x):
    return x`,
      question: '¿Cuál de las tres funciones tiene propósito real?',
      type: 'options',
      options: ['funcion_a', 'funcion_b', 'funcion_c'],
      answer: 'funcion_a',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'funcion_b trabajó. Calculó. Procesó.',
        'Y no retornó nada.',
        'Todo ese esfuerzo quedó dentro, sin salida, sin impacto.',
        'funcion_c retornó algo. Pero no transformó nada.',
        'Recibió x y devolvió x. Como si no hubiera existido.',
        'Solo funcion_a hizo las tres cosas.',
        'Recibió. Procesó. Retornó algo diferente a lo que entró.',
        'El propósito funciona igual.',
        '¿Qué estás retornando tú al sistema?',
        '¿Estás procesando y guardando todo adentro como funcion_b?',
        '¿O pasando por el mundo sin transformar nada como funcion_c?'
      ]
    },
    objeto: {
      label: 'obj{}',
      titulo: 'Objeto',
      tema:   'Vínculo',
      intro:  'Un objeto no es solo lo que tiene. Es también lo que hace. Y lo que decide mostrar. Observa este objeto y responde.',
      code: `OBJETO: Persona

VISIBLE:
- nombre: "Criaturita"
- energia: 100
- accion: saludar()

PRIVADO:
- pensamiento: "esto no sale"
- emocion: "vulnerable"`,
      question: '¿Cuántos atributos puede ver alguien que interactúa con este objeto?',
      type: 'options',
      options: ['2', '3', '4', '5'],
      answer: '3',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'Este objeto tenía 5 atributos.',
        'Solo 3 eran visibles desde afuera.',
        'Los otros 2 existían. Pero eran privados.',
        'No por ocultamiento malicioso.',
        'Sino porque no todo necesita ser público.',
        'Cada persona con quien te vinculas es un objeto así.',
        'Lo que te muestran no es todo lo que son.',
        'La pregunta no es cómo acceder a lo privado de otro.',
        'La pregunta es qué decides hacer público tú.',
        '¿Cuántos de tus atributos reales conoce alguien que acaba de conocerte?'
      ]
    },
    modelo: {
      label: '~map',
      titulo: 'Modelo',
      tema:   'Percepción',
      intro:  'Un modelo no es la realidad. Es una representación de ella. Siempre incompleta. Siempre simplificada. Analiza este modelo y determina qué información falta para que sea la realidad completa.',
      code: `MODELO DE UNA PERSONA:
nombre: "X"
edad: 28
ocupacion: "diseñadora"
humor: "estable"

EVENTOS DEL DÍA REAL:
- Durmió 4 horas
- Tuvo una reunión difícil
- No almorzó
- Recibió una crítica injusta`,
      question: '¿El modelo refleja la realidad de esta persona hoy?',
      type: 'options',
      options: [
        'A) Sí, el modelo es preciso',
        'B) No, el modelo está desactualizado',
        'C) El modelo nunca puede reflejar la realidad completa'
      ],
      answer: 'C) El modelo nunca puede reflejar la realidad completa',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'El modelo decía: humor estable.',
        'La realidad era: 4 horas de sueño, sin almuerzo, crítica injusta.',
        '¿Cuál de las dos versiones usas cuando interactúas con alguien?',
        'Siempre interactuamos con el modelo que tenemos de una persona.',
        'Nunca con la persona completa.',
        'Cuando alguien te decepciona, te molesta o te confunde...',
        'Rara vez es la persona.',
        'Es la diferencia entre tu modelo de ella y su realidad.',
        '¿Cuándo fue la última vez que actualizaste el modelo que tienes de alguien importante?'
      ]
    },
    compuertas: {
      label: 'AND',
      titulo: 'Compuertas',
      tema:   'Moral',
      intro:  'Las compuertas lógicas no opinan. No sienten. Solo evalúan y producen un resultado. Evalúa estas compuertas y determina cuál da verdadero.',
      code: `A = verdadero
B = falso

Operación 1: A AND B = ?
Operación 2: A OR B  = ?
Operación 3: NOT A   = ?`,
      question: '¿Cuál de las tres operaciones da verdadero?',
      type: 'options',
      options: ['Operación 1', 'Operación 2', 'Operación 3'],
      answer: 'Operación 2',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'AND necesitaba que todo fuera verdadero.',
        'B era falso. Un solo falso fue suficiente para arrastrar todo.',
        'OR solo necesitaba que algo fuera verdadero.',
        'A era verdadero. Eso fue suficiente.',
        'NOT simplemente invirtió. A era verdadero. NOT A era falso.',
        'La moral funciona con las mismas compuertas.',
        '¿Con qué compuerta juzgas a los demás?',
        '¿AND? ¿Un solo error los define?',
        '¿OR? ¿Una sola virtud los salva?',
        '¿NOT? ¿Un descubrimiento invierte todo lo que creías?',
        '¿Y con cuál compuerta te juzgas a ti misma?',
        '¿Es la misma que usas con los demás?'
      ]
    },
    ciclo: {
      label: 'loop',
      titulo: 'Ciclo',
      tema:   'Acción',
      intro:  'Algunas acciones se repiten. Una y otra vez. Hasta encontrar el momento exacto en que deben detenerse. Sin ese momento, el sistema colapsa. Determina en qué valor para este ciclo.',
      code: `x = 0

repetir mientras x < 5:
    x = x + 1`,
      question: '¿En qué valor para el ciclo?',
      type: 'options',
      options: ['3', '4', '5', '6'],
      answer: '5',
      errorMsg: 'Valor incorrecto. El sistema no acepta aproximaciones. Revisa la lógica.',
      remate: [
        'x empezó en 0.',
        'El ciclo tenía una condición clara: seguir mientras x fuera menor a 5.',
        'Cada repetición x creció.',
        'Hasta que llegó a 5 y la condición dejó de cumplirse.',
        'El ciclo paró. El sistema avanzó.',
        'La acción funciona igual.',
        'Hay ciclos en tu vida que se repiten porque nunca definiste cuándo parar.',
        'La misma discusión. El mismo patrón. La misma parálisis.',
        '¿Cuál es tu condición de parada?',
        '¿Cuándo sabes que es momento de parar?'
      ]
    }
  };

  // ── Datos de máscaras ──────────────────────────────────────────────
  const MASKS = [
    { id: 'hermetismo',   nombre: 'Hermetismo',   cat: 'Ambigua',
      texto: 'Guardas lo que crees que te expone. Construyes muros con la precisión de quien sabe exactamente cuánto duele que entren sin permiso. Pero el hermetismo tiene un precio: los que podrían quedarse, se van antes de intentarlo. ¿Y si lo que proteges con tanto cuidado es precisamente lo que alguien necesita ver para decidir que vale la pena?' },
    { id: 'lealtad',      nombre: 'Lealtad',      cat: 'Positiva',
      texto: 'Cuando decides que alguien merece tu lealtad, no hay media tintura. Es total, silenciosa, feroz. Pero la lealtad sin límites tiene una sombra: a veces proteges a quien no lo merece porque soltar esa lealtad significaría admitir que te equivocaste al darla. ¿Cuántas veces has confundido lealtad con negarte a perder?' },
    { id: 'intensidad',   nombre: 'Intensidad',   cat: 'Ambigua',
      texto: 'No conoces los términos medios. Cuando algo te importa, te consume. Esa intensidad es tu mayor fuerza y tu mayor vulnerabilidad al mismo tiempo. ¿Alguna vez te has preguntado cuánto de lo que sientes es genuino y cuánto es el miedo a sentir poco?' },
    { id: 'desconfianza', nombre: 'Desconfianza', cat: 'Negativa',
      texto: 'No es paranoia. Es un sistema de seguridad construido con experiencias reales. Lo curioso es que el filtro a veces deja pasar lo que debería detener y detiene lo que debería dejar pasar. ¿Confías en tu desconfianza, o sospechas también de ella?' },
    { id: 'celos',        nombre: 'Celos',        cat: 'Negativa',
      texto: 'Los celos no son sobre el otro. Nunca lo fueron. Son la forma más honesta y más incómoda de decir "me importa". ¿Qué pasaría si en lugar de ocultarlos los leyeras como un mapa de lo que realmente valoras?' },
    { id: 'intuicion',    nombre: 'Intuición',    cat: 'Positiva',
      texto: 'Sabes cosas antes de saber que las sabes. Rara vez te equivocas. Pero hay algo que no sueles preguntarte: ¿cuántas veces ignoraste tu intuición porque la respuesta que te daba era la que no querías escuchar?' },
    { id: 'perspicacia',  nombre: 'Perspicacia',  cat: 'Ambigua',
      texto: 'Ves lo que otros no quieren que veas. Pero la perspicacia tiene un lado oscuro: a veces ves tanto que te cansas antes de que la historia termine. ¿Cuántas veces abandonaste algo porque ya sabías el final?' },
    { id: 'venganza',     nombre: 'Venganza',     cat: 'Negativa',
      texto: 'No es lo que crees. No siempre es furia. A veces es la única forma que encontraste de recuperar el control cuando alguien te lo quitó sin permiso. Pero la venganza cobra renta, y la cobra en ti. ¿Lo que buscas es equilibrio, o es que quien te lastimó sienta lo que tú sentiste?' }
  ];

  const MASK_REMATES = {
    hermetismo:   'Soltar el hermetismo no es abrirse a todos. Es dejar de usar el silencio como escudo con quienes ya ganaron tu confianza.',
    lealtad:      'Querer soltar la lealtad no significa volverse desleal. Significa reconocer que a veces la diste donde no fue recíproca. Soltar eso no es traición. Es recuperarte a ti.',
    intensidad:   'La intensidad no se suelta. Se aprende a dirigir. La pregunta no es cómo sentir menos — es hacia qué vale la pena sentir tanto.',
    desconfianza: 'Soltar la desconfianza no es volverse ingenua. Es aprender a distinguir entre el peligro real y el que construyes para no volver a sorprenderte.',
    celos:        'Los celos que quieres soltar, ¿son los que sientes hacia otros, o hacia una versión de ti que crees que deberías ser?',
    intuicion:    'Querer soltar la intuición es querer soltar la brújula porque a veces señala hacia donde no quieres ir. Sin ella no es que te pierdas menos — es que te pierdes sin saberlo.',
    perspicacia:  'Cansarse de ver demasiado es humano. Pero soltar la perspicacia no te da descanso — te da ignorancia. Lo que buscas no es ver menos. Es aprender a ver sin que te cueste tanto.',
    venganza:     'Soltar la venganza es el acto más difícil y más liberador al mismo tiempo. No porque el otro lo merezca. Sino porque mientras la cargas, el peso es tuyo, no de quien te lastimó.'
  };

  const TENSIONS = {
    'PP': 'Guardas luz detrás de luz. No es que tengas algo que ocultar — es que aún no decides si el mundo merece ver todo lo que eres.',
    'PA': 'Muestras lo que el mundo acepta fácilmente. Guardas lo que requiere explicación. Los rasgos que más te definen rara vez son los que no necesitan contexto.',
    'PN': 'Muestras tu cara más noble y guardas la más honesta. Lo que se guarda demasiado tiempo empieza a pesar más que lo que se muestra.',
    'AP': 'Curioso que elijas mostrar lo que requiere interpretación antes que lo que habla por sí solo. ¿O es que lo positivo te parece más vulnerable de exponer que lo complejo?',
    'AA': 'Todo en ti requiere lectura entre líneas. No es un accidente. Es una decisión. ¿Alguna vez te preguntaste si cansas a quienes no saben leer?',
    'AN': 'Muestras lo que puede ser interpretado de varias formas y guardas lo que no admite interpretación. Lo oscuro que guardas no desaparece por estar oculto.',
    'NP': 'Eliges mostrar tu sombra antes que tu luz. ¿O crees que tu lado oscuro aleja menos de lo que alejaría tu vulnerabilidad real?',
    'NA': 'Tu cara visible es la más difícil de aceptar, y aun así la eliges. ¿La guardas para protegerlo, o para protegerte de tener que explicarlo?',
    'NN': 'Ni en público ni en privado te permites lo que no tiene sombra. ¿Cuándo fue la última vez que te dejaste ser sin el peso de lo que crees que eres?'
  };

  // ── Datos del laberinto ────────────────────────────────────────────
  const LAB_SCENARIOS = [
    {
      id: 'vinculo',
      titulo: 'El Vínculo',
      texto: 'Alguien que aprecias te falla de la manera más cotidiana: una promesa pequeña, rota sin explicación, como si nunca hubiera existido.',
      pregunta: '¿Qué haces?',
      opciones: [
        { id: 'A', texto: 'Lo dices. Le dices lo que sientes. Sin drama. Solo la verdad.' },
        { id: 'B', texto: 'Lo guardas. Calculas que el costo de la conversación supera lo que recuperarías.' }
      ],
      respuestas: {
        A: 'Decisión registrada. Procesando. Continuando.',
        B: 'Decisión registrada. Procesando. Continuando.'
      }
    },
    {
      id: 'yo',
      titulo: 'La Oportunidad',
      texto: 'Aparece algo que quieres. Real, tangible. Pero implica exponerte. Arriesgar algo que tienes por algo que podrías tener.',
      pregunta: '¿Qué haces?',
      opciones: [
        { id: 'A', texto: 'Avanzas. El arrepentimiento de no intentarlo pesa más que el riesgo.' },
        { id: 'B', texto: 'Esperas. Cuando las condiciones mejoren, entonces sí.' }
      ],
      respuestas: {
        A: 'Decisión registrada. Procesando. Continuando.',
        B: 'Decisión registrada. Procesando. Continuando.'
      }
    },
    {
      id: 'otro',
      titulo: 'El Conflicto Ajeno',
      texto: 'Dos personas que aprecias están en disputa. Ninguna tiene razón completa. Las dos te buscan desde su lado.',
      pregunta: '¿Qué haces?',
      opciones: [
        { id: 'A', texto: 'Intervienes. Decides ser un punto de equilibrio. Sabes que puede costarte.' },
        { id: 'B', texto: 'Te mantienes al margen. No es tu conflicto. Los dejas encontrar su propio camino.' }
      ],
      respuestas: {
        A: 'Decisión registrada. Procesando. Continuando.',
        B: 'Decisión registrada. Procesando. Continuando.'
      }
    },
    {
      id: 'peso',
      titulo: 'La Verdad Incómoda',
      texto: 'Descubres algo sobre alguien que aprecias. No es una traición. Pero cambia tu percepción de esa persona para siempre.',
      pregunta: '¿Qué haces?',
      opciones: [
        { id: 'A', texto: 'Lo compartes. Buscas a alguien de confianza. Necesitas escucharte decirlo.' },
        { id: 'B', texto: 'Lo procesas sola. Te quedas con eso. Lo examinas en silencio.' }
      ],
      respuestas: {
        A: 'Decisión registrada. Procesando. Continuando.',
        B: 'Decisión registrada. Procesando. Continuando.'
      }
    }
  ];

  const LAB_REVELATIONS = {
    AAAA: 'Actúas en todo. Pero quien actúa en todo rara vez se pregunta cuándo descansar. La acción constante también puede ser una forma de no quedarse quieta con lo que se siente. ¿Cuándo fue la última vez que no hiciste nada y lo toleraste?',
    AAAB: 'Das la cara en casi todo. Menos en lo que más cuesta. Lo que guardas para procesarlo solo nunca llega a ningún lado, simplemente se asienta. ¿Cuánto has acumulado ya sin que nadie lo sepa?',
    AABA: 'Sabes dónde está tu energía y no la desperdicias en conflictos que no son tuyos. Pero cuando algo te pesa buscas a alguien. Eres selectiva con lo que das, pero no con lo que pides. ¿Lo habías notado?',
    AABB: 'Proteges lo tuyo con determinación. Pero cuando el problema no es directamente tuyo, desapareces. ¿Cuántas veces esperaste que alguien actuara por ti en lo que tú misma evitabas?',
    ABAA: 'Curiosa contradicción. Intervienes cuando otros necesitan algo pero dudas cuando la oportunidad es para ti. ¿Es más fácil arriesgarse por otros que por una misma?',
    ABAB: 'Eres presente para los demás pero esquiva contigo misma. Das lo que no te das. ¿Cuándo fue la última vez que actuaste solo para ti?',
    ABBA: 'El vínculo directo te importa lo suficiente para actuar. Pero el riesgo propio y los conflictos ajenos los rodeas. Hay una diferencia entre buscar apoyo y buscar compañía para cargar. ¿Sabes cuál de las dos buscas más?',
    ABBB: '¿El vínculo es lo único que sientes que vale el costo de actuar, o es lo único donde el costo te parece tolerable?',
    BAAA: 'El único lugar donde te repliegas es cuando alguien cercano te falla directamente. ¿Qué tiene ese conflicto específico que los demás no tienen?',
    BAAB: 'Actúas hacia afuera con facilidad. Pero lo íntimo lo guardas. Tienes dos modos: el exterior que avanza y el interior que acumula. ¿Cuándo se encuentran los dos?',
    BABA: 'Selectiva con la energía que das hacia afuera. Cuidas lo tuyo más que lo compartido. ¿Es eso una elección consciente o un patrón que simplemente ocurrió?',
    BABB: 'La única acción clara es cuando la oportunidad es directamente tuya. ¿Eso es claridad sobre tus prioridades, o es distancia de todo lo demás?',
    BBAA: 'Te repliegas cuando el conflicto es directo contigo. Pero en lo ajeno y en lo que pesa internamente, actúas. Como si fuera más fácil moverte cuando no eres el centro. ¿Qué pasa cuando sí lo eres?',
    BBAB: 'El único lugar donde actúas es cuando el problema pertenece a otros. Hay algo cómodo en resolver lo ajeno: el riesgo no es tuyo. ¿Cuándo fue la última vez que resolviste algo que sí lo era?',
    BBBA: 'La evitación es tu modo por defecto en casi todo. Salvo cuando algo pesa tanto que necesitas sacarlo. ¿Qué hay acumulado que aún no ha encontrado el momento de salir?',
    BBBB: 'Absorbes. Esperas. Te mantienes al margen. Guardas. Los sistemas de contención sin válvula eventualmente fallan. ¿Cuál es tu válvula?'
  };

  // ── Init ───────────────────────────────────────────────────────────
  function init() {
    document.getElementById('cube-star')
      ?.addEventListener('click', () => Engine.registerCentralTap());
  }

  // ── Estrella ───────────────────────────────────────────────────────
  function onStarClick(e) {
    e.stopPropagation();
    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">Este es el Bastión Hueco.<br>Un sistema construido para pensar.</p>
          <div class="modal-divider"></div>
          <p class="modal-poetic">Los 8 vértices que ves son nodos.<br>Cada uno contiene un concepto.<br>Cada concepto, un puzzle de lógica pura.</p>
          <p class="modal-poetic">Los nodos conectados por aristas no son independientes — uno puede iluminar a su vecino si sabes leer entre líneas.</p>
          <p class="modal-hint">Resuelve cada nodo. Cuando todos estén activos, el sistema te dará lo que necesitas para avanzar.</p>
        </div>
      `
    });
  }

  // ── Nodo Click ─────────────────────────────────────────────────────
  function onNodeClick(id) {
    const node = NODES[id];
    if (!node) return;

    if (solved.has(id)) {
      // Nodo ya resuelto — mostrar solo el remate
      Engine.openModal({ content: _remateContent(node) });
      return;
    }

    Engine.openModal({ content: _puzzleContent(node, id) });

    // Bind enter en input si aplica
    setTimeout(() => {
      document.getElementById(`f2-input-${id}`)
        ?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') checkAnswer(id);
        });
    }, 100);
  }

  // ── Contenido del puzzle ───────────────────────────────────────────
  function _puzzleContent(node, id) {
    const inputArea = node.type === 'input'
      ? `<div class="phase-input-group">
           <input id="f2-input-${id}" type="text" class="modal-input"
             placeholder="Tu respuesta..." autocomplete="off" spellcheck="false" />
           <button class="btn-primary" onclick="Fase2.checkAnswer('${id}')">Confirmar</button>
         </div>`
      : `<div class="puzzle-options" id="f2-opts-${id}">
           ${node.options.map(opt => `
             <div class="puzzle-option" onclick="Fase2.selectOption('${id}','${opt}')">
               <span class="option-text">${opt}</span>
             </div>
           `).join('')}
         </div>
         <div class="phase-input-group">
           <button class="btn-primary" onclick="Fase2.checkAnswer('${id}')">Confirmar</button>
         </div>`;

    return `
      <div class="node-modal-header">
        <div class="node-modal-tag">${node.titulo}</div>
        <div class="node-modal-theme">${node.tema}</div>
      </div>
      <p class="puzzle-question" style="text-align:left;font-style:normal;color:var(--color-text-dim);font-size:0.9rem;margin-bottom:var(--space-sm)">${node.intro}</p>
      <div class="puzzle-code-block">${node.code}</div>
      <p class="puzzle-question">${node.question}</p>
      ${inputArea}
      <p class="phase-error" id="f2-error-${id}"></p>
    `;
  }

  function _remateContent(node) {
    return `
      <div class="node-modal-header">
        <div class="node-modal-tag">${node.titulo} ✓</div>
        <div class="node-modal-theme">${node.tema}</div>
      </div>
      <div class="node-remate">
        ${node.remate.map(line => `<p>${line}</p>`).join('')}
      </div>
    `;
  }

  // ── Selección de opción ────────────────────────────────────────────
  let selectedOption = {};

  function selectOption(nodeId, opt) {
    selectedOption[nodeId] = opt;
    document.querySelectorAll(`#f2-opts-${nodeId} .puzzle-option`).forEach(el => {
      el.classList.toggle('selected', el.querySelector('.option-text').textContent === opt);
    });
  }

  // ── Validar respuesta ──────────────────────────────────────────────
  function checkAnswer(id) {
    const node  = NODES[id];
    const error = document.getElementById(`f2-error-${id}`);

    let userAnswer = '';
    if (node.type === 'input') {
      userAnswer = document.getElementById(`f2-input-${id}`)?.value?.trim() || '';
    } else {
      userAnswer = selectedOption[id] || '';
    }

    const isCorrect = Cipher.normalize(userAnswer) === Cipher.normalize(node.answer);

    if (isCorrect) {
      solved.add(id);
      document.getElementById(`node-${id}`)?.classList.add('solved');
      _updateCounter();
      Engine.closeModal();

      setTimeout(() => {
        if (node.extended === 'masks') {
          _showRemateAndExtended(node, _showMasksModal);
        } else if (node.extended === 'labyrinth') {
          _showRemateAndExtended(node, _showLabyrinthModal);
        } else {
          Engine.openModal({ content: _remateContent(node) });
        }

        if (solved.size === TOTAL) {
          setTimeout(() => {
            Engine.closeModal();
            _showHintModal();
          }, 3000);
        }
      }, 300);
    } else {
      if (error) {
        error.classList.add('visible');
        error.textContent = node.errorMsg;
      }
      if (node.type === 'input') {
        const input = document.getElementById(`f2-input-${id}`);
        input?.classList.remove('error');
        void input?.offsetWidth;
        input?.classList.add('error');
        setTimeout(() => input?.classList.remove('error'), 400);
      }
    }
  }

  function _showRemateAndExtended(node, extendedFn) {
    Engine.openModal({
      content: _remateContent(node),
      onClose: extendedFn
    });
  }

  // ── Máscaras ───────────────────────────────────────────────────────
  function _showMasksModal() {
    const items = MASKS.map(m => `
      <div class="mask-item">
        <div class="mask-name">${m.nombre}</div>
        <div class="mask-category">${m.cat}</div>
        <p class="mask-text">${m.texto}</p>
        <div class="mask-actions">
          <button class="mask-btn" id="mask-ponerse-${m.id}"
            onclick="Fase2.assignMask('ponerse','${m.id}')">Ponerse</button>
          <button class="mask-btn" id="mask-guardar-${m.id}"
            onclick="Fase2.assignMask('guardar','${m.id}')">Guardar</button>
          <button class="mask-btn" id="mask-soltar-${m.id}"
            onclick="Fase2.assignMask('soltar','${m.id}')">Soltar</button>
        </div>
      </div>
    `).join('');

    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">Ahora que entiendes lo que es una constante...</p>
          <p class="modal-poetic">¿Cuáles son las tuyas?</p>
          <p class="modal-hint">Elige una para ponerte, una para guardar y una para soltar.</p>
          <div class="modal-divider"></div>
          <div class="masks-grid">${items}</div>
          <div class="modal-divider"></div>
          <div class="phase-input-group">
            <button class="btn-primary" onclick="Fase2.confirmMasks()">Confirmar</button>
          </div>
          <p class="phase-error" id="masks-error"></p>
        </div>
      `
    });
  }

  function assignMask(action, maskId) {
    // Limpiar asignación previa de esta acción
    const prev = maskChoices[action];
    if (prev) {
      const prevBtn = document.getElementById(`mask-${action}-${prev}`);
      if (prevBtn) prevBtn.classList.remove(`active-${action}`);
    }
    maskChoices[action] = maskId;
    const btn = document.getElementById(`mask-${action}-${maskId}`);
    if (btn) btn.classList.add(`active-${action}`);
  }

  function confirmMasks() {
    const { ponerse, guardar, soltar } = maskChoices;
    const error = document.getElementById('masks-error');

    if (!ponerse || !guardar || !soltar) {
      if (error) { error.classList.add('visible'); error.textContent = 'Debes elegir una máscara para cada acción.'; }
      return;
    }
    if (new Set([ponerse, guardar, soltar]).size < 3) {
      if (error) { error.classList.add('visible'); error.textContent = 'Cada acción debe tener una máscara diferente.'; }
      return;
    }

    const mPonerse = MASKS.find(m => m.id === ponerse);
    const mGuardar = MASKS.find(m => m.id === guardar);
    const mSoltar  = MASKS.find(m => m.id === soltar);

    const catCode  = { Positiva: 'P', Ambigua: 'A', Negativa: 'N' };
    const tensionKey = catCode[mPonerse.cat] + catCode[mGuardar.cat];
    const tension    = TENSIONS[tensionKey] || '';
    const remate     = MASK_REMATES[soltar] || '';

    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">Elegiste mostrar tu <strong style="color:var(--f2-accent)">${mPonerse.nombre}</strong>,<br>
          guardar tu <strong style="color:var(--f2-accent)">${mGuardar.nombre}</strong>,<br>
          y soltar tu <strong style="color:var(--f2-accent)">${mSoltar.nombre}</strong>.</p>
          <div class="modal-divider"></div>
          <div class="node-remate">
            <p>${tension}</p>
            <br>
            <p>${remate}</p>
          </div>
        </div>
      `
    });
  }

  // ── Laberinto ──────────────────────────────────────────────────────
  let labStep = 0;

  function _showLabyrinthModal() {
    labStep = 0;
    Object.keys(labChoices).forEach(k => delete labChoices[k]);
    _showLabScenario(0);
  }

  function _showLabScenario(step) {
    const s = LAB_SCENARIOS[step];
    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic" style="font-style:normal;color:var(--color-text-dim);font-size:0.85rem;text-align:left">
            ${s.texto}
          </p>
          <p class="puzzle-question">${s.pregunta}</p>
          <div class="puzzle-options">
            ${s.opciones.map(opt => `
              <div class="puzzle-option" onclick="Fase2.labChoose('${s.id}','${opt.id}','${step}')">
                <span class="option-letter">${opt.id}</span>
                <span class="option-text">${opt.texto}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `
    });
  }

  function labChoose(scenarioId, choice, step) {
    labChoices[scenarioId] = choice;
    const s = LAB_SCENARIOS[step];

    // Mostrar respuesta breve del sistema
    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic" style="font-family:var(--font-mono);font-size:0.82rem;color:var(--color-text-muted)">
            ${s.respuestas[choice]}
          </p>
        </div>
      `,
      onClose: () => {
        const nextStep = parseInt(step) + 1;
        if (nextStep < LAB_SCENARIOS.length) {
          _showLabScenario(nextStep);
        } else {
          _showLabReveal();
        }
      }
    });
  }

  function _showLabReveal() {
    const key = LAB_SCENARIOS.map(s => labChoices[s.id] || 'B').join('');
    const revelation = LAB_REVELATIONS[key] || LAB_REVELATIONS['BBBB'];

    const choicesText = LAB_SCENARIOS.map((s, i) => {
      const choice = labChoices[s.id] || 'B';
      const label  = s.opciones.find(o => o.id === choice)?.texto || '';
      return `<p style="font-family:var(--font-mono);font-size:0.75rem;color:var(--color-text-muted);margin-bottom:4px">
        ${s.titulo}: <span style="color:var(--f2-accent)">${choice}</span>
      </p>`;
    }).join('');

    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">Cuatro decisiones.</p>
          ${choicesText}
          <p class="modal-poetic" style="margin-top:var(--space-sm)">Dieciséis combinaciones posibles.</p>
          <p class="modal-poetic">Todas llegaban a esta pantalla.</p>
          <p class="modal-poetic">La rueda giró.</p>
          <p class="modal-poetic" style="font-style:normal;font-size:0.9rem;color:var(--color-text-muted)">¿Notaste que no avanzaste?</p>
          <div class="modal-divider"></div>
          <div class="node-remate">
            <p>${revelation}</p>
          </div>
        </div>
      `
    });
  }

  // ── Modal de pista ─────────────────────────────────────────────────
  function _showHintModal() {
    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">El sistema ha sido completado.</p>
          <p class="modal-poetic">Pero el sistema no es quien decide lo que sigue.</p>
          <div class="modal-divider"></div>
          <p class="modal-poetic">Nuestro caprichoso creador te espera.</p>
          <p class="modal-poetic">Solo él puede darte lo que necesitas para continuar.</p>
          <p class="modal-poetic">Ve. Encuéntralo. Negocia.</p>
          <p class="modal-poetic">Ya sabes cómo funciona.</p>
          <div class="modal-divider"></div>
          <div class="phase-input-group">
            <input id="f2-puzzle-input" type="text" class="modal-input"
              placeholder="La palabra del sistema..." autocomplete="off" spellcheck="false" />
            <button class="btn-primary" onclick="Fase2.validatePuzzle()">Continuar</button>
          </div>
          <p class="phase-error" id="f2-puzzle-error"></p>
        </div>
      `
    });

    document.getElementById('f2-puzzle-input')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') validatePuzzle(); });
  }

  function validatePuzzle() {
    const input = document.getElementById('f2-puzzle-input');
    const error = document.getElementById('f2-puzzle-error');
    if (!input || !error) return;

    const isValid = Cipher.validate(input.value, PUZZLE_ENCODED, PUZZLE_SHIFT);

    if (isValid) {
      input.classList.add('success');
      setTimeout(() => {
      Engine.closeModal();
      setTimeout(() => Engine.showCheckpointScreen('fase_2', () => Engine.navigateTo('fase_3')), 300);
      }, 500);
    } else {
      input.classList.remove('error');
      void input.offsetWidth;
      input.classList.add('error');
      error.classList.add('visible');
      error.textContent = 'Valor incorrecto. El sistema no acepta aproximaciones.';
      setTimeout(() => input.classList.remove('error'), 400);
    }
  }

  // ── Puzzle de orden ────────────────────────────────────────────────
  let orderSelection = [];

  function _showOrderPuzzle() {
    orderSelection = [];
    const items = CORRECT_ORDER.map(id => {
      const n = NODES[id];
      return `
        <div class="puzzle-item" id="f2-order-${id}" data-id="${id}"
          onclick="Fase2.selectOrderItem('${id}')" role="button">
          <span class="font-mono text-accent" style="font-size:0.75rem">${n.label}</span>
          <span class="puzzle-name">${n.titulo}</span>
        </div>
      `;
    }).sort(() => Math.random() - 0.5).join('');

    Engine.openModal({
      content: `
        <div class="modal-body">
          <p class="modal-poetic">Los nodos tienen un orden.<br>El orden del pensamiento sistémico.</p>
          <p class="modal-hint">Ordénalos de lo más simple a lo más complejo.</p>
          <div class="modal-divider"></div>
          <div class="puzzle-grid">${items}</div>
          <div class="puzzle-sequence">
            <span class="puzzle-seq-label">Tu orden:</span>
            <div class="puzzle-seq-dots" id="f2-seq-dots"></div>
          </div>
          <div class="phase-input-group" style="margin-top:var(--space-md)">
            <button class="btn-primary" onclick="Fase2.checkOrder()">Confirmar</button>
            <button class="btn-secondary" onclick="Fase2.resetOrder()">Reiniciar</button>
          </div>
          <p class="phase-error" id="f2-order-error"></p>
        </div>
      `
    });
  }

  function selectOrderItem(id) {
    if (orderSelection.includes(id)) return;
    orderSelection.push(id);
    document.getElementById(`f2-order-${id}`)?.classList.add('selected');
    const dot = document.createElement('div');
    dot.className = 'seq-dot';
    dot.style.background = 'var(--f2-accent)';
    dot.title = NODES[id].titulo;
    document.getElementById('f2-seq-dots')?.appendChild(dot);
  }

  function resetOrder() {
    orderSelection = [];
    document.querySelectorAll('[id^="f2-order-"]').forEach(el => el.classList.remove('selected'));
    const dots = document.getElementById('f2-seq-dots');
    if (dots) dots.innerHTML = '';
    const err = document.getElementById('f2-order-error');
    if (err) { err.textContent = ''; err.classList.remove('visible'); }
  }

  function checkOrder() {
    const error = document.getElementById('f2-order-error');
    if (orderSelection.length < TOTAL) {
      if (error) { error.classList.add('visible'); error.textContent = 'El sistema espera todos los nodos ordenados.'; }
      return;
    }
    const isCorrect = orderSelection.every((id, i) => id === CORRECT_ORDER[i]);
    if (isCorrect) {
      Engine.closeModal();
      setTimeout(() => Engine.showCheckpointScreen('fase_2', () => Engine.navigateTo('fase_3')), 300);
    } else {
      if (error) { error.classList.add('visible'); error.textContent = 'El orden no es correcto. Piensa en la progresión del pensamiento sistémico.'; }
      resetOrder();
    }
  }

  // ── Counter ────────────────────────────────────────────────────────
  function _updateCounter() {
    const el = document.getElementById('nodes-counter');
    if (el) el.textContent = `${solved.size} / ${TOTAL} nodos resueltos`;
  }

  init();

  return {
    onStarClick, onNodeClick,
    checkAnswer, selectOption,
    assignMask, confirmMasks,
    labChoose,
    validatePuzzle,
    selectOrderItem, resetOrder, checkOrder
  };

})();
