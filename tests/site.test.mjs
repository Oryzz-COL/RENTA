import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { property, places, placeCategories } from '../src/config.js';
import { content } from '../src/content.js';

test('preview starts without fake contact information or booking activation', () => {
  assert.equal(property.preview, true);
  assert.equal(property.whatsapp, null);
  assert.equal(property.legalOwner, null);
  assert.equal(property.brand, 'Smart Studio');
});
test('every gallery photo exists locally and is captioned in both languages', async () => {
  assert.ok(property.photos.length >= 6, 'the 3D ring needs at least six photos');
  for (const photo of property.photos) {
    await access(`.${photo.src}`);
    assert.ok(photo.en && photo.es);
  }
});
test('the map library is self-hosted with its license', async () => {
  for (const file of ['maplibre-gl.js', 'maplibre-gl.css', 'LICENSE.txt']) await access(`assets/vendor/maplibre/${file}`);
  assert.match(await readFile('src/map.js', 'utf8'), /\/assets\/vendor\/maplibre\/maplibre-gl\.js/);
});
test('places are near the studio, categorised and described in both languages', () => {
  const ids = new Set();
  for (const p of places) {
    assert.ok(placeCategories.includes(p.cat), `${p.id} has a known category`);
    assert.ok(p.name && p.en && p.es);
    assert.ok(!ids.has(p.id)); ids.add(p.id);
    assert.ok(Math.abs(p.lat - property.location.lat) < 0.03 && Math.abs(p.lng - property.location.lng) < 0.03, `${p.id} is in North Bogotá`);
  }
  for (const cat of placeCategories) assert.ok(places.some(p => p.cat === cat), `${cat} has at least one place`);
});
test('fonts use actual WOFF2 binaries and ship with their licenses', async () => {
  for (const name of ['newsreader', 'manrope']) {
    const font = await readFile(`assets/${name}.woff2`);
    assert.equal(font.subarray(0, 4).toString(), 'wOF2');
    assert.match(await readFile(`assets/${name}-OFL.txt`, 'utf8'), /SIL OPEN FONT LICENSE/);
  }
});
test('English and Spanish have the same content keys and list lengths', () => {
  const { en, es } = content;
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
  for (const key of Object.keys(en)) {
    if (Array.isArray(en[key])) assert.equal(en[key].length, es[key].length, key);
  }
  assert.deepEqual(Object.keys(en.cats).sort(), ['all', ...placeCategories].sort());
  assert.equal(en.kit.length, 3);
});
test('copy keeps the brand rules: no luxury filler and the welcome kit is never called free', () => {
  for (const lang of ['en', 'es']) {
    const text = JSON.stringify(content[lang]).toLowerCase();
    assert.doesNotMatch(text, /\bluxury\b|\blujo\b/);
    assert.doesNotMatch(text, /\bfree\b|\bgratis\b/);
  }
});
test('only a public Mapbox token can be configured', () => {
  if (property.mapboxToken !== null) assert.match(property.mapboxToken, /^pk\.[\w-]+\.[\w-]+$/);
  assert.equal(typeof property.mapboxSatellite, 'boolean');
});
test('preview is excluded from search indexing', async () => {
  assert.match(await readFile('index.html', 'utf8'), /name="robots" content="noindex, nofollow"/);
});
