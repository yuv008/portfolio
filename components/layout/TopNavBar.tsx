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

  const glass = `border backdrop-blur-xl transition-[background,border-color,box-shadow] duration-300 ${
    isScrolled
      ? "border-white/[0.12] bg-[linear-gradient(180deg,rgba(24,32,44,0.9),rgba(13,19,28,0.9))]"
      : "border-white/[0.14] bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))]"
  } shadow-[0_14px_36px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(110,231,255,0.04),inset_0_1px_0_rgba(255,255,255,0.14)]`;

  return (
    <>
      {/* Small signature on wide screens, since the nav no longer carries a wordmark */}
      <Link
        href="#hero"
        className="group/sig fixed left-8 top-6 z-[60] hidden items-center gap-2.5 font-body text-sm font-semibold tracking-tight text-text-soft transition-colors hover:text-text-strong xl:flex"
      >
        <span className="h-2 w-2 rounded-full bg-gradient-to-br from-neural-cyan to-neural-violet shadow-[0_0_10px_rgba(110,231,255,0.7)]" aria-hidden="true" />
        Yuvraj Sanghai
      </Link>

      <nav aria-label="Sections" className="fixed inset-x-0 top-4 z-[60] flex justify-center px-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <ul className={`group/nav flex items-center gap-0.5 rounded-full p-1 transition-[gap] duration-300 hover:gap-1 focus-within:gap-1 sm:gap-1 sm:p-1.5 ${glass}`}>
            {navLinks.map((link) => {
              const active = activeId === link.id;
              return (
                <li key={link.id} className="group relative">
                  <Link
                    href={link.href}
                    aria-label={link.label}
                    aria-current={active ? "location" : undefined}
                    className={`relative flex h-9 items-center justify-center rounded-full px-[0.55rem] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neural-cyan/60 sm:h-10 sm:px-[0.65rem] ${
                      active ? "text-white" : "text-text-soft hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(110,231,255,0.28),rgba(171,138,255,0.30))] shadow-[0_0_18px_-2px_rgba(110,231,255,0.45),inset_0_0_0_1px_rgba(255,255,255,0.18)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span
                      className="material-symbols-outlined relative shrink-0"
                      style={{ fontSize: 21, fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
                      aria-hidden="true"
                    >
                      {link.icon}
                    </span>
                    {/* The label opens when the pill is hovered or focused, widening the whole bar. */}
                    <span className="relative max-w-0 overflow-hidden whitespace-nowrap pl-0 font-body text-[0.8rem] font-semibold tracking-tight opacity-0 transition-all duration-300 ease-out group-focus-within/nav:max-w-[7.5rem] group-focus-within/nav:pl-2 group-focus-within/nav:pr-1 group-focus-within/nav:opacity-100 group-hover/nav:max-w-[7.5rem] group-hover/nav:pl-2 group-hover/nav:pr-1 group-hover/nav:opacity-100">
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label="Ask Wisp"
            title="Ask Wisp"
            onClick={(e) => meetWisp(e.currentTarget)}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-neural-violet outline-none transition-all hover:scale-105 hover:text-white hover:shadow-[0_0_22px_-2px_rgba(171,138,255,0.6)] focus-visible:ring-2 focus-visible:ring-neural-violet/60 sm:h-[3.25rem] sm:w-[3.25rem] ${glass}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 21, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
              chat_bubble
            </span>
          </button>

          <Link
            href="#contact"
            aria-label="Connect"
            className="group flex h-11 items-center gap-3 rounded-full bg-[linear-gradient(135deg,#8ff0ff_0%,#6ee7ff_38%,#b49cff_100%)] p-1 pr-1 text-[#06101a] shadow-[0_12px_32px_-10px_rgba(110,231,255,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] outline-none transition-all hover:scale-[1.04] hover:shadow-[0_14px_38px_-8px_rgba(171,138,255,0.65),inset_0_1px_0_rgba(255,255,255,0.5)] focus-visible:ring-2 focus-visible:ring-white sm:h-[3.25rem] sm:pr-6"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0a0f16] sm:h-11 sm:w-11">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
            </span>
            <span className="hidden font-body text-[0.95rem] font-bold tracking-tight sm:inline">Connect</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
