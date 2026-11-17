import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { property } from '../src/config.js';
import { content } from '../src/content.js';

test('preview starts without fake contact information or booking activation', () => {
  assert.equal(property.preview, true);
  assert.equal(property.whatsapp, null);
  assert.equal(property.address, null);
  assert.equal(property.legalOwner, null);
});
test('every reference photo exists locally', async () => {
  for (const photo of property.photos) {
    await access(`.${photo.src}`);
    assert.ok(photo.en && photo.es && photo.credit);
  }
});
test('fonts use actual WOFF2 binaries and ship with their licenses', async () => {
  for (const name of ['newsreader', 'newsreader-italic', 'manrope']) {
    const font = await readFile(`assets/${name}.woff2`);
    assert.equal(font.subarray(0, 4).toString(), 'wOF2');
  }
  for (const name of ['newsreader', 'manrope']) assert.match(await readFile(`assets/${name}-OFL.txt`, 'utf8'), /SIL OPEN FONT LICENSE/);
});
test('English and Spanish have the same content fields and legal sections', () => {
  assert.deepEqual(Object.keys(content.en).sort(), Object.keys(content.es).sort());
  for (const lang of ['es','en']) {
    assert.equal(content[lang].legalSections.length, 3);
    assert.equal(content[lang].faqs.length, 7);
    assert.equal(content[lang].areaPanels.length, 3);
  }
});
test('preview is excluded from search indexing', async () => {
  assert.match(await readFile('index.html','utf8'), /name="robots" content="noindex, nofollow"/);
});
