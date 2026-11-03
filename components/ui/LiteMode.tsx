"use client";

import { useEffect } from "react";
import { initLite } from "@/lib/lite";

/** Detects weak devices once on load and keeps Lite mode in sync. Renders nothing. */
export function LiteMode() {
  useEffect(() => initLite(), []);
  return null;
}
