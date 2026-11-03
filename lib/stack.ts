/** The stack, as category hubs with skills. A skill listed under two hubs links them. */
export type StackHub = {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  skills: string[];
};

export const STACK_HUBS: StackHub[] = [
  {
    id: "ai",
    label: "AI / ML",
    icon: "psychology",
    blurb: "Fine-tuning, retrieval and agent frameworks",
    skills: ["PyTorch", "LangChain", "LLMs", "RAG", "LoRA / PEFT", "Unsloth", "CrewAI", "SNAC Codec"],
  },
  {
    id: "voice",
    label: "Voice & Inference",
    icon: "graphic_eq",
    blurb: "Real-time voice pipelines and model serving",
    skills: ["FastAPI", "Pipecat", "LiveKit", "Twilio", "llama.cpp", "GGUF"],
  },
  {
    id: "eval",
    label: "Evaluation & Testing",
    icon: "fact_check",
    blurb: "Scoring and stress-testing AI agents",
    skills: ["LLM-as-a-judge", "WER/CER", "Latency benchmarking", "Red-teaming", "PII checks", "Load testing", "Twilio", "LiveKit"],
  },
  {
    id: "data",
    label: "Data & Infrastructure",
    icon: "database",
    blurb: "Storage, retrieval and running things in production",
    skills: [
      "Qdrant", "PostgreSQL", "MySQL", "MongoDB", "Docker", "Kubernetes", "Helm",
      "OpenTelemetry", "Jaeger", "KEDA", "ChromaDB", "FAISS", "Lightning AI",
    ],
  },
  {
    id: "lang",
    label: "Languages",
    icon: "code_blocks",
    blurb: "What I write systems in",
    skills: ["Python", "C++", "Go"],
  },
  {
    id: "front",
    label: "Frontend",
    icon: "web",
    blurb: "Interfaces for the systems above",
    skills: ["React", "Next.js", "Svelte", "TypeScript", "Tailwind", "Framer Motion"],
  },
];

export type StackLogo = {
  name: string;
  /** file in /public/stack, or null for a text mark */
  slug: string | null;
  /** skill names in STACK_HUBS this logo represents (for linked highlighting) */
  match: string[];
  /** hover colour for text marks */
  color?: string;
};

export const STACK_LOGOS: StackLogo[] = [
  { name: "Python", slug: "python", match: ["Python"] },
  { name: "PyTorch", slug: "pytorch", match: ["PyTorch"] },
  { name: "Go", slug: "go", match: ["Go"] },
  { name: "C++", slug: "cplusplus", match: ["C++"] },
  { name: "TypeScript", slug: "typescript", match: ["TypeScript"] },
  { name: "React", slug: "react", match: ["React"] },
  { name: "Next.js", slug: "nextdotjs", match: ["Next.js"] },
  { name: "Svelte", slug: "svelte", match: ["Svelte"] },
  { name: "Tailwind CSS", slug: "tailwindcss", match: ["Tailwind"] },
  { name: "FastAPI", slug: "fastapi", match: ["FastAPI"] },
  { name: "PostgreSQL", slug: "postgresql", match: ["PostgreSQL"] },
  { name: "MongoDB", slug: "mongodb", match: ["MongoDB"] },
  { name: "MySQL", slug: "mysql", match: ["MySQL"] },
  { name: "Docker", slug: "docker", match: ["Docker"] },
  { name: "Kubernetes", slug: "kubernetes", match: ["Kubernetes"] },
  { name: "Qdrant", slug: "qdrant", match: ["Qdrant"] },
  { name: "LiveKit", slug: "livekit", match: ["LiveKit"] },
  { name: "Twilio", slug: null, match: ["Twilio"], color: "#F22F46" },
  { name: "LangChain", slug: "langchain", match: ["LangChain"] },
  { name: "CrewAI", slug: "crewai", match: ["CrewAI"] },
  { name: "Pipecat", slug: "pipecat", match: ["Pipecat"] },
  { name: "OpenTelemetry", slug: "opentelemetry", match: ["OpenTelemetry"] },
  { name: "Jaeger", slug: "jaeger", match: ["Jaeger"] },
  { name: "Lightning AI", slug: "lightning", match: ["Lightning AI"] },
];

/** Is `skill` lit when `focus` (a hub id or a skill name) is active? */
export function isLit(focus: string | null, skill: string): boolean {
  if (!focus) return false;
  const hub = STACK_HUBS.find((h) => h.id === focus);
  return hub ? hub.skills.includes(skill) : focus === skill;
}
