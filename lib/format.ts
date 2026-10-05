export function formatDuration(minutes: number | null) {
  if (minutes === null) return "Monthly";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

/** "14:30" -> "2:30 PM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(date);
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(date);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Groups identical consecutive days: "Monday – Friday", "Saturday", "Sunday". */
export function groupHours(hours: ({ open: string; close: string } | null)[]) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const rows: { days: string; value: string }[] = [];
  let start = order[0];
  for (let i = 0; i < order.length; i++) {
    const day = order[i];
    const next = order[i + 1];
    const text = (d: number) => (hours[d] ? `${formatTime(hours[d]!.open)} – ${formatTime(hours[d]!.close)}` : "Closed");
    if (next === undefined || text(next) !== text(day)) {
      rows.push({ days: start === day ? WEEKDAYS[day] : `${WEEKDAYS[start]} – ${WEEKDAYS[day]}`, value: text(day) });
      start = next;
    }
  }
  return rows;
}
