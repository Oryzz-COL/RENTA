import test from 'node:test';
import assert from 'node:assert/strict';
import { injectToken } from '../scripts/env.mjs';

test('injects a token only where the config has the null placeholder', () => {
  const src = "export const property = {\n  mapboxToken: null, // comment\n};";
  assert.match(injectToken(src, 'pk.abc.def'), /mapboxToken: "pk\.abc\.def",/);
  assert.equal(injectToken(src, null), src);
});
test('the committed config never contains a Mapbox token', async () => {
  const { readFile } = await import('node:fs/promises');
  assert.doesNotMatch(await readFile('src/config.js', 'utf8'), /pk\.eyJ|sk\.eyJ/);
});
