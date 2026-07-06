import { HttpErrorResponse } from '@angular/common/http';

interface ValidationViolation {
  field?: string;
  message?: string;
}

/**
 * Extrai uma mensagem de erro legível a partir de uma resposta HTTP de erro.
 *
 * Cobre os formatos que o backend Quarkus produz:
 * - Bean Validation: `{ title, violations: [{ field, message }] }`
 * - Exceções de negócio / mappers: `{ message: '...' }`
 * - Corpos vazios (ex.: 403 do controle de acesso) → mensagem por status
 * - Falha de rede (status 0) → mensagem de conexão
 *
 * @param err     o erro capturado no `subscribe({ error })`
 * @param fallback mensagem usada quando nada mais se aplica
 */
export function extractApiError(
  err: unknown,
  fallback = 'Ocorreu um erro inesperado. Tente novamente.',
): string {
  if (!(err instanceof HttpErrorResponse)) {
    return fallback;
  }

  // Sem resposta do servidor (offline, CORS, servidor fora do ar).
  if (err.status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }

  const body = err.error as
    | { message?: unknown; title?: unknown; violations?: ValidationViolation[] }
    | string
    | null
    | undefined;

  if (body && typeof body === 'object') {
    // Erros de validação de campos (Bean Validation).
    if (Array.isArray(body.violations) && body.violations.length > 0) {
      const messages = body.violations
        .map((v) => v?.message)
        .filter((m): m is string => typeof m === 'string' && m.trim().length > 0);
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }
    // Mensagem de negócio padronizada.
    if (typeof body.message === 'string' && body.message.trim().length > 0) {
      return body.message;
    }
    if (typeof body.title === 'string' && body.title.trim().length > 0) {
      return body.title;
    }
  } else if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  // Fallback por status quando o corpo não traz mensagem.
  switch (err.status) {
    case 401:
      return 'Sua sessão expirou. Faça login novamente.';
    case 403:
      return 'Você não tem permissão para executar esta ação.';
    case 404:
      return 'Registro não encontrado.';
    case 409:
      return 'Este registro já existe ou está em uso e não pode ser alterado.';
    case 500:
      return 'Erro interno no servidor. Tente novamente mais tarde.';
    default:
      return fallback;
  }
}
