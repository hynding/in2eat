import { describe, expect, it } from "vitest";
import { hoursByDay, isOpenAt, wallClock } from "./hours";

const LA = "America/Los_Angeles";
// 2026-11-24 is a Tuesday. Los Angeles is UTC-8 in November.
const laTime = (day: number, time: string) => new Date(`2026-11-${String(day).padStart(2, "0")}T${time}:00-08:00`);

describe("wallClock", () => {
  it("reads the weekday and time in the place's zone, not the viewer's", () => {
    // 02:00 UTC on Wednesday is still 18:00 Tuesday in Los Angeles.
    expect(wallClock(new Date("2026-11-25T02:00:00Z"), LA)).toEqual({ day: "tue", minutes: 18 * 60 });
  });
});

describe("isOpenAt", () => {
  const lunch = [{ days: ["tue" as const], open: "11:00", close: "15:00" }];

  it("is open inside a period and closed at the closing minute", () => {
    expect(isOpenAt(lunch, laTime(24, "12:00"), LA)).toBe(true);
    expect(isOpenAt(lunch, laTime(24, "15:00"), LA)).toBe(false);
  });

  it("is closed on other days", () => expect(isOpenAt(lunch, laTime(25, "12:00"), LA)).toBe(false));

  it("judges by the place's clock for far-away viewers", () => {
    // 20:00 UTC Tuesday is noon in Los Angeles but evening in Europe.
    expect(isOpenAt(lunch, new Date("2026-11-24T20:00:00Z"), LA)).toBe(true);
    expect(isOpenAt(lunch, new Date("2026-11-24T20:00:00Z"), "Europe/Paris")).toBe(false);
  });

  it("handles periods past midnight", () => {
    const late = [{ days: ["fri" as const], open: "18:00", close: "02:00" }];
    expect(isOpenAt(late, laTime(27, "23:30"), LA)).toBe(true);
    expect(isOpenAt(late, laTime(28, "01:30"), LA)).toBe(true);
    expect(isOpenAt(late, laTime(28, "03:00"), LA)).toBe(false);
  });
});

describe("hoursByDay", () => {
  it("lists every weekday with its periods", () => {
    const rows = hoursByDay([{ days: ["mon", "sun"], open: "09:00", close: "17:00" }]);
    expect(rows).toHaveLength(7);
    expect(rows[0]).toEqual(["mon", ["09:00–17:00"]]);
    expect(rows[1]).toEqual(["tue", []]);
  });
});
