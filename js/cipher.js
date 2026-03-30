/**
 * cipher.js
 * Ecos Entre Universos — Sistema de Cifrado César
 *
 * cc(valor, desplazamiento)
 *   desplazamiento > 0 → shift derecha
 *   desplazamiento < 0 → shift izquierda
 *
 * Ejemplo: cc("Nakiu", -6) === "hueco"
 */

const Cipher = (() => {

  const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const ALPHABET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /**
   * Aplica el cifrado César a un string.
   * Solo afecta letras a-z y A-Z. Ignora números, espacios y especiales.
   *
   * @param {string} value       - Texto a cifrar/descifrar
   * @param {number} shift       - Desplazamiento (positivo o negativo)
   * @returns {string}           - Texto resultante
   */
  function cc(value, shift) {
    if (typeof value !== 'string') return '';

    const normalizedShift = ((shift % 26) + 26) % 26;

    return value.split('').map(char => {
      if (ALPHABET_LOWER.includes(char)) {
        const idx = ALPHABET_LOWER.indexOf(char);
        return ALPHABET_LOWER[(idx + normalizedShift) % 26];
      }
      if (ALPHABET_UPPER.includes(char)) {
        const idx = ALPHABET_UPPER.indexOf(char);
        return ALPHABET_UPPER[(idx + normalizedShift) % 26];
      }
      return char;
    }).join('');
  }

  /**
   * Valida si el input del usuario coincide con la palabra objetivo.
   * Normaliza: lowercase, sin tildes, sin espacios.
   *
   * @param {string} input       - Lo que escribió el usuario
   * @param {string} encoded     - Valor cifrado almacenado en código
   * @param {number} shift       - Desplazamiento usado para cifrar
   * @returns {boolean}
   */
  function validate(input, encoded, shift) {
    const normalized = normalize(input);
    const decoded    = normalize(cc(encoded, -shift));
    return normalized === decoded;
  }

  /**
   * Normaliza un string: lowercase, sin tildes, sin espacios.
   *
   * @param {string} str
   * @returns {string}
   */
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // elimina tildes
      .replace(/\s+/g, '');            // elimina espacios
  }

  return { cc, validate, normalize };

})();
