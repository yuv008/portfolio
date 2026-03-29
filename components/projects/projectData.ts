export interface ProjectNode {
  id: string;
  label: string;
  type: "frontend" | "backend" | "database" | "vector-db" | "ai" | "feature" | "data" | "process" | "infra";
  tooltip?: string;
}

export interface ProjectEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Decision {
  question: string;
  answer: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  detail: string;
  unit?: string;
}

export interface JourneyPhase {
  phase: string;
  icon: string;
  color: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  featured: boolean;
  stack: string[];
  period: string;
  links?: Record<string, string>;
  architecture: { nodes: ProjectNode[]; edges: ProjectEdge[] };
  decisions: Decision[];
  metrics: ProjectMetric[];
  reflection: string;
  journey?: JourneyPhase[];
}

export const projects: Project[] = [
  {
    id: "orpheus-tts",
    name: "Orpheus TTS",
    tagline: "A language model where the 'language' is sound",
    featured: true,
    stack: ["Llama 3.2 3B", "LoRA", "Unsloth", "SNAC Codec", "llama.cpp", "GGUF", "FastAPI", "Lightning AI"],
    period: "2025",
    links: {
      model: "https://huggingface.co/yuv008/orpheus-elise-merged",
      lora: "https://huggingface.co/yuv008/orpheus-elise-lora",
    },
    architecture: {
      nodes: [
        { id: "dataset", label: "Elise Dataset\n~1,200 pairs", type: "data" },
        { id: "audio-in", label: "Audio Input", type: "frontend" },
        {
          id: "snac",
          label: "SNAC Codec",
          type: "ai",
          tooltip: "Encodes raw audio into discrete token sequences that a language model can learn",
        },
        {
          id: "llama",
          label: "Llama 3.2 3B\n(Orpheus)",
          type: "ai",
          tooltip: "Base causal LM fine-tuned to predict SNAC audio tokens instead of text tokens",
        },
        {
          id: "lora",
          label: "LoRA Adapters\n(16-bit)",
          type: "ai",
          tooltip: "Parameter-efficient fine-tuning — trains only low-rank adapter matrices, not the full 3B params",
        },
        { id: "merge", label: "Adapter Merge", type: "process" },
        {
          id: "gguf",
          label: "GGUF Q4_K_M\nExport",
          type: "process",
          tooltip: "Quantized from 6.3GB to ~2GB for efficient inference",
        },
        {
          id: "llamacpp",
          label: "llama.cpp\nInference",
          type: "backend",
          tooltip: "C++ inference engine, rebuilt with AVX2+FMA for CPU optimization",
        },
        {
          id: "gpu",
          label: "T4 GPU\n(Lightning AI)",
          type: "infra",
          tooltip: "Final deployment target — 65 tok/s vs 7.5 tok/s on CPU",
        },
        { id: "fastapi", label: "FastAPI\nBackend", type: "backend" },
        { id: "audio-out", label: "Audio Output", type: "frontend" },
      ],
      edges: [
        { from: "dataset", to: "snac" },
        { from: "audio-in", to: "snac" },
        { from: "snac", to: "llama" },
        { from: "lora", to: "llama" },
        { from: "llama", to: "merge" },
        { from: "merge", to: "gguf" },
        { from: "gguf", to: "llamacpp" },
        { from: "llamacpp", to: "gpu" },
        { from: "gpu", to: "fastapi" },
        { from: "fastapi", to: "snac", label: "decode" },
        { from: "snac", to: "audio-out", label: "reconstruct" },
      ],
    },
    decisions: [
      {
        question: "Why train a language model to output sound?",
        answer:
          "Orpheus TTS treats audio generation as a language modeling problem. Audio is encoded into discrete SNAC tokens, and the LLM learns to predict token sequences that decode back into speech. The 'language' the model speaks is sound — same transformer architecture, completely different modality.",
      },
      {
        question: "Why LoRA instead of full fine-tuning?",
        answer:
          "Full fine-tuning a 3B parameter model requires significant GPU memory and risks catastrophic forgetting. LoRA trains only low-rank adapter matrices — a fraction of the parameters — making it possible to fine-tune on a single GPU in 19 minutes while preserving the base model's learned representations.",
      },
      {
        question: "Why GGUF quantization?",
        answer:
          "The full model is 6.3GB. GGUF Q4_K_M quantization compresses it to ~2GB with minimal quality loss, enabling inference on consumer hardware. Combined with llama.cpp's optimized C++ runtime, this made CPU inference viable (slow, but functional) and GPU inference fast.",
      },
      {
        question: "Why the SNAC codec specifically?",
        answer:
          "SNAC produces hierarchical discrete tokens from audio — multiple codebook levels at different resolutions. Each token position requires subtracting a different codebook offset (0, 4096, 8192, 12288, 16384, 20480, 24576). Without this offset correction, the model generates perfect silence. This was the hardest bug to find.",
      },
      {
        question: "Why move from CPU to GPU?",
        answer:
          "CPU inference on a 3B model is a memory bandwidth problem, not a compute problem. Even with AVX2+FMA optimizations and GGUF quantization, CPU topped out at ~7.5 tokens/sec (~95 seconds per sentence). The T4 GPU on Lightning AI hit ~65 tokens/sec — roughly 30x faster, bringing generation down to ~3 seconds for short prompts.",
      },
    ],
    metrics: [
      { label: "Training time", value: "19", unit: "min", detail: "1 epoch, 299 steps, single GPU" },
      { label: "Dataset", value: "1,200", unit: "pairs", detail: "Audio-text pairs from Jinsaryko/Elise" },
      { label: "Model compression", value: "68", unit: "%", detail: "6.3GB → ~2GB via GGUF Q4_K_M" },
      { label: "CPU inference", value: "7.5", unit: "tok/s", detail: "llama.cpp with AVX2+FMA" },
      { label: "GPU inference", value: "65", unit: "tok/s", detail: "T4 on Lightning AI" },
      { label: "Speedup", value: "30", unit: "×", detail: "CPU → GPU inference improvement" },
      { label: "Short prompt latency", value: "3", unit: "sec", detail: "4-5 word prompts on T4 GPU" },
    ],
    reflection:
      "Even with just ~1,200 audio-text pairs and a single epoch, the model produced surprisingly good phoneme articulation and natural voice quality. That said, the voice lacks emotional range — it sounds competent but flat. More training data with varied intonation patterns, plus multi-speaker conditioning, would be the next step. I'd also explore replacing SNAC with a newer codec like DAC or EnCodec to see if token efficiency improves. The SNAC offset bug taught me that codec-level debugging is an entirely different skill from model debugging — the model can be perfect and the output can still be silence.",
    journey: [
      {
        phase: "Training",
        icon: "gear",
        color: "var(--accent)",
        content:
          "Fine-tuned Orpheus TTS (Llama 3.2 3B) using LoRA with Unsloth. The model learns to generate SNAC audio tokens instead of text tokens — a language model where the 'language' is sound. 1 epoch, 299 steps, ~19 minutes on a single GPU. Merged adapters, exported to GGUF Q4_K_M. Model went from 6.3GB to ~2GB.",
      },
      {
        phase: "Round 1 — CPU Deployment",
        icon: "cloud",
        color: "var(--text-secondary)",
        content:
          "First attempt: CPU inference. PyTorch Transformers was extremely slow. Switched to llama.cpp + GGUF quantization. Result: ~7.5 tokens/sec, ~95 seconds per sentence. Slow, but the voice quality was already surprisingly good — even with a small dataset and just one epoch, good phoneme articulation and natural quality.",
      },
      {
        phase: "Round 2 — The Optimization Rabbit Hole",
        icon: "settings",
        color: "var(--signal-amber)",
        content:
          "Deep systems debugging. Rebuilt llama.cpp with AVX2 + FMA. Attempted INT8 dynamic quantization (OOM killed). Fixed SNAC token decoding offsets — each token position requires subtracting a different codebook offset: 0, 4096, 8192, 12288, 16384, 20480, 24576. Without this fix, the model generates perfect silence. Key realization: CPU inference for 3B models is a memory bandwidth problem, not a compute problem.",
      },
      {
        phase: "Round 3 — GPU Deployment",
        icon: "zap",
        color: "var(--signal-green)",
        content:
          "Moved inference to a T4 GPU on Lightning AI. Result: ~65 tokens/sec, ~3 seconds for short prompts (4-5 words). Roughly 30x faster than CPU. Added dynamic max_tokens scaling, audio file persistence, FastAPI backend + simple web UI. Ship it.",
      },
    ],
  },
  {
    id: "smart-pathshala",
    name: "Smart Pathshala",
    tagline: "Offline-first AI school ecosystem for Tier-2 and Tier-3 India",
    featured: false,
    stack: ["FastAPI", "React", "PostgreSQL", "Qdrant", "CrewAI"],
    period: "July 2025 – Present",
    architecture: {
      nodes: [
        { id: "client", label: "React Frontend", type: "frontend" },
        { id: "api", label: "FastAPI Backend", type: "backend" },
        { id: "postgres", label: "PostgreSQL", type: "database" },
        { id: "qdrant", label: "Qdrant", type: "vector-db" },
        { id: "crewai", label: "CrewAI Agents", type: "ai" },
        { id: "calendar", label: "AI Calendar", type: "feature" },
        { id: "examgen", label: "Exam Generator", type: "feature" },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "postgres" },
        { from: "api", to: "qdrant" },
        { from: "api", to: "crewai" },
        { from: "crewai", to: "calendar" },
        { from: "crewai", to: "examgen" },
        { from: "qdrant", to: "crewai" },
      ],
    },
    decisions: [
      {
        question: "Why offline-first?",
        answer:
          "Tier-2/3 Indian schools have unreliable internet. The platform must work without connectivity and sync when online. This drove the architecture toward local-first data with eventual consistency.",
      },
      {
        question: "Why Qdrant over ChromaDB?",
        answer:
          "Needed hybrid dense-sparse search for embedding-based queries + keyword fallback. Qdrant supports this natively. ChromaDB didn't scale for our use case.",
      },
      {
        question: "Why CrewAI for agents?",
        answer:
          "Multi-agent orchestration for calendar scheduling and exam generation required role-based agents with shared context. CrewAI's crew abstraction fit the workflow.",
      },
    ],
    metrics: [
      { label: "Roles supported", value: "4", detail: "Admin, Teacher, Parent, Student" },
      { label: "AI features", value: "3", detail: "Calendar, Exam Gen, Search" },
    ],
    reflection:
      "If I were starting over, I'd evaluate SQLite with CRDT sync (like CR-SQLite) instead of PostgreSQL for true offline-first. The current sync model has edge cases with conflict resolution that a CRDT approach would handle more elegantly.",
  },
  {
    id: "shetniyojan",
    name: "ShetNiyojan",
    tagline: "Intelligent agricultural planning from seed to sale",
    featured: false,
    stack: ["LLM", "Flask", "MongoDB"],
    period: "April 2025",
    architecture: {
      nodes: [
        { id: "planning", label: "Planning Module", type: "feature" },
        { id: "growing", label: "Growing Module", type: "feature" },
        { id: "distribution", label: "Distribution Module", type: "feature" },
        { id: "llm", label: "LLM Engine", type: "ai" },
        { id: "cv", label: "Disease Detection (CV)", type: "ai" },
        { id: "mongo", label: "MongoDB", type: "database" },
        { id: "flask", label: "Flask API", type: "backend" },
      ],
      edges: [
        { from: "flask", to: "planning" },
        { from: "flask", to: "growing" },
        { from: "flask", to: "distribution" },
        { from: "llm", to: "planning" },
        { from: "cv", to: "growing" },
        { from: "flask", to: "mongo" },
      ],
    },
    decisions: [
      {
        question: "Why end-to-end (planning → distribution)?",
        answer:
          "Most agri-tech tools solve one slice. Farmers need the full pipeline — what to grow, how to grow it, where to sell it. Fragmented tools create data silos.",
      },
      {
        question: "Why MongoDB?",
        answer:
          "Agricultural data is highly variable — different crops have different schemas, sensor data is semi-structured. Document model handles this naturally without schema migrations.",
      },
    ],
    metrics: [
      { label: "Hackathon result", value: "1st", detail: "Winner at Devclash 2025, DY Patil" },
      { label: "Modules", value: "3", detail: "Planning, Growing, Distribution" },
    ],
    reflection:
      "The LLM crop recommendation module needs grounding in local agricultural data (soil reports, regional weather). Currently it relies too heavily on general knowledge. A RAG pipeline with government agricultural databases would make recommendations significantly more reliable.",
  },
  {
    id: "legify",
    name: "Legify",
    tagline: "AI-powered legal document simplification and Q&A",
    featured: false,
    stack: ["BERTSum", "FAISS", "Django", "TTS/STT"],
    period: "March 2025",
    architecture: {
      nodes: [
        { id: "input", label: "Document Input", type: "frontend" },
        { id: "bertsum", label: "BERTSum Summarizer", type: "ai" },
        { id: "faiss", label: "FAISS Index", type: "vector-db" },
        { id: "rag", label: "RAG Q&A", type: "ai" },
        { id: "tts", label: "TTS Output", type: "feature" },
        { id: "stt", label: "STT Input", type: "feature" },
        { id: "django", label: "Django Backend", type: "backend" },
      ],
      edges: [
        { from: "input", to: "django" },
        { from: "django", to: "bertsum" },
        { from: "django", to: "faiss" },
        { from: "faiss", to: "rag" },
        { from: "stt", to: "django" },
        { from: "django", to: "tts" },
      ],
    },
    decisions: [
      {
        question: "Why BERTSum over GPT-based summarization?",
        answer:
          "Legal text requires extractive summarization that preserves exact phrasing — you can't paraphrase a legal clause. BERTSum's extractive approach maintains fidelity while reducing length.",
      },
      {
        question: "Why add TTS/STT?",
        answer:
          "Legal accessibility. Many users who need legal document understanding aren't comfortable reading dense text. Voice interface lowers the barrier.",
      },
    ],
    metrics: [
      { label: "Hackathon result", value: "1st", detail: "Winner at Synapse 2.0, CCOEW" },
      { label: "Search backend", value: "FAISS", detail: "Fast similarity search for RAG Q&A" },
    ],
    reflection:
      "BERTSum works for extractive summarization but struggles with cross-document synthesis. For a production version, I'd use a hybrid approach — extractive for clause-level summaries, abstractive (with legal fine-tuning) for cross-document analysis.",
  },
];
