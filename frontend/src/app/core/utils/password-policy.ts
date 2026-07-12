/** Política mínima de senha compartilhada entre a troca e a redefinição de senha. */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Valida a nova senha contra a política mínima. Retorna uma mensagem amigável
 * quando inválida ou `null` quando aprovada.
 */
export function validatePasswordPolicy(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `A senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (!/[A-Za-z]/.test(password)) {
    return 'A senha deve conter ao menos uma letra.';
  }
  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter ao menos um número.';
  }
  return null;
}
