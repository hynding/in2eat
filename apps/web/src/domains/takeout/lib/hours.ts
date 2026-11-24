import type { OpeningHours, Weekday } from "@in2eat/content-schema";

export const weekdays: readonly Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const weekdayOf = (date: Date): Weekday => weekdays[(date.getDay() + 6) % 7]!;
const minutesOf = (clock: string): number => {
  const [h, m] = clock.split(":").map(Number);
  return h! * 60 + m!;
};

const previousDay = (day: Weekday): Weekday => weekdays[(weekdays.indexOf(day) + 6) % 7]!;

/**
 * True when `date` (in the viewer's local time) falls inside any opening period.
 * A period that closes earlier than it opens runs past midnight into the next day.
 */
export function isOpenAt(hours: readonly OpeningHours[], date: Date): boolean {
  const day = weekdayOf(date);
  const now = date.getHours() * 60 + date.getMinutes();

  return hours.some(({ days, open, close }) => {
    const start = minutesOf(open);
    const end = minutesOf(close);
    if (end > start) return days.includes(day) && now >= start && now < end;
    return (days.includes(day) && now >= start) || (days.includes(previousDay(day)) && now < end);
  });
}

/** Groups opening periods by weekday for display. */
export function hoursByDay(hours: readonly OpeningHours[]): ReadonlyArray<readonly [Weekday, string[]]> {
  return weekdays.map((day) => [
    day,
    hours.filter((h) => h.days.includes(day)).map((h) => `${h.open}–${h.close}`),
  ]);
}
