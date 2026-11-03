"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/constants";
import { usePageSignals } from "@/lib/hooks/usePageSignals";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { meetWisp } from "@/lib/wisp";

/**
 * Floating control cluster, centred at the top: an icon pill for the sections (a soft
 * circle slides to the active one), a round Wisp button, and a call to action.
 */
export function TopNavBar() {
  const activeId = useScrollSpy(navLinks);
  const { isScrolled } = usePageSignals();

  const glass = `border border-white/10 backdrop-blur-xl transition-colors duration-300 ${
    isScrolled ? "bg-[rgba(14,20,28,0.82)]" : "bg-white/[0.05]"
  } shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]`;

  return (
    <>
      {/* Small signature on wide screens, since the nav no longer carries a wordmark */}
      <Link
        href="#hero"
        className="fixed left-8 top-7 z-[60] hidden font-display text-[0.7rem] uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-text-strong xl:block"
      >
        Yuvraj Sanghai
      </Link>

      <nav aria-label="Sections" className="fixed inset-x-0 top-4 z-[60] flex justify-center px-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <ul className={`flex items-center gap-0.5 rounded-full p-1 sm:gap-1 sm:p-1.5 ${glass}`}>
            {navLinks.map((link) => {
              const active = activeId === link.id;
              return (
                <li key={link.id} className="group relative">
                  <Link
                    href={link.href}
                    aria-label={link.label}
                    aria-current={active ? "location" : undefined}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neural-cyan/60 sm:h-10 sm:w-10 ${
                      active ? "text-text-strong" : "text-text-muted hover:text-text-strong"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/[0.10]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="material-symbols-outlined relative" style={{ fontSize: 20 }} aria-hidden="true">
                      {link.icon}
                    </span>
                  </Link>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[rgba(14,20,28,0.95)] px-3 py-1 font-display text-[0.6rem] uppercase tracking-[0.18em] text-text-strong opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
                  >
                    {link.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label="Ask Wisp"
            title="Ask Wisp"
            onClick={(e) => meetWisp(e.currentTarget)}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-text-muted outline-none transition-colors hover:text-neural-violet focus-visible:ring-2 focus-visible:ring-neural-violet/60 sm:h-[3.25rem] sm:w-[3.25rem] ${glass}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
              chat_bubble
            </span>
          </button>

          <Link
            href="#contact"
            aria-label="Connect"
            className="group flex h-11 items-center gap-3 rounded-full bg-[#e9f0f5] p-1 pr-1 text-[#0a0f16] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-neural-cyan sm:h-[3.25rem] sm:pr-6"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0a0f16] sm:h-11 sm:w-11">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">Connect</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
