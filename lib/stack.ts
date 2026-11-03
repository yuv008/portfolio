/** The stack, as category hubs with skills. A skill listed under two hubs links them. */
export type StackHub = {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  /** Where this area was used, with a real result from the work. */
  proof: { stat: string; text: string };
  skills: string[];
};

export const STACK_HUBS: StackHub[] = [
  {
    id: "ai",
    label: "AI / ML",
    icon: "psychology",
    blurb: "Fine-tuning, retrieval and agent frameworks",
    proof: { stat: "LoRA", text: "Fine-tuned Llama 3.2 3B to speak audio tokens (Orpheus) and Llama 3.1 8B on 10k+ dream terms." },
    skills: ["PyTorch", "LangChain", "LLMs", "RAG", "LoRA / PEFT", "Unsloth", "CrewAI", "SNAC Codec"],
  },
  {
    id: "voice",
    label: "Voice & Inference",
    icon: "graphic_eq",
    blurb: "Real-time voice pipelines and model serving",
    proof: { stat: "3s → 1.2s", text: "Cut voice response time with LiveKit streaming inference, pooling and caching." },
    skills: ["FastAPI", "Pipecat", "LiveKit", "Twilio", "llama.cpp", "GGUF"],
  },
  {
    id: "eval",
    label: "Evaluation & Testing",
    icon: "fact_check",
    blurb: "Scoring and stress-testing AI agents",
    proof: { stat: "200 calls", text: "Validated 200 concurrent test calls with zero transport errors for VEE Legion." },
    skills: ["LLM-as-a-judge", "WER/CER", "Latency benchmarking", "Red-teaming", "PII checks", "Load testing", "Twilio", "LiveKit"],
  },
  {
    id: "data",
    label: "Data & Infrastructure",
    icon: "database",
    blurb: "Storage, retrieval and running things in production",
    proof: { stat: "−90%", text: "Query latency after moving from Chroma to Qdrant with hybrid dense-sparse search." },
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
    proof: { stat: "Go", text: "Concurrency ramping and slot-based orchestration for Legion, with Python for the models." },
    skills: ["Python", "C++", "Go"],
  },
  {
    id: "front",
    label: "Frontend",
    icon: "web",
    blurb: "Interfaces for the systems above",
    proof: { stat: "This site", text: "Svelte at DAOStreet; this portfolio is Next.js, Three.js and Framer Motion." },
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
