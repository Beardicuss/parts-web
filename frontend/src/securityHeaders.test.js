import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Cloudflare Pages security headers', () => {
  it('defines the required production response headers', async () => {
    const headers = await readFile(path.join(process.cwd(), 'public', '_headers'), 'utf8');

    expect(headers).toContain("Content-Security-Policy: default-src 'self'");
    expect(headers).toContain("frame-ancestors 'none'");
    expect(headers).toContain('X-Content-Type-Options: nosniff');
    expect(headers).toContain('X-Frame-Options: DENY');
    expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin');
    expect(headers).toContain('Permissions-Policy:');
    expect(headers).toContain('Strict-Transport-Security:');
    expect(headers).not.toContain("'unsafe-inline'");
    expect(headers).not.toContain("'unsafe-eval'");
  });
});
