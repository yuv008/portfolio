"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "@/lib/toast";
import { ContactGlobe } from "@/components/three/ContactGlobe";
import { sectionIds, socialLinks } from "@/lib/constants";

const initialForm = { name: "", email: "", message: "" };

const LINKS = [
  { label: "LinkedIn", detail: "linkedin.com/in/yuvraj008", href: socialLinks.linkedin, icon: "hub", external: true },
  { label: "GitHub", detail: "github.com/yuv008", href: socialLinks.github, icon: "code", external: true },
  { label: "Hugging Face", detail: "huggingface.co/yuv008", href: socialLinks.huggingface, icon: "psychology", external: true },
  { label: "Resume", detail: "PDF, one page", href: "/Yuvraj_Sanghai_Resume.pdf", icon: "description", external: true },
];

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<typeof initialForm>>({});
  const [copied, setCopied] = useState(false);

  const onFieldChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<typeof initialForm> = {};
    if (!form.name.trim()) next.name = "Please add your name.";
    if (!form.email.trim()) next.email = "Please add your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "That email doesn't look right.";
    if (!form.message.trim()) next.message = "Please write a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fill in the highlighted fields.");
      return;
    }
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nReply to: ${form.email}`);
    window.location.href = `mailto:${socialLinks.email}?subject=${subject}&body=${body}`;
    toast.success("Opening your email app with the message filled in.");
    setForm(initialForm);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.email);
      setCopied(true);
      toast.success("Email copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't copy. My email is ${socialLinks.email}`);
    }
  };

  const field =
    "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-text-strong outline-none transition-colors placeholder:text-text-muted focus:border-neural-cyan/60 focus:bg-black/40";

  return (
    <section id={sectionIds.contact} className="section-shell">
      <div className="section-container">
        <header className="mb-12">
          <p className="section-kicker mb-4">{"// Contact"}</p>
          <h2 className="section-title">
            Let&apos;s{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">build something.</span>
          </h2>
          <p className="section-copy mt-5">
            Tell me about the role, the project or the idea. The quickest way is email, and the form below opens your mail app with everything filled in.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <form className="tile p-6 md:p-8" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="tile-label">Name</span>
                <input
                  aria-label="Your name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className={`${field} mt-2 ${errors.name ? "!border-neural-red/70" : ""}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-neural-red">{errors.name}</p>}
              </label>
              <label className="block">
                <span className="tile-label">Email</span>
                <input
                  aria-label="Your email address"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => onFieldChange("email", e.target.value)}
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  className={`${field} mt-2 ${errors.email ? "!border-neural-red/70" : ""}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-neural-red">{errors.email}</p>}
              </label>
            </div>

            <label className="mt-5 block">
              <span className="tile-label">Message</span>
              <textarea
                aria-label="Your message"
                value={form.message}
                onChange={(e) => onFieldChange("message", e.target.value)}
                placeholder="What would you like to build or talk about?"
                aria-invalid={!!errors.message}
                rows={6}
                className={`${field} mt-2 resize-none leading-7 ${errors.message ? "!border-neural-red/70" : ""}`}
              />
              {errors.message && <p className="mt-1.5 text-xs text-neural-red">{errors.message}</p>}
            </label>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-[16rem] text-xs leading-5 text-text-muted">This opens your email app. Nothing is sent from this page.</p>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f4f4f4_0%,#e6e6e6_38%,#bcbcbc_100%)] px-6 py-3 font-body text-sm font-bold text-[#0f0f0f] shadow-[0_12px_32px_-10px_rgba(230,230,230,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-white"
              >
                Send message
                <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>

          <div className="tile flex flex-col p-2.5">
            <div className="tile-media h-[210px]">
              <ContactGlobe />
              <p className="absolute bottom-3 left-4 font-display text-[10px] uppercase tracking-[0.18em] text-text-muted">
                Pune · UTC+05:30
              </p>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <p className="text-sm leading-6 text-text-soft">
                Currently building <span className="text-text-strong">VEE Legion</span> at VoiceraCX.
              </p>

              <button
                type="button"
                onClick={copyEmail}
                className="group mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left transition-colors hover:border-neural-cyan/40"
              >
                <span className="flex items-center gap-3">
                  <span className="tile-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                      mail
                    </span>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-strong">{socialLinks.email}</span>
                    <span className="block text-xs text-text-muted">{copied ? "Copied" : "Click to copy"}</span>
                  </span>
                </span>
                <span className="material-symbols-outlined text-text-muted transition-colors group-hover:text-neural-cyan" style={{ fontSize: 20 }} aria-hidden="true">
                  {copied ? "check" : "content_copy"}
                </span>
              </button>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/25 px-3.5 py-3 transition-colors hover:border-neural-cyan/40"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="material-symbols-outlined text-neural-cyan" style={{ fontSize: 20 }} aria-hidden="true">
                        {l.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-text-strong">{l.label}</span>
                        <span className="block truncate text-[11px] text-text-muted">{l.detail}</span>
                      </span>
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-text-muted transition-colors group-hover:text-neural-cyan" style={{ fontSize: 18 }} aria-hidden="true">
                      arrow_outward
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
