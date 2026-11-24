"use client";

import { useEffect } from "react";
import { withBasePath } from "@/shared/lib/base-path";

/** Registers the generated service worker in production builds only. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(withBasePath("/sw.js"), { scope: withBasePath("/") }).catch((error: unknown) => {
      console.warn("Service worker registration failed", error);
    });
  }, []);
  return null;
}
