export const siteConfig = {
  name: "Yuvraj Sanghai",
  title: "Yuvraj Sanghai — AI R&D Engineer",
  description:
    "AI R&D Engineer building voice-agent systems, evaluation platforms, and production AI infrastructure.",
  url: "https://yuvrajms.tech",
  tagline: "I build systems that think.",
};

export const socialLinks = {
  email: "yuvrajms008@gmail.com",
  phone: "+91-8378833508",
  github: "https://github.com/yuv008",
  linkedin: "https://linkedin.com/in/yuvraj008",
  huggingface: "https://huggingface.co/yuv008",
};

export type AccentTone = "cyan" | "violet" | "amber" | "mist" | "green";

export const accentStyles: Record<
  AccentTone,
  {
    value: string;
    rgb: string;
    text: string;
    border: string;
    bg: string;
    glow: string;
  }
> = {
  cyan: {
    value: "rgb(var(--neural-cyan))",
    rgb: "var(--neural-cyan)",
    text: "text-neural-cyan",
    border: "border-neural-cyan/30",
    bg: "bg-neural-cyan/10",
    glow: "shadow-glow-cyan",
  },
  violet: {
    value: "rgb(var(--neural-violet))",
    rgb: "var(--neural-violet)",
    text: "text-neural-violet",
    border: "border-neural-violet/30",
    bg: "bg-neural-violet/10",
    glow: "shadow-glow-violet",
  },
  amber: {
    value: "rgb(var(--neural-amber))",
    rgb: "var(--neural-amber)",
    text: "text-neural-amber",
    border: "border-neural-amber/30",
    bg: "bg-neural-amber/10",
    glow: "shadow-glow-amber",
  },
  mist: {
    value: "rgb(var(--neural-mist))",
    rgb: "var(--neural-mist)",
    text: "text-neural-mist",
    border: "border-neural-mist/30",
    bg: "bg-neural-mist/10",
    glow: "",
  },
  green: {
    value: "rgb(var(--neural-green))",
    rgb: "var(--neural-green)",
    text: "text-neural-green",
    border: "border-neural-green/30",
    bg: "bg-neural-green/10",
    glow: "",
  },
};

export const sectionIds = {
  hero: "hero",
  about: "about",
  projects: "projects",
  skills: "skills",
  experience: "experience",
  education: "education",
  achievements: "achievements",
  contact: "contact",
} as const;

export const navLinks = [
  { id: "nodes", label: "Nodes", href: `#${sectionIds.about}`, spyIds: [sectionIds.hero, sectionIds.about] },
  { id: "matrix", label: "Matrix", href: `#${sectionIds.skills}`, spyIds: [sectionIds.projects, sectionIds.skills] },
  {
    id: "history",
    label: "History",
    href: `#${sectionIds.experience}`,
    spyIds: [sectionIds.experience, sectionIds.education, sectionIds.achievements],
  },
  { id: "terminal", label: "Terminal", href: `#${sectionIds.contact}`, spyIds: [sectionIds.contact] },
];

export const heroStats = [
  { label: "Response time", value: "1.2s", tone: "cyan" as const },
  { label: "Concurrent calls", value: "200", tone: "violet" as const },
  { label: "Query latency", value: "−90%", tone: "amber" as const },
];

export const socialNodes = [
  {
    label: "LinkedIn",
    href: socialLinks.linkedin,
    icon: "hub",
    tone: "cyan" as const,
  },
  {
    label: "GitHub",
    href: socialLinks.github,
    icon: "code",
    tone: "violet" as const,
  },
  {
    label: "Hugging Face",
    href: socialLinks.huggingface,
    icon: "psychology",
    tone: "amber" as const,
  },
];

export const skillClusters = [
  {
    label: "Languages",
    tone: "mist" as const,
    skills: ["Python", "C++", "Go"],
  },
  {
    label: "AI / ML",
    tone: "cyan" as const,
    skills: ["PyTorch", "LangChain", "LLMs", "RAG", "LoRA / PEFT", "Unsloth", "CrewAI", "SNAC Codec"],
  },
  {
    label: "Voice & Inference",
    tone: "violet" as const,
    skills: ["FastAPI", "Pipecat", "LiveKit", "Twilio", "llama.cpp", "GGUF"],
  },
  {
    label: "Data & Infrastructure",
    tone: "amber" as const,
    skills: [
      "Qdrant", "PostgreSQL", "MySQL", "MongoDB", "Docker", "Kubernetes", "Helm",
      "OpenTelemetry", "Jaeger", "KEDA", "ChromaDB", "FAISS", "Lightning AI",
    ],
  },
  {
    label: "Frontend",
    tone: "mist" as const,
    skills: ["React", "Next.js", "Svelte", "TypeScript", "Tailwind", "Framer Motion"],
  },
];
