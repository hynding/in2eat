"use client";

import { useEffect, useState } from "react";
import type { OpeningHours } from "@in2eat/content-schema";
import { Chip } from "@/shared/ui/Chip";
import { isOpenAt } from "../lib/hours";

/** Rendered on the client only, because "now" is unknown at build time. */
interface OpenNowProps {
  readonly hours: readonly OpeningHours[];
  /** The place's IANA time zone; hours are judged by its clock. */
  readonly timeZone: string;
}

export function OpenNow({ hours, timeZone }: OpenNowProps) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenAt(hours, new Date(), timeZone));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [hours, timeZone]);

  if (open === null || hours.length === 0) return null;
  return <Chip tone={open ? "recipe" : "neutral"}>{open ? "Open now" : "Closed now"}</Chip>;
}
