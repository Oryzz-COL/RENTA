// Interactive 3D neighborhood map.
// With property.mapboxToken: Mapbox GL JS v3 + Mapbox Standard (real 3D buildings, landmarks, lighting) and a satellite view.
// Without it: MapLibre GL (self-hosted) + OpenFreeMap vector tiles as a no-account fallback.
import { property, places } from './config.js';

const MAPBOX_VERSION = '3.8.0';
const MAPBOX_STYLES = { city: 'mapbox://styles/mapbox/standard', satellite: 'mapbox://styles/mapbox/standard-satellite' };
const FALLBACK_STYLE = 'https://tiles.openfreemap.org/styles/positron';
export const usesMapbox = () => /^pk\./.test(property.mapboxToken || '');

let loader;
function addAsset(tag, attrs) {
  return new Promise((resolve, reject) => {
    const el = Object.assign(document.createElement(tag), attrs);
    el.onload = resolve; el.onerror = () => reject(new Error(`Failed to load ${attrs.src || attrs.href}`));
    document.head.append(el);
  });
}
function loadLibrary() {
  loader ||= (usesMapbox()
    ? Promise.all([
        addAsset('link', { rel: 'stylesheet', href: `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.css` }),
        addAsset('script', { src: `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.js` })
      ]).then(() => { window.mapboxgl.accessToken = property.mapboxToken; return window.mapboxgl; })
    : Promise.all([
        addAsset('link', { rel: 'stylesheet', href: '/assets/vendor/maplibre/maplibre-gl.css' }),
        addAsset('script', { src: '/assets/vendor/maplibre/maplibre-gl.js' })
      ]).then(() => window.maplibregl)
  ).catch(error => { loader = null; throw error; });
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

// Light OpenFreeMap styling plus extruded buildings, used only without Mapbox.
function styleFallback(map) {
  const set = (id, prop, val) => { if (map.getLayer(id)) map.setPaintProperty(id, prop, val); };
  set('background', 'background-color', token('--paper'));
  set('park', 'fill-color', token('--map-green'));
  set('landcover_wood', 'fill-color', token('--map-green'));
  set('water', 'fill-color', token('--map-water'));
  set('landuse_residential', 'fill-color', token('--sand'));
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
}

export function createMap(container, { t, onSelect }) {
  let map, popup, gl, orbiting = false, routeData = { type: 'FeatureCollection', features: [] };
  const home = property.location;
  const mapbox = usesMapbox();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const markers = new Map();
  const view = { zoom: 16.2, pitch: 62, bearing: -28 };

  // Walk rings and the route line; re-added whenever the style changes.
  function addOverlays() {
    const slot = mapbox ? { slot: 'top' } : {};
    const gold = token('--gold'), ink = token('--ink'), paper = token('--paper');
    if (!map.getSource('walk')) map.addSource('walk', { type: 'geojson', data: { type: 'FeatureCollection', features: [
      { type: 'Feature', properties: { label: `5 ${t.walk}` }, geometry: { type: 'LineString', coordinates: ring(home, 400 / 1.3) } },
      { type: 'Feature', properties: { label: `10 ${t.walk}` }, geometry: { type: 'LineString', coordinates: ring(home, 800 / 1.3) } }
    ] } });
    if (!map.getSource('route')) map.addSource('route', { type: 'geojson', data: routeData });
    if (!map.getLayer('walk-rings')) map.addLayer({ id: 'walk-rings', type: 'line', source: 'walk', ...slot, paint: { 'line-color': gold, 'line-width': 2, 'line-dasharray': [2, 2], ...(mapbox ? { 'line-emissive-strength': 1 } : {}) } });
    if (!map.getLayer('walk-labels')) map.addLayer({ id: 'walk-labels', type: 'symbol', source: 'walk', ...slot,
      layout: { 'symbol-placement': 'line', 'text-field': ['get', 'label'], 'text-size': 12, 'symbol-spacing': 400, ...(mapbox ? {} : { 'text-font': ['Noto Sans Regular'] }) },
      paint: { 'text-color': ink, 'text-halo-color': paper, 'text-halo-width': 2 } });
    if (!map.getLayer('route')) map.addLayer({ id: 'route', type: 'line', source: 'route', ...slot, paint: { 'line-color': mapbox ? gold : ink, 'line-width': 3, 'line-opacity': 0.9, ...(mapbox ? { 'line-emissive-strength': 1 } : {}) } });
  }

  const ready = loadLibrary().then(lib => new Promise((resolve, reject) => {
    gl = lib;
    map = new gl.Map({
      container,
      style: mapbox ? MAPBOX_STYLES.city : FALLBACK_STYLE,
      center: [home.lng, home.lat], ...view,
      attributionControl: !mapbox, cooperativeGestures: true, maxPitch: 75,
      ...(mapbox ? { config: { basemap: { lightPreset: 'day', showPointOfInterestLabels: false, showTransitLabels: true } } } : {})
    });
    map.addControl(new gl.NavigationControl({ visualizePitch: true }), 'top-right');
    if (!mapbox) map.addControl(new gl.AttributionControl({ compact: true, customAttribution: t.mapCredit }));
    else map.addControl(new gl.AttributionControl({ compact: true }));
    map.on('error', e => { if (!map.loaded()) reject(e.error); });
    map.on('style.load', () => {
      if (mapbox) map.setConfigProperty?.('basemap', 'showPointOfInterestLabels', false);
      addOverlays();
    });
    map.once('load', () => {
      if (!mapbox) styleFallback(map);
      addOverlays();
      const homeEl = document.createElement('div');
      homeEl.className = 'pin-home';
      homeEl.innerHTML = `<span>${t.studioPin}</span>`;
      new gl.Marker({ element: homeEl, anchor: 'bottom' }).setLngLat([home.lng, home.lat]).addTo(map);
      for (const p of places) {
        const el = document.createElement('button');
        el.type = 'button'; el.className = `pin pin-${p.cat}`; el.dataset.cat = p.cat;
        el.setAttribute('aria-label', p.name);
        el.addEventListener('click', e => { e.stopPropagation(); onSelect(p.id); });
        markers.set(p.id, new gl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map));
      }
      popup = new gl.Popup({ closeButton: false, offset: 16, className: 'map-popup' });
      resolve(map);
    });
  }));

  const setRoute = data => { routeData = data; map.getSource('route')?.setData(data); };
  function stopOrbit() { orbiting = false; }
  return {
    ready,
    supportsSatellite: mapbox,
    focus(place, html) {
      ready.then(() => {
        stopOrbit();
        markers.forEach((m, id) => m.getElement().classList.toggle('is-active', id === place.id));
        setRoute({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[home.lng, home.lat], [place.lng, place.lat]] } });
        const bounds = new gl.LngLatBounds([home.lng, home.lat], [home.lng, home.lat]).extend([place.lng, place.lat]);
        map.fitBounds(bounds, { padding: 120, maxZoom: 16.6, pitch: 58, bearing: map.getBearing(), duration: reduced ? 0 : 1600 });
        popup.setLngLat([place.lng, place.lat]).setHTML(html).addTo(map);
      });
    },
    filter(cat) {
      ready.then(() => markers.forEach(m => { m.getElement().hidden = !(cat === 'all' || m.getElement().dataset.cat === cat); }));
    },
    setView(name) {
      ready.then(() => { if (mapbox && MAPBOX_STYLES[name]) map.setStyle(MAPBOX_STYLES[name]); });
    },
    reset() {
      ready.then(() => {
        stopOrbit(); popup.remove();
        markers.forEach(m => m.getElement().classList.remove('is-active'));
        setRoute({ type: 'FeatureCollection', features: [] });
        map.flyTo({ center: [home.lng, home.lat], ...view, duration: reduced ? 0 : 1600 });
      });
    },
    orbit() {
      ready.then(() => {
        if (reduced) { map.easeTo({ bearing: map.getBearing() + 90, duration: 0 }); return; }
        popup.remove(); orbiting = true;
        map.easeTo({ center: [home.lng, home.lat], zoom: 17, pitch: 68, duration: 1400 });
        const turn = () => {
          if (!orbiting) return;
          map.easeTo({ bearing: map.getBearing() + 40, duration: 2600, easing: x => x });
          map.once('moveend', turn);
        };
        map.once('moveend', () => setTimeout(turn, 50));
        map.once('mousedown', stopOrbit); map.once('touchstart', stopOrbit); map.once('wheel', stopOrbit);
        setTimeout(stopOrbit, 24000);
      });
    },
    destroy() { stopOrbit(); map?.remove(); }
  };
}
