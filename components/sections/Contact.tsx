"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { CanvasSkeleton } from "@/components/three/CanvasSkeleton";
import { accentStyles, sectionIds, socialLinks, socialNodes } from "@/lib/constants";

const ContactGlobe = dynamic(
  () => import("@/components/three/ContactGlobe").then((mod) => mod.ContactGlobe),
  {
    ssr: false,
    loading: () => <CanvasSkeleton className="h-64 w-full rounded-[2rem] md:h-72" />,
  },
);

const initialForm = {
  name: "",
  email: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<typeof initialForm>>({});
  const [submitting, setSubmitting] = useState(false);

  const onFieldChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<typeof initialForm> = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Transmission failed validation. Check the required fields.");
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((resolve) => window.setTimeout(resolve, 700));

      const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nReply to: ${form.email}`);
      window.location.href = `mailto:${socialLinks.email}?subject=${subject}&body=${body}`;

      toast.success("Transmission staged in your default mail client.");
      setForm(initialForm);
    } catch {
      toast.error("Transmission could not be prepared. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id={sectionIds.contact} className="section-shell">
      <div className="section-container">
        <motion.header
          className="mb-14"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-kicker mb-4">Terminal / Transmission</p>
          <h2 className="section-title">
            Establish <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">Connection</span>
          </h2>
          <p className="section-copy mt-5">
            Send a message through the neural gateway or route through the authenticated social nodes. The form validates client-side and opens a prefilled message in your default mail client.
          </p>
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <motion.div
            className="terminal-shell overflow-hidden"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.75 }}
          >
            <div className="terminal-bar">
              <div className="flex gap-2">
                <span className="terminal-dot bg-neural-red/60" />
                <span className="terminal-dot bg-neural-amber/60" />
                <span className="terminal-dot bg-neural-green/60" />
              </div>
              <span className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
                system_session_transmit
              </span>
            </div>
            <form className="space-y-6 p-8" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-3">
                  <span className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
                    Sender Identity
                  </span>
                  <div className="input-shell">
                    <input
                      aria-label="Your name"
                      value={form.name}
                      onChange={(event) => onFieldChange("name", event.target.value)}
                      placeholder="John_Doe"
                      className="w-full bg-transparent text-sm text-text-strong outline-none placeholder:text-text-muted"
                      suppressHydrationWarning
                    />
                  </div>
                  {errors.name ? <p className="text-sm text-neural-red">{errors.name}</p> : null}
                </label>

                <label className="space-y-3">
                  <span className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
                    Return Protocol
                  </span>
                  <div className="input-shell">
                    <input
                      aria-label="Your email address"
                      type="email"
                      value={form.email}
                      onChange={(event) => onFieldChange("email", event.target.value)}
                      placeholder="user@neural.network"
                      className="w-full bg-transparent text-sm text-text-strong outline-none placeholder:text-text-muted"
                      suppressHydrationWarning
                    />
                  </div>
                  {errors.email ? <p className="text-sm text-neural-red">{errors.email}</p> : null}
                </label>
              </div>

              <label className="block space-y-3">
                <span className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
                  Write Payload
                </span>
                <div className="input-shell">
                  <textarea
                    aria-label="Your message"
                    value={form.message}
                    onChange={(event) => onFieldChange("message", event.target.value)}
                    placeholder="Describe the system, product, or collaboration you want to build."
                    className="min-h-[120px] w-full resize-none bg-transparent text-sm leading-7 text-text-strong outline-none placeholder:text-text-muted"
                  />
                </div>
                {errors.message ? <p className="text-sm text-neural-red">{errors.message}</p> : null}
              </label>

              <div className="flex flex-col gap-4 border-t border-surface-border/20 pt-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-text-muted">
                  <span className="material-symbols-outlined text-sm">encrypted</span>
                  <span className="font-display text-[0.62rem] uppercase tracking-[0.28em]">
                    Mail Client Relay / AES-256 Styled
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-neural-cyan/35 bg-neural-cyan/12 px-6 py-3 font-display text-[0.72rem] uppercase tracking-[0.32em] text-neural-cyan transition-all hover:bg-neural-cyan/18 disabled:cursor-not-allowed disabled:opacity-60"
                  suppressHydrationWarning
                >
                  <span>{submitting ? "Transmitting..." : "Transmit"}</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.75, delay: 0.12 }}
          >
            <div className="glass-panel rounded-[2rem] p-5">
              <div className="mb-3">
                <h3 className="font-display text-xl text-text-strong">Pune Link Node</h3>
                <p className="mt-1 font-display text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
                  18.52°N / 73.86°E
                </p>
              </div>
              <div className="h-52 overflow-hidden rounded-[1.5rem] border border-surface-border/20 bg-surface-2/60">
                <ContactGlobe />
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-5">
              <h3 className="font-display text-xl text-text-strong">Social Nodes</h3>
              <div className="mt-5 grid gap-3">
                {socialNodes.map((node) => {
                  const accent = accentStyles[node.tone];
                  return (
                    <Link
                      key={node.label}
                      href={node.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-[1.25rem] border border-surface-border/20 bg-surface-2/55 px-4 py-4 transition-all hover:border-neural-cyan/25 hover:bg-surface-2/75"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-full border ${accent.border} ${accent.bg}`}>
                          <span className={`material-symbols-outlined ${accent.text}`}>{node.icon}</span>
                        </div>
                        <span className="font-display text-sm uppercase tracking-[0.2em] text-text-strong">
                          {node.label}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-text-muted transition-colors group-hover:text-neural-cyan">
                        arrow_outward
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neural-green/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-neural-green" />
                </span>
                <span className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-neural-green">
                  Neural_Status
                </span>
              </div>
              <p className="font-display text-sm leading-8 text-text-soft">
                LOC: Pune, Maharashtra<br />
                TZ: UTC+05:30<br />
                AVAILABILITY: High_Priority
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
