// Reads the public Mapbox token from the environment or a local, git-ignored .env file,
// and injects it into src/config.js when serving or building. The token never lives in Git.
import { readFileSync } from 'node:fs';

export function mapboxToken() {
  let token = process.env.MAPBOX_TOKEN;
  if (!token) {
    try {
      const line = readFileSync('.env', 'utf8').split(/\r?\n/).find(l => l.startsWith('MAPBOX_TOKEN='));
      token = line?.slice('MAPBOX_TOKEN='.length).trim().replace(/^["']|["']$/g, '');
    } catch { /* No .env file: fall back to the no-token map. */ }
  }
  if (!token) return null;
  if (!/^pk\.[\w-]+\.[\w-]+$/.test(token)) throw new Error('MAPBOX_TOKEN must be a public token (pk.…). Never use a secret sk. token.');
  return token;
}

export function injectToken(source, token = mapboxToken()) {
  return token ? source.replace(/mapboxToken: null,/, `mapboxToken: ${JSON.stringify(token)},`) : source;
}
