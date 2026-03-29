"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -60% 0px" }
    );

    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--accent-border)]/30"
          : "bg-transparent"
      }`}
    >
      <div className="container-main flex items-center justify-between h-16 px-6">
        <a
          href="#hero"
          className="font-[var(--font-mono)] text-lg font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:rounded"
          style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
        >
          <span className="text-[var(--accent)]">Y</span>
          <span className="text-[var(--text-primary)]">S</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => {
            const isActive = activeSection === href.slice(1);
            return (
              <a
                key={label}
                href={href}
                className={`mono-label transition-colors duration-200 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:rounded ${
                  isActive ? "text-[var(--accent)]" : ""
                }`}
                style={{
                  paddingBottom: "2px",
                  borderBottom: isActive
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                }}
                aria-current={isActive ? "true" : undefined}
              >
                {label}
              </a>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--bg-elevated)] border-b border-[var(--accent-border)]/30"
          >
            <div className="flex flex-col gap-1 p-6">
              {navLinks.map(({ label, href }) => {
                const isActive = activeSection === href.slice(1);
                return (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`mono-label transition-colors duration-200 hover:text-[var(--accent)] ${
                      isActive ? "text-[var(--accent)]" : ""
                    }`}
                    style={{
                      padding: "0.75rem 0",
                      borderLeft: isActive
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                      paddingLeft: "0.75rem",
                      transition: "color 0.2s ease, border-color 0.2s ease",
                    }}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
