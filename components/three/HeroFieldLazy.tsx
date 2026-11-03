"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLite } from "@/lib/lite";

// three.js is about 160 KB of JavaScript that nothing above the fold needs, so it loads after the page is idle.
const HeroField = dynamic(() => import("./HeroField"), { ssr: false });

type Props = Omit<React.ComponentProps<typeof HeroField>, "particles"> & { particles?: number };

type Nav = Navigator & { deviceMemory?: number };

/** Starts the particle field after idle, with a density chosen for the device and for Lite mode. */
export function HeroFieldLazy({ particles = 64000, ...rest }: Props) {
  const lite = useLite();
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const n = navigator as Nav;
    const weak = (n.deviceMemory ?? 8) <= 4 || (n.hardwareConcurrency ?? 8) <= 4;
    setScale(weak ? 0.5 : 1);
    const ric: (cb: () => void, o?: { timeout: number }) => number =
      window.requestIdleCallback ?? ((cb) => window.setTimeout(cb, 600));
    const id = ric(() => setReady(true), { timeout: 1500 });
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  if (!ready) return null;
  return <HeroField {...rest} particles={lite ? 14000 : Math.round(particles * scale)} />;
}
