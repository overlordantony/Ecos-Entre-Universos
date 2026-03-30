/**
 * checkpoint.js
 * Ecos Entre Universos — Sistema de Checkpoints
 *
 * Gestiona los códigos de checkpoint para reanudar el progreso.
 * No usa localStorage — el progreso es responsabilidad de la jugadora.
 *
 * Checkpoints por fase:
 *   ECO-AERYN-01  → inicia Fase 2
 *   ECO-NODO-02   → inicia Fase 3
 *   ECO-VACIO-03  → inicia Fase 4
 *   ECO-NUEVO-04  → juego completado
 */

const Checkpoint = (() => {

  // Mapa de checkpoints → fase destino
  const CHECKPOINTS = {
    'ECO-AERYN-01': 'fase_2',
    'ECO-NODO-02' : 'fase_3',
    'ECO-VACIO-03': 'fase_final',
    'ECO-NUEVO-04': 'completed',
  };

  /**
   * Valida un código de checkpoint.
   *
   * @param {string} code - Código introducido por la jugadora
   * @returns {{ valid: boolean, destination: string|null }}
   */
  function validate(code) {
    const normalized = code.trim().toUpperCase();
    if (CHECKPOINTS[normalized]) {
      return { valid: true, destination: CHECKPOINTS[normalized] };
    }
    return { valid: false, destination: null };
  }

  /**
   * Devuelve el código de checkpoint correspondiente a una fase completada.
   *
   * @param {string} phase - 'fase_1' | 'fase_2' | 'fase_3' | 'fase_final'
   * @returns {string}
   */
  function getCode(phase) {
    const CODES = {
      'fase_1'    : 'ECO-AERYN-01',
      'fase_2'    : 'ECO-NODO-02',
      'fase_3'    : 'ECO-VACIO-03',
      'fase_final': 'ECO-NUEVO-04',
    };
    return CODES[phase] || '';
  }

  return { validate, getCode };

})();
