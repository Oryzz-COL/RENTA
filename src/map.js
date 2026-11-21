// Interactive 3D neighborhood map: MapLibre GL (self-hosted) + OpenFreeMap vector tiles. No account or token needed.
import { property, places } from './config.js';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
let loader;
function loadLibrary() {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  loader ||= new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = '/assets/vendor/maplibre/maplibre-gl.css';
    document.head.append(css);
    const script = document.createElement('script');
    script.src = '/assets/vendor/maplibre/maplibre-gl.js';
    script.onload = () => resolve(window.maplibregl);
    script.onerror = () => { loader = null; reject(new Error('Map library failed to load')); };
    document.head.append(script);
  });
  return loader;
}

const token = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function ring(center, meters, steps = 72) {
  const coords = [];
  const dLat = meters / 111320, dLng = meters / (111320 * Math.cos(center.lat * Math.PI / 180));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    coords.push([center.lng + dLng * Math.cos(a), center.lat + dLat * Math.sin(a)]);
  }
  return coords;
}

export function createMap(container, { t, onSelect }) {
  let map, popup, orbiting = false;
  const home = property.location;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const markers = new Map();

  const ready = loadLibrary().then(maplibregl => new Promise((resolve, reject) => {
    map = new maplibregl.Map({
      container, style: STYLE_URL,
      center: [home.lng, home.lat], zoom: 15.2, pitch: 55, bearing: -20,
      attributionControl: false, cooperativeGestures: true, maxPitch: 70
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: t.mapCredit }));
    map.on('error', e => { if (!map.loaded()) reject(e.error); });
    map.on('load', () => {
      const ink = token('--ink'), paper = token('--paper'), sand = token('--sand'), gold = token('--gold'), green = token('--map-green'), water = token('--map-water');
      const set = (id, prop, val) => { if (map.getLayer(id)) map.setPaintProperty(id, prop, val); };
      set('background', 'background-color', paper);
      set('park', 'fill-color', green);
      set('landcover_wood', 'fill-color', green);
      set('water', 'fill-color', water);
      set('landuse_residential', 'fill-color', sand);
      if (map.getLayer('building')) map.setLayoutProperty('building', 'visibility', 'none');
      map.addLayer({
        id: 'buildings-3d', type: 'fill-extrusion', source: 'openmaptiles', 'source-layer': 'building', minzoom: 13,
        paint: {
          'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 8], 0, token('--map-build-low'), 60, token('--map-build-high')],
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
          'fill-extrusion-opacity': 0.92
        }
      }, map.getLayer('waterway_line_label') ? 'waterway_line_label' : undefined);

      map.addSource('walk', { type: 'geojson', data: { type: 'FeatureCollection', features: [
        { type: 'Feature', properties: { label: `5 ${t.walk}` }, geometry: { type: 'LineString', coordinates: ring(home, 400 / 1.3) } },
        { type: 'Feature', properties: { label: `10 ${t.walk}` }, geometry: { type: 'LineString', coordinates: ring(home, 800 / 1.3) } }
      ] } });
      map.addLayer({ id: 'walk-rings', type: 'line', source: 'walk', paint: { 'line-color': gold, 'line-width': 1.6, 'line-dasharray': [2, 2] } });
      map.addLayer({ id: 'walk-labels', type: 'symbol', source: 'walk', layout: { 'symbol-placement': 'line', 'text-field': ['get', 'label'], 'text-font': ['Noto Sans Regular'], 'text-size': 12, 'symbol-spacing': 400 }, paint: { 'text-color': ink, 'text-halo-color': paper, 'text-halo-width': 2 } });
      map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': ink, 'line-width': 2.4, 'line-opacity': 0.75 } });

      const homeEl = document.createElement('div');
      homeEl.className = 'pin-home';
      homeEl.innerHTML = `<span>${t.studioPin}</span>`;
      new maplibregl.Marker({ element: homeEl, anchor: 'bottom' }).setLngLat([home.lng, home.lat]).addTo(map);

      for (const p of places) {
        const el = document.createElement('button');
        el.type = 'button'; el.className = `pin pin-${p.cat}`; el.dataset.cat = p.cat;
        el.setAttribute('aria-label', p.name);
        el.addEventListener('click', e => { e.stopPropagation(); onSelect(p.id); });
        markers.set(p.id, new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map));
      }
      popup = new maplibregl.Popup({ closeButton: false, offset: 16, className: 'map-popup' });
      resolve(map);
    });
  }));

  function stopOrbit() { orbiting = false; }
  return {
    ready,
    focus(place, html) {
      ready.then(() => {
        stopOrbit();
        markers.forEach((m, id) => m.getElement().classList.toggle('is-active', id === place.id));
        map.getSource('route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [[home.lng, home.lat], [place.lng, place.lat]] } });
        const bounds = new window.maplibregl.LngLatBounds([home.lng, home.lat], [home.lng, home.lat]).extend([place.lng, place.lat]);
        map.fitBounds(bounds, { padding: 110, maxZoom: 16.2, pitch: 55, duration: reduced ? 0 : 1400 });
        popup.setLngLat([place.lng, place.lat]).setHTML(html).addTo(map);
      });
    },
    filter(cat) {
      ready.then(() => markers.forEach(m => { m.getElement().hidden = !(cat === 'all' || m.getElement().dataset.cat === cat); }));
    },
    reset() {
      ready.then(() => {
        stopOrbit(); popup.remove();
        markers.forEach(m => m.getElement().classList.remove('is-active'));
        map.getSource('route').setData({ type: 'FeatureCollection', features: [] });
        map.flyTo({ center: [home.lng, home.lat], zoom: 15.2, pitch: 55, bearing: -20, duration: reduced ? 0 : 1400 });
      });
    },
    orbit() {
      ready.then(() => {
        if (reduced) { map.easeTo({ bearing: map.getBearing() + 90, duration: 0 }); return; }
        popup.remove(); orbiting = true;
        map.easeTo({ center: [home.lng, home.lat], zoom: 16.4, pitch: 62, duration: 1200 });
        const turn = () => {
          if (!orbiting) return;
          map.easeTo({ bearing: map.getBearing() + 40, duration: 2200, easing: x => x });
          map.once('moveend', turn);
        };
        map.once('moveend', () => setTimeout(turn, 50));
        map.once('mousedown', stopOrbit); map.once('touchstart', stopOrbit); map.once('wheel', stopOrbit);
        setTimeout(stopOrbit, 20000);
      });
    },
    destroy() { stopOrbit(); map?.remove(); }
  };
}
