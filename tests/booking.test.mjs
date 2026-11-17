import test from 'node:test';
import assert from 'node:assert/strict';
import { departureDate, localDate, enquiryMessage } from '../src/booking.js';

test('uses calendar months and clamps the last day rather than overflowing', () => {
  assert.equal(departureDate('2027-01-31', 1), '2027-02-28');
  assert.equal(departureDate('2028-01-31', 1), '2028-02-29');
  assert.equal(departureDate('2026-08-31', 1), '2026-09-30');
});
test('supports a semester and a year across year boundaries', () => {
  assert.equal(departureDate('2026-11-17', 6), '2027-05-17');
  assert.equal(departureDate('2028-02-29', 12), '2029-02-28');
});
test('rejects daily/weekly lengths and durations outside the supported range', () => {
  for (const months of [0, -1, 13, 0.25, NaN, '1']) assert.equal(departureDate('2027-01-01', months), null);
});
test('rejects nonexistent or malformed arrival dates', () => {
  for (const date of ['2027-02-29', '2027-02-31', '2026-13-01', '2026-00-01', '', '17/11/2026', '<script>']) assert.equal(departureDate(date, 1), null);
});
test('formats a date using local calendar values', () => {
  assert.equal(localDate(new Date(2027, 0, 2, 0, 1)), '2027-01-02');
});
test('both languages explicitly describe an enquiry rather than a confirmed booking', () => {
  const data = {name:'Test Guest', email:'test@example.com', arrival:'2027-01-31', months:'1', note:'Campus question'};
  assert.match(enquiryMessage(data, 'en'), /not a confirmed booking/);
  assert.match(enquiryMessage(data, 'es'), /no confirma una reserva/);
  for (const lang of ['en', 'es']) {
    const message = enquiryMessage(data, lang);
    assert.match(message, /2027-02-28/);
    assert.match(message, /Campus question/);
    assert.match(message, /test@example.com/);
  }
});
