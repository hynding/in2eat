import { describe, expect, it } from "vitest";
import { hoursByDay, isOpenAt } from "./hours";

// 2026-11-24 is a Tuesday.
const at = (day: number, time: string) => new Date(`2026-11-${String(day).padStart(2, "0")}T${time}:00`);

describe("isOpenAt", () => {
  const lunch = [{ days: ["tue" as const], open: "11:00", close: "15:00" }];

  it("is open inside a period and closed at the closing minute", () => {
    expect(isOpenAt(lunch, at(24, "12:00"))).toBe(true);
    expect(isOpenAt(lunch, at(24, "15:00"))).toBe(false);
  });

  it("is closed on other days", () => expect(isOpenAt(lunch, at(25, "12:00"))).toBe(false));

  it("handles periods past midnight", () => {
    const late = [{ days: ["fri" as const], open: "18:00", close: "02:00" }];
    expect(isOpenAt(late, at(27, "23:30"))).toBe(true); // Friday night
    expect(isOpenAt(late, at(28, "01:30"))).toBe(true); // early Saturday
    expect(isOpenAt(late, at(28, "03:00"))).toBe(false);
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
