import { z } from "zod";

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const trimmed = (max: number) => z.string().trim().min(1).max(max);

export const Title = trimmed(120);
export const Summary = trimmed(400);
export const Tag = z.string().trim().toLowerCase().regex(slugPattern, "tags are lowercase-kebab-case");
export const Tags = z.array(Tag).max(20).default([]);
export const Url = z.url({ protocol: /^https$/ });
export const IsoDate = z.iso.date();

export const GeoPoint = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type GeoPoint = z.infer<typeof GeoPoint>;

export const Address = z.object({
  street: trimmed(160),
  city: trimmed(80),
  region: trimmed(80).optional(),
  postalCode: trimmed(20).optional(),
  country: z.string().length(2).toUpperCase().describe("ISO 3166-1 alpha-2"),
});
export type Address = z.infer<typeof Address>;

export const Weekday = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
export type Weekday = z.infer<typeof Weekday>;

const ClockTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "use 24h HH:MM");

export const OpeningHours = z.object({
  days: z.array(Weekday).min(1),
  open: ClockTime,
  close: ClockTime,
});
export type OpeningHours = z.infer<typeof OpeningHours>;

const isTimeZone = (zone: string): boolean => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
};

export const TimeZone = z.string().refine(isTimeZone, "use an IANA time zone such as America/Los_Angeles");

export const Currency = z.string().length(3).toUpperCase().describe("ISO 4217");

/** Fields every content entry shares, regardless of collection. */
export const EntryMeta = {
  title: Title,
  summary: Summary,
  tags: Tags,
  updated: IsoDate.optional(),
  image: z.string().optional().describe("Path under /images or https URL"),
};
