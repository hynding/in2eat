import { z } from "zod";
import { EntryMeta, GeoPoint, Url } from "./common.js";

export const DeliveryKind = z.enum(["food", "drink", "grocery", "alcohol", "coffee"]);

export const CoverageArea = z.object({
  label: z.string().trim().min(1),
  center: GeoPoint,
  radiusKm: z.number().positive().max(500),
});
export type CoverageArea = z.infer<typeof CoverageArea>;

export const DeliverySchema = z.object({
  ...EntryMeta,
  kinds: z.array(DeliveryKind).min(1),
  website: Url,
  apps: z.object({ ios: Url.optional(), android: Url.optional() }).default({}),
  coverage: z.array(CoverageArea).min(1),
  fees: z
    .object({ delivery: z.string().trim().optional(), minimumOrder: z.string().trim().optional() })
    .default({}),
});
export type Delivery = z.infer<typeof DeliverySchema>;
