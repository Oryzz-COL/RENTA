import { mkdir, cp, access, rm } from 'node:fs/promises';
import { property } from '../src/config.js';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const name of ['index.html', 'src', 'assets']) await cp(name, `dist/${name}`, { recursive: true });
const required = [...property.photos.map(p => p.src.slice(1)), 'assets/food.jpg', 'assets/coffee.jpg', 'assets/newsreader.woff2', 'assets/manrope.woff2', 'assets/vendor/maplibre/maplibre-gl.js', 'assets/vendor/maplibre/maplibre-gl.css'];
for (const file of required) await access(`dist/${file}`);
console.log('Static site built in dist/');
