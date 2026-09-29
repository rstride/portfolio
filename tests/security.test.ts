import assert from 'node:assert/strict';
import test from 'node:test';

import { GET as getSecurityTxt } from '@/app/.well-known/security.txt/route';
import manifest from '@/app/manifest';
import { contentSecurityPolicy, securityHeaders } from '@/lib/security-headers';

test('baseline security headers use report-only CSP during rollout', () => {
  const headers = new Map(securityHeaders.map(({ key, value }) => [key, value]));
  assert.equal(headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(headers.get('X-Frame-Options'), 'DENY');
  assert.equal(headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.equal(headers.get('Content-Security-Policy-Report-Only'), contentSecurityPolicy);
  assert.match(contentSecurityPolicy, /object-src 'none'/);
  assert.match(contentSecurityPolicy, /frame-ancestors 'none'/);
  assert.match(contentSecurityPolicy, /form-action 'self'/);
});

test('security.txt declares contact, canonical URL, languages, and a future expiry', async () => {
  const response = getSecurityTxt();
  const body = await response.text();
  const expires = body.match(/^Expires: (.+)$/m)?.[1];

  assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
  assert.match(body, /^Contact: mailto:contact@rstride\.fr$/m);
  assert.match(body, /^Preferred-Languages: fr, en$/m);
  assert.match(body, /^Canonical: https:\/\/rstride\.fr\/\.well-known\/security\.txt$/m);
  assert.ok(expires && Date.parse(expires) > Date.now());
});

test('web manifest exposes branded standalone icons', () => {
  const value = manifest();
  assert.equal(value.display, 'standalone');
  assert.equal(value.theme_color, '#0c0e12');
  assert.deepEqual(value.icons?.map(({ src }) => src), ['/icon-192.png', '/icon-512.png']);
});
