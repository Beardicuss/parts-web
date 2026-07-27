import { describe, expect, it } from 'vitest';
import { API_ERROR_CODES, ApiError, toApiError } from './apiErrors.js';

describe('structured API errors', () => {
  it.each([
    [{ status: 403 }, API_ERROR_CODES.UNAUTHORIZED],
    [{ code: 'PGRST116' }, API_ERROR_CODES.NOT_FOUND],
    [{ code: '23505' }, API_ERROR_CODES.CONFLICT],
    [{ code: '23514' }, API_ERROR_CODES.VALIDATION]
  ])('maps service failures to stable UI codes', (serviceError, expectedCode) => {
    expect(toApiError(serviceError).code).toBe(expectedCode);
  });

  it('marks network failures retryable and preserves existing ApiError values', () => {
    const networkError = toApiError(new TypeError('Failed to fetch'));
    expect(networkError.code).toBe(API_ERROR_CODES.NETWORK);
    expect(networkError.retryable).toBe(true);

    const existing = new ApiError(API_ERROR_CODES.CONFIGURATION, 'Missing configuration');
    expect(toApiError(existing)).toBe(existing);
  });
});
