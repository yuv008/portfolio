"use client";

import { liteReason, setLite, useLite } from "@/lib/lite";

/** Small footer control: shows whether Lite mode is on and lets visitors switch it. */
export function LiteToggle({ className = "" }: { className?: string }) {
  const lite = useLite();
  const auto = lite && liteReason() === "auto";
  return (
    <button
      type="button"
      onClick={() => setLite(!lite, "user", true)}
      aria-pressed={lite}
      title={lite ? "Lite mode reduces motion and effects. Click to turn it off." : "Turn on Lite mode: fewer effects, smoother on slower devices."}
      className={`hit relative rounded-full px-1 text-text-muted transition-colors hover:text-white ${className}`}
    >
      Lite mode: {lite ? (auto ? "on (auto)" : "on") : "off"}
    </button>
  );
}
