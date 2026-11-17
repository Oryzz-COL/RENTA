import { mkdir, cp, access } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const name of ['index.html', 'src', 'assets']) await cp(name, `dist/${name}`, { recursive: true });
for (const name of ['living.jpg', 'bedroom.jpg', 'kitchen.jpg', 'details.jpg', 'newsreader.woff2', 'newsreader-italic.woff2', 'manrope.woff2']) await access(`dist/assets/${name}`);
console.log('Static site built in dist/');
