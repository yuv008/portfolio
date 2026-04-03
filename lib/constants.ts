export const siteConfig = {
  name: "Yuvraj Sanghai",
  title: "Yuvraj Sanghai — Systems Engineer & AI Infrastructure",
  description:
    "I build the systems behind the intelligence. Voice pipelines, RAG architectures, semantic caching, and AI infrastructure.",
  url: "https://yuvrajms.tech",
  tagline: "I build systems that think.",
};

export const socialLinks = {
  email: "yuvrajms008@gmail.com",
  phone: "+91-8378833508",
  github: "https://github.com/YuvrajSanghai",
  linkedin: "https://linkedin.com/in/yuvrajsanghai",
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
  contact: "contact",
} as const;

export const navLinks = [
  { id: "nodes", label: "Nodes", href: `#${sectionIds.about}`, spyIds: [sectionIds.hero, sectionIds.about] },
  { id: "matrix", label: "Matrix", href: `#${sectionIds.skills}`, spyIds: [sectionIds.projects, sectionIds.skills] },
  { id: "history", label: "History", href: `#${sectionIds.experience}`, spyIds: [sectionIds.experience] },
  { id: "terminal", label: "Terminal", href: `#${sectionIds.contact}`, spyIds: [sectionIds.contact] },
];

export const heroStats = [
  { label: "Voice latency", value: "14ms", tone: "cyan" as const },
  { label: "Inference nodes", value: "08", tone: "violet" as const },
  { label: "Model contexts", value: "12.4M", tone: "amber" as const },
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
    label: "AI / ML",
    tone: "cyan" as const,
    skills: ["Python", "PyTorch", "Llama 3.x", "LoRA / PEFT", "Unsloth", "SNAC Codec", "BERTSum", "CrewAI"],
  },
  {
    label: "Infra",
    tone: "amber" as const,
    skills: ["Qdrant", "FAISS", "MongoDB", "PostgreSQL", "Docker", "Lightning AI", "LiveKit", "FastAPI"],
  },
  {
    label: "Frontend",
    tone: "violet" as const,
    skills: ["Next.js", "React", "Svelte", "Tailwind", "Framer Motion", "TypeScript"],
  },
];

type ExperienceConfig = {
  id: string;
  company: string;
  role: string;
  start: string;
  end?: string;
  current?: boolean;
  description: string;
  bullets: string[];
  metrics: { label: string; value: string }[];
  tone: AccentTone;
  icon: string;
};

const experienceConfig: ExperienceConfig[] = [
  {
    id: "voiceracx",
    company: "VoiceraCX",
    role: "AI Intern",
    start: "2025-06-01",
    current: true,
    description:
      "Voice agent platform with 3s response latency, ChromaDB bottlenecks, and redundant LLM API calls across the pipeline.",
    bullets: [
      "Built real-time voice pipelines using LiveKit and streaming inference.",
      "Migrated vector storage from ChromaDB to Qdrant with hybrid dense-sparse search.",
      "Added connection pooling, semantic caching, and lower-latency retrieval orchestration.",
    ],
    metrics: [
      { label: "Latency", value: "-60%" },
      { label: "Query time", value: "-90%" },
      { label: "API calls", value: "-60%" },
    ],
    tone: "cyan",
    icon: "sensors",
  },
  {
    id: "daostreet",
    company: "DAOStreet",
    role: "Software Development Intern",
    start: "2025-02-01",
    end: "2025-06-01",
    description:
      "Worked across a Svelte product surface, shipping UI fixes and responsive frontend improvements under active product iteration.",
    bullets: [
      "Resolved product tickets across the Svelte application codebase.",
      "Improved UI responsiveness, interaction clarity, and visual polish across feature screens.",
    ],
    metrics: [
      { label: "Tickets", value: "Shipped" },
      { label: "UX", value: "Improved" },
    ],
    tone: "violet",
    icon: "hub",
  },
  {
    id: "alesa",
    company: "Alesa AI Ltd, UK",
    role: "AI/ML Intern",
    start: "2024-11-01",
    end: "2025-03-01",
    description:
      "Fine-tuned domain-specific language models for dream interpretation and astrology workflows inside a consumer AI product.",
    bullets: [
      "Worked on Tangent Mind for tarot, horoscopes, and dream interpretation flows.",
      "Fine-tuned Llama-3.1-8B with PEFT on a 10,000+ term domain dataset.",
    ],
    metrics: [
      { label: "Dataset", value: "10k+" },
      { label: "Model", value: "Llama 3.1-8B" },
    ],
    tone: "amber",
    icon: "psychology",
  },
];

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function diffInMonths(start: Date, end: Date) {
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const total = years * 12 + months + (end.getDate() >= start.getDate() ? 0 : -1);
  return Math.max(1, total + 1);
}

export const experienceEntries = experienceConfig.map((entry) => {
  const startDate = new Date(entry.start);
  const endDate = entry.current ? new Date() : new Date(entry.end ?? entry.start);
  const durationMonths = diffInMonths(startDate, endDate);
  const durationLabel = durationMonths >= 12
    ? `${Math.floor(durationMonths / 12)}y ${durationMonths % 12 ? `${durationMonths % 12}m` : ""}`.trim()
    : `${durationMonths}m`;

  return {
    ...entry,
    periodLabel: `${formatMonth(startDate)} — ${entry.current ? "Present" : formatMonth(endDate)}`,
    durationLabel,
  };
});
