export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function departureDate(arrival, months) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival) || !Number.isInteger(months) || months < 1 || months > 12) return null;
  const [year, month, day] = arrival.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  if (localDate(start) !== arrival) return null;
  const lastDay = new Date(year, month - 1 + months + 1, 0).getDate();
  return localDate(new Date(year, month - 1 + months, Math.min(day, lastDay)));
}
export function enquiryMessage({ name, email, arrival, months, note }, lang) {
  const departure = departureDate(arrival, Number(months));
  return lang === 'es'
    ? `Hola, me interesa una estadía en Smart Studio, Bogotá.\nNombre: ${name}\nEmail: ${email}\nLlegada: ${arrival}\nDuración: ${months} mes(es)\nSalida estimada: ${departure}\n${note || ''}\nQuisiera confirmar disponibilidad, tarifa y condiciones. Entiendo que esto no confirma una reserva.`
    : `Hello, I am interested in a stay at Smart Studio, Bogotá.\nName: ${name}\nEmail: ${email}\nArrival: ${arrival}\nLength: ${months} month(s)\nEstimated departure: ${departure}\n${note || ''}\nPlease confirm availability, rate and conditions. I understand this is not a confirmed booking.`;
}
