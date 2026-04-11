"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/constants";
import { usePageSignals } from "@/lib/hooks/usePageSignals";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function TopNavBar() {
  const activeId = useScrollSpy(navLinks);
  const { scrollY, progress, nearBottom } = usePageSignals();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isScrolled = scrollY > 60;

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-neural-cyan via-neural-violet to-neural-amber"
        style={{ scaleX: progress }}
        suppressHydrationWarning
      />
      <nav className="fixed inset-x-0 top-0 z-[60]">
        <div className="section-container pt-4">
          <div
            className={`flex items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 md:px-6 ${
              isScrolled
                ? "border-surface-border/35 bg-background/60 shadow-glass backdrop-blur-2xl"
                : "border-transparent bg-transparent"
            }`}
            suppressHydrationWarning
          >
            <Link
              href="#hero"
              className="font-display text-sm tracking-[0.28em] text-text-strong transition-opacity hover:opacity-80 md:text-base"
            >
              YUVRAJMS//ARCHIVE
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => {
                const active = activeId === link.id;

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={`relative font-display text-[0.7rem] uppercase tracking-[0.34em] transition-colors ${
                      active ? "text-neural-cyan" : "text-text-muted hover:text-text-strong"
                    }`}
                  >
                    {link.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-0 -bottom-2 h-px bg-neural-cyan"
                      />
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-full border border-neural-green/20 bg-neural-green/8 px-3 py-2">
                <span className="flex items-center gap-2 font-display text-[0.62rem] uppercase tracking-[0.28em] text-neural-green">
                  <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neural-green/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-neural-green" />
                  </span>
                  Systems_Optimal
                </span>
              </div>
              <Link
                href="#contact"
                className={`rounded-full border px-5 py-2 font-display text-[0.72rem] uppercase tracking-[0.32em] transition-all ${
                  nearBottom
                    ? "animate-pulse-subtle border-neural-cyan/45 bg-neural-cyan/14 text-neural-cyan shadow-glow-cyan"
                    : "border-surface-border/35 bg-surface/65 text-text-strong hover:border-neural-cyan/40 hover:text-neural-cyan"
                }`}
                suppressHydrationWarning
              >
                Connect
              </Link>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-surface-border/35 bg-surface/75 text-text-strong md:hidden"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileOpen((current) => !current)}
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] bg-background/96 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="section-container flex min-h-screen flex-col justify-between py-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm tracking-[0.28em] text-text-strong">
                  NAVIGATION
                </span>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-surface-border/35 bg-surface/80 text-text-strong"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <motion.div
                className="flex flex-1 flex-col justify-center gap-6"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {navLinks.map((link) => (
                  <motion.div key={link.id} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className={`block font-display text-4xl uppercase tracking-[0.22em] ${
                        activeId === link.id ? "text-neural-cyan" : "text-text-soft"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="space-y-4"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div variants={itemVariants} className="rounded-[1.75rem] border border-neural-green/20 bg-neural-green/10 p-4">
                  <p className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-neural-green">
                    Status: Systems_Optimal
                  </p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="#contact"
                    className="block rounded-full border border-neural-cyan/35 bg-neural-cyan/12 px-5 py-3 text-center font-display text-sm uppercase tracking-[0.32em] text-neural-cyan"
                    onClick={() => setMobileOpen(false)}
                  >
                    Connect
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
