export const API_ERROR_CODES = Object.freeze({
  CONFIGURATION: 'configuration',
  NETWORK: 'network',
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
  VALIDATION: 'validation',
  CONFLICT: 'conflict',
  DATABASE: 'database',
  CLEANUP: 'cleanup'
});

export class ApiError extends Error {
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = 'ApiError';
    this.code = code;
    this.retryable = options.retryable ?? code === API_ERROR_CODES.NETWORK;
    this.details = options.details ?? null;
  }
}

export function toApiError(error, fallbackMessage = 'The catalog request failed.') {
  if (error instanceof ApiError) return error;

  const status = error?.status;
  const code = error?.code;
  if (status === 401 || status === 403 || code === 'PGRST301' || code === '42501') {
    return new ApiError(API_ERROR_CODES.UNAUTHORIZED, 'Your admin session is not authorized.', {
      details: error
    });
  }
  if (code === 'PGRST116') {
    return new ApiError(API_ERROR_CODES.NOT_FOUND, 'The requested catalog record was not found.', {
      details: error
    });
  }
  if (code === '23505') {
    return new ApiError(API_ERROR_CODES.CONFLICT, 'A record with this value already exists.', {
      details: error
    });
  }
  if (code === '23514' || String(code ?? '').startsWith('22')) {
    return new ApiError(API_ERROR_CODES.VALIDATION, 'The submitted catalog data is invalid.', {
      details: error
    });
  }
  if (
    error instanceof TypeError ||
    /fetch|network|offline|timeout|connection/i.test(error?.message ?? '')
  ) {
    return new ApiError(API_ERROR_CODES.NETWORK, 'The catalog service is currently unreachable.', {
      cause: error,
      retryable: true
    });
  }
  return new ApiError(API_ERROR_CODES.DATABASE, error?.message || fallbackMessage, {
    cause: error,
    details: error
  });
}
