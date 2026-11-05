"use client";

import Link from "next/link";
import { navLinks } from "@/lib/constants";
import { usePageSignals } from "@/lib/hooks/usePageSignals";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { meetWisp } from "@/lib/wisp";

/**
 * Floating control cluster, centred at the top: an icon pill for the sections (a soft
 * circle slides to the active one), a round Wisp button, and a call to action.
 */
const SPY_ITEMS = [...navLinks, { id: "contact", spyIds: ["contact"] }];

/**
 * Section links. Nearby targets scroll smoothly; far ones (more than two screens away) jump straight there, so
 * the page does not have to animate through every section (and the pinned Legion rail) on the way.
 */
function goTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#") || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const el = document.getElementById(href.slice(1));
  if (!el) return;
  e.preventDefault();
  const top = el.getBoundingClientRect().top + window.scrollY;
  const far = Math.abs(top - window.scrollY) > window.innerHeight * 2;
  window.scrollTo({ top, behavior: far ? "instant" : "smooth" });
  if (window.location.hash !== href) history.pushState(null, "", href);
}

export function TopNavBar() {
  // Contact has no icon (the Connect button is its entry), but it is tracked so the last
  // icon does not stay highlighted while you are in it.
  const { isScrolled } = usePageSignals();
  const activeAny = useScrollSpy(SPY_ITEMS);
  const activeId = navLinks.some((l) => l.id === activeAny) ? activeAny : null;
  
  // Frosted glass, as in the reference: a low-opacity fill with heavy blur and saturation so the
  // page shows through, a bright hairline border, and inner top/bottom highlights.
  const glass =
    "border border-white/15 bg-white/10 backdrop-blur-2xl backdrop-saturate-200 " +
    "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)]";

  return (
    <>
      {/* Below 1280px the controls sit together in the centre. From 1280px the nav is three columns: name on the left,
          the icon pill exactly centred, and the actions on the right (with room for the pill to widen on hover). */}
      <nav aria-label="Sections" className="fixed inset-x-0 top-4 z-[60] flex justify-center px-3 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-x-6 xl:px-8">
        <Link
          href="#hero"
          className={`group/sig hidden items-center gap-2.5 justify-self-start font-body text-sm font-semibold tracking-tight text-text-soft transition-all duration-300 hover:text-text-strong xl:col-start-1 xl:flex ${isScrolled ? "pointer-events-none -translate-y-1 opacity-0" : "opacity-100"}`}
        >
          <span className="h-2 w-2 rounded-full bg-gradient-to-br from-neural-cyan to-neural-violet shadow-[0_0_10px_rgba(230,230,230,0.7)]" aria-hidden="true" />
          Yuvraj Sanghai
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 xl:contents">
          <ul className={`group/nav flex items-center xl:col-start-2 gap-0.5 rounded-full p-1 transition-[gap] duration-300 hover:gap-1 focus-within:gap-1 sm:gap-1 sm:p-1.5 ${glass}`}>
            {navLinks.map((link) => {
              const active = activeId === link.id;
              return (
                <li key={link.id} className="group relative">
                  <Link
                    href={link.href}
                    onClick={(e) => goTo(e, link.href)}
                    aria-label={link.label}
                    aria-current={active ? "location" : undefined}
                    className={`hit relative flex h-9 items-center justify-center rounded-full px-[0.55rem] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neural-cyan/60 sm:h-10 sm:px-[0.65rem] ${
                      active ? "text-white" : "text-text-soft hover:text-white"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(230,230,230,0.30),rgba(172,172,172,0.34))] shadow-[0_0_18px_-2px_rgba(230,230,230,0.4),inset_0_0_0_1px_rgba(255,255,255,0.22)] transition-[opacity,transform] duration-300 ease-out ${
                        active ? "scale-100 opacity-100" : "scale-75 opacity-0"
                      }`}
                    />
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

          <div className="flex items-center gap-2 sm:gap-3 xl:col-start-3 xl:justify-self-end">
          <a
            href="#contact"
            className={`mr-2 hidden items-center gap-2.5 font-body text-sm font-semibold tracking-tight text-text-soft transition-all duration-300 hover:text-text-strong min-[1440px]:flex ${isScrolled ? "pointer-events-none -translate-y-1 opacity-0" : "opacity-100"}`}
          >
            Open to work
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(193,193,193,0.7)]" aria-hidden="true" />
          </a>
          <button
            type="button"
            aria-label="Ask Wisp"
            title="Ask Wisp"
            onClick={(e) => meetWisp(e.currentTarget)}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-neural-violet outline-none transition-all hover:scale-105 hover:text-white hover:shadow-[0_0_22px_-2px_rgba(172,172,172,0.6)] focus-visible:ring-2 focus-visible:ring-neural-violet/60 sm:h-[3.25rem] sm:w-[3.25rem] ${glass}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 21, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
              chat_bubble
            </span>
          </button>

          <Link
            href="#contact"
            onClick={(e) => goTo(e, "#contact")}
            aria-label="Connect"
            className="group flex h-11 items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f4f4f4_0%,#e6e6e6_38%,#bcbcbc_100%)] p-1 pr-1 text-[#0f0f0f] shadow-[0_12px_32px_-10px_rgba(230,230,230,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] outline-none transition-all hover:scale-[1.04] hover:shadow-[0_14px_38px_-8px_rgba(172,172,172,0.65),inset_0_1px_0_rgba(255,255,255,0.5)] focus-visible:ring-2 focus-visible:ring-white sm:h-[3.25rem] sm:pr-6"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0e0e0e] sm:h-11 sm:w-11">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
            </span>
            <span className="hidden font-body text-[0.95rem] font-bold tracking-tight sm:inline">Connect</span>
          </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
