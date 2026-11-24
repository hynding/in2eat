"use client";

import { useEffect, useState } from "react";
import type { OpeningHours } from "@in2eat/content-schema";
import { Chip } from "@/shared/ui/Chip";
import { isOpenAt } from "../lib/hours";

/** Rendered on the client only, because "now" is unknown at build time. */
export function OpenNow({ hours }: { readonly hours: readonly OpeningHours[] }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenAt(hours, new Date()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [hours]);

  if (open === null || hours.length === 0) return null;
  return <Chip tone={open ? "recipe" : "neutral"}>{open ? "Open now" : "Closed now"}</Chip>;
}
