import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceMeters, walkMinutes, formatDistance } from '../src/geo.js';

test('haversine distance matches a known short span', () => {
  const a = { lat: 4.7137, lng: -74.0356 };
  assert.equal(distanceMeters(a, a), 0);
  const north = { lat: 4.7137 + 0.009, lng: -74.0356 };
  assert.ok(Math.abs(distanceMeters(a, north) - 1000) < 10);
});
test('walking minutes are rounded and never zero', () => {
  assert.equal(walkMinutes(0), 1);
  assert.equal(walkMinutes(308), 5);
  assert.equal(walkMinutes(615), 10);
});
test('distances format per language', () => {
  assert.equal(formatDistance(342, 'en'), '340 m');
  assert.equal(formatDistance(1530, 'en'), '1.5 km');
  assert.equal(formatDistance(1530, 'es'), '1,5 km');
});
