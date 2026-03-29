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
      { rootMargin: "-40% 0px -50% 0px" }
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
          href="#"
          className="font-[var(--font-mono)] text-lg font-bold tracking-tight"
          style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
        >
          <span className="text-[var(--accent)]">Y</span>
          <span className="text-[var(--text-primary)]">S</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`mono-label transition-colors duration-200 hover:text-[var(--accent)] ${
                activeSection === href.slice(1)
                  ? "text-[var(--accent)]"
                  : ""
              }`}
            >
              {label}
            </a>
          ))}
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
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`mono-label transition-colors duration-200 hover:text-[var(--accent)] ${
                    activeSection === href.slice(1)
                      ? "text-[var(--accent)]"
                      : ""
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
