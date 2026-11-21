// Straight-line distance in metres (haversine).
export function distanceMeters(a, b) {
  const R = 6371000;
  const rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Walking minutes from a straight line: city streets add roughly 30% to the route at about 80 m per minute.
export function walkMinutes(meters) {
  return Math.max(1, Math.round(meters * 1.3 / 80));
}

export function formatDistance(meters, lang) {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;
  const km = (meters / 1000).toFixed(1);
  return `${lang === 'es' ? km.replace('.', ',') : km} km`;
}
