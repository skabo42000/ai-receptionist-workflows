/**
 * Demo time slots. Phase 1 builds them in the visitor's browser from the opening hours, with a
 * fixed date-based sprinkle of "taken" times so the calendar looks lived-in. Phase 2 moves this
 * to the server and subtracts real demo bookings.
 */
export type Slot = { time: string; available: boolean };

type Hours = ({ open: string; close: string } | null)[];

const STEP_MINUTES = 30;
const BOOKING_WINDOW_DAYS = 30;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHhmm = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Small stable hash, so the same day always shows the same "taken" slots. */
function hash(text: string) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
  return (value >>> 0) % 100;
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function lastBookableDay(today = new Date()) {
  const day = startOfDay(today);
  day.setDate(day.getDate() + BOOKING_WINDOW_DAYS);
  return day;
}

export function isClosed(date: Date, hours: Hours) {
  return hours[date.getDay()] === null;
}

export function generateSlots(date: Date, durationMinutes: number, hours: Hours, now = new Date()): Slot[] {
  const day = hours[date.getDay()];
  if (!day) return [];
  const isToday = dayKey(date) === dayKey(now);
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + 60 : 0;
  const slots: Slot[] = [];
  for (let start = toMinutes(day.open); start + durationMinutes <= toMinutes(day.close); start += STEP_MINUTES) {
    if (start < earliest) continue;
    const time = toHhmm(start);
    slots.push({ time, available: hash(`${dayKey(date)}|${time}`) >= 35 });
  }
  return slots;
}
