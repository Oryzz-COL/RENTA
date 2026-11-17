// Run only to refresh reference images/fonts. The website never requests third-party assets.
import { writeFile, mkdir } from 'node:fs/promises';
await mkdir('assets', { recursive: true });
const photos = { living: 'photo-1600210492486-724fe5c67fb0', bedroom: 'photo-1611892440504-42a792e24d32', kitchen: 'photo-1556912172-45b7abe8b7e1', details: 'photo-1494438639946-1ebd1d20bf85' };
for (const [name, id] of Object.entries(photos)) {
  const response = await fetch(`https://images.unsplash.com/${id}?w=${name === 'living' ? 2000 : 1200}&q=85&fit=crop`);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  await writeFile(`assets/${name}.jpg`, Buffer.from(await response.arrayBuffer()));
  console.log(`Downloaded ${name}.jpg`);
}
for (const [name, url] of Object.entries({
  newsreader: 'https://cdn.jsdelivr.net/fontsource/fonts/newsreader:vf@latest/latin-wght-normal.woff2',
  'newsreader-italic': 'https://cdn.jsdelivr.net/fontsource/fonts/newsreader:vf@latest/latin-wght-italic.woff2',
  manrope: 'https://cdn.jsdelivr.net/fontsource/fonts/manrope:vf@latest/latin-wght-normal.woff2'
})) {
  const font = await fetch(url);
  if (!font.ok) throw new Error('Font binary download failed');
  await writeFile(`assets/${name}.woff2`, Buffer.from(await font.arrayBuffer()));
  console.log(`Downloaded ${name}.woff2`);
}
for (const name of ['newsreader', 'manrope']) {
  const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${name}/OFL.txt`);
  if (!license.ok) throw new Error('Font license download failed');
  await writeFile(`assets/${name}-OFL.txt`, await license.text());
}
