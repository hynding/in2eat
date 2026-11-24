import type { OpeningHours, Weekday } from "@in2eat/content-schema";

export const weekdays: readonly Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const minutesOf = (clock: string): number => {
  const [h, m] = clock.split(":").map(Number);
  return h! * 60 + m!;
};

const previousDay = (day: Weekday): Weekday => weekdays[(weekdays.indexOf(day) + 6) % 7]!;

/** The weekday and minute-of-day that `date` falls on in `timeZone`. */
export function wallClock(date: Date, timeZone: string): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: part("weekday").toLowerCase().slice(0, 3) as Weekday,
    minutes: Number(part("hour")) * 60 + Number(part("minute")),
  };
}

/**
 * True when `date` falls inside any opening period, judged by the clock where
 * the place is (`timeZone`), not where the visitor is.
 * A period that closes earlier than it opens runs past midnight into the next day.
 */
export function isOpenAt(hours: readonly OpeningHours[], date: Date, timeZone: string): boolean {
  const { day, minutes: now } = wallClock(date, timeZone);

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
