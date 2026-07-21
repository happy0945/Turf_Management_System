export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Generates every discrete slot start time for a turf, e.g.
// openingTime "06:00", closingTime "22:00", slotDuration 60
// -> ["06:00", "07:00", ..., "21:00"]
export const generateSlots = (
  openingTime: string,
  closingTime: string,
  slotDuration: number
): string[] => {
  const start = timeToMinutes(openingTime);
  const end = timeToMinutes(closingTime);
  const slots: string[] = [];

  for (let t = start; t + slotDuration <= end; t += slotDuration) {
    slots.push(minutesToTime(t));
  }

  return slots;
};