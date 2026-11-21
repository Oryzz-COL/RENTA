// Line icons, 24px grid, drawn with currentColor.
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const icons = {
  arrow: svg('<path d="M4 12h15m-6-6 6 6-6 6"/>'),
  left: svg('<path d="m14 6-6 6 6 6"/>'),
  right: svg('<path d="m10 6 6 6-6 6"/>'),
  close: svg('<path d="m6 6 12 12M6 18 18 6"/>'),
  plane: svg('<path d="M3 14.5 21 7l-3 11-5-3-2.5 4-1-5L3 14.5Z"/><path d="m9.5 14 8.5-7"/>'),
  breakfast: svg('<path d="M4 10h12v3a6 6 0 0 1-12 0v-3Z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H15"/><path d="M8 3c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4"/><path d="M3 21h14"/>'),
  coffee: svg('<ellipse cx="12" cy="12" rx="6" ry="8.5" transform="rotate(30 12 12)"/><path d="M8.5 18.5c3-2 1-6 4-8.5s3.5-3 2.5-6"/>'),
  sparkle: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
  drop: svg('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>'),
  tv: svg('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>'),
  key: svg('<circle cx="8" cy="12" r="4"/><path d="M12 12h9m-3 0v3m-3-3v2"/>'),
  voice: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  desk: svg('<path d="M3 9h18M5 9v11M19 9v11M5 14h14"/><path d="M8 9V5h8v4"/>'),
  wifi: svg('<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r=".8"/>'),
  fork: svg('<path d="M7 3v8a2 2 0 0 0 4 0V3M9 13v8M16 21V3c-2 1-3 4-3 8h3"/>'),
  compass: svg('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>'),
  heart: svg('<path d="M12 20s-8-4.5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20Z"/>'),
  route: svg('<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16"/>'),
  car: svg('<path d="M4 16V11l2-5h12l2 5v5H4Z"/><path d="M4 11h16"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  orbit: svg('<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M17 2v4h4"/>'),
  pin: svg('<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>'),
  whatsapp: svg('<path d="M20 11.5a8 8 0 0 1-12 7l-5 1.4 1.4-5A8 8 0 1 1 20 11.5Z"/>')
};

export const mark = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="currentColor"/><path d="M26.5 13.5c-1.2-1.6-3.3-2.5-6-2.5-3.6 0-6 1.8-6 4.5 0 6 12.5 3.5 12.5 9.5 0 2.8-2.6 4.5-6.5 4.5-3 0-5.3-1-6.6-2.8" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-linecap="round"/></svg>';
