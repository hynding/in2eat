import { z } from "zod";
import { Address, Currency, EntryMeta, GeoPoint, OpeningHours, TimeZone, Url } from "./common.js";

export const TakeoutService = z.enum(["pickup", "dine-in", "delivery", "drive-thru"]);

export const MenuItem = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  price: z.number().nonnegative().optional(),
  tags: z.array(z.string().trim().toLowerCase()).default([]),
});
export type MenuItem = z.infer<typeof MenuItem>;

export const MenuSection = z.object({
  section: z.string().trim().min(1),
  items: z.array(MenuItem).min(1),
});
export type MenuSection = z.infer<typeof MenuSection>;

export const TakeoutSchema = z.object({
  ...EntryMeta,
  cuisine: z.array(z.string().trim().toLowerCase()).min(1),
  address: Address,
  location: GeoPoint,
  phone: z.string().trim().optional(),
  website: Url.optional(),
  services: z.array(TakeoutService).min(1),
  hours: z.array(OpeningHours).default([]),
  timeZone: TimeZone.describe("IANA zone the opening hours are in"),
  currency: Currency,
  menu: z.array(MenuSection).min(1),
  deliveredBy: z.array(z.string()).default([]).describe("Slugs of delivery services that carry this place"),
});
export type Takeout = z.infer<typeof TakeoutSchema>;
