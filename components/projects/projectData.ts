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

export type Cover =
  | { kind: "hover-video"; image: string; video: string; watchHref?: string; fit?: "cover" | "contain" }
  | { kind: "slides"; images: string[] }
  | { kind: "waveform" }
  | { kind: "diagram" };

export interface Project {
  id: string;
  name: string;
  tagline: string;
  featured: boolean;
  stack: string[];
  period: string;
  links?: Record<string, string>;
  cover: Cover;
  /** What the Wisp guide says when it explains this project (2 short sentences). */
  petScript: string;
  /** One short supporting fact shown under the script. */
  petFact?: string;
  architecture: { nodes: ProjectNode[]; edges: ProjectEdge[] };
  decisions: Decision[];
  metrics: ProjectMetric[];
  reflection: string;
  journey?: JourneyPhase[];
}

export const projects: Project[] = [
  {
    id: "weave",
    name: "Weave",
    tagline: "A company brain that knows who's allowed to know what",
    featured: true,
    stack: ["FalkorDB", "Cypher", "Python", "FastAPI", "Postgres + pgvector", "MCP", "Groq", "Docker", "AWS ECS"],
    period: "October 2026",
    cover: {
      kind: "hover-video",
      image: "/weave-hero.png",
      video: "/weave-demo.mp4",
      fit: "contain",
      watchHref: "https://www.youtube.com/watch?v=psdbCkjoa38",
    },
    petScript:
      "Weave is a company brain. It pulls Slack, Notion, Drive and GitHub into one knowledge graph, so every answer comes with its source and only shows what you're allowed to see.",
    petFact: "7 connectors, 12 agent tools, 375 tests.",
    links: {
      github: "https://github.com/yuv008/Weave",
      demo: "https://we-9a1fc0e727ab4797bb20ad28efef5a43.ecs.ap-southeast-2.on.aws/",
      video: "https://www.youtube.com/watch?v=psdbCkjoa38",
      article:
        "https://medium.com/@atharvkulkarni005/weave-building-a-company-brain-on-falkordb-that-knows-whos-allowed-to-know-what-056559fd923b",
    },
    architecture: {
      nodes: [
        { id: "sources", label: "Slack · Notion\nDrive · GitHub", type: "data", tooltip: "Plus Gmail, Calendar and HubSpot pollers" },
        { id: "ingest", label: "Ingestion\nPipeline", type: "process", tooltip: "Raw store, normalize, chunk, rules, classifier, LLM extraction, entity resolution, supersede check, idempotent MERGE. The only writer of the company graph." },
        { id: "falkor", label: "FalkorDB\nco:{tenant}", type: "database", tooltip: "One company graph per tenant, plus a private graph per user" },
        { id: "pg", label: "Postgres +\npgvector", type: "vector-db", tooltip: "Raw items, chunks, ACL snapshots, agent memory, audit log, with row-level security" },
        { id: "gate", label: "Permission\nGate", type: "feature", tooltip: "Turns a principal into Cypher and SQL predicates applied inside every query" },
        { id: "answer", label: "Answer Agent", type: "ai", tooltip: "Routes intent, calls vetted read-only tools (max 6), drops any claim without evidence" },
        { id: "watcher", label: "Impact Watcher", type: "ai", tooltip: "Reacts to change events, walks dependencies, notifies affected owners" },
        { id: "mcp", label: "MCP Server", type: "backend" },
        { id: "surfaces", label: "Cursor · Slack\nGmail · Wisp", type: "frontend", tooltip: "Wisp is a Windows desktop companion that fills @bubble blanks from company memory" },
        { id: "edge", label: "AWS ECS\n+ nginx edge", type: "infra" },
      ],
      edges: [
        { from: "sources", to: "ingest" },
        { from: "ingest", to: "falkor", label: "MERGE" },
        { from: "ingest", to: "pg" },
        { from: "falkor", to: "gate" },
        { from: "pg", to: "gate" },
        { from: "gate", to: "answer" },
        { from: "gate", to: "watcher" },
        { from: "answer", to: "mcp" },
        { from: "mcp", to: "surfaces" },
        { from: "watcher", to: "surfaces", label: "alerts" },
        { from: "edge", to: "mcp" },
      ],
    },
    decisions: [
      {
        question: "Why a graph instead of vector search over documents?",
        answer:
          "'Chat with your docs' fixes searching but not three harder problems: facts change (Provider A on Oct 3, Provider B on Oct 12), facts depend on other teams' work, and not everyone may see everything. Those are relationship problems. So a fact is a node with evidence: a Decision linked to the message that states it, the person who made it, the topic it's about, and the decision it replaces.",
      },
      {
        question: "Why enforce permissions inside the Cypher query?",
        answer:
          "The LLM never decides who sees what. One shared function turns the caller into a visibility predicate on each item's acl_groups, min_level, deleted flag and source freshness, and it runs before ranking and LIMIT. Hidden data is never returned, counted or scored. The query that hides the fact is the query that cites it.",
      },
      {
        question: "How do you keep a claim only if it has visible evidence when FalkorDB lacks EXISTS subqueries?",
        answer:
          "FalkorDB has no EXISTS { } subqueries and rejects pattern comprehensions inside WHERE. The rule became a WITH step: collect the visible evidence into a list, then WHERE size(evidence) > 0. A side effect is that the same query filters the fact and supplies its citations.",
      },
      {
        question: "Why supersede facts instead of overwriting them?",
        answer:
          "A reversal adds a SUPERSEDES edge and closes the old claim's valid_to. Nothing is deleted. 'Current' is status = 'active', and 'what did we decide as of Oct 5?' is a valid_from/valid_to window filter. A lower-authority source (chat) cannot supersede a higher one (tracker, document).",
      },
      {
        question: "How does impact analysis avoid leaking private threads?",
        answer:
          "impact_of is a breadth-first walk over NEEDS, DEPENDS_ON and BLOCKED_BY, expanding one hop per query up to 3 hops. An edge survives only if one of its evidence_ids is visible to the caller. A count-only twin of each query reports how many edges were hidden without naming them, so a salesperson learns her commitment is at risk without seeing the engineering thread that caused it.",
      },
      {
        question: "Why do agents call fixed tools instead of writing Cypher?",
        answer:
          "Each tool has the permission filter built in, and agents open the graph read-only (ro_query). A test enumerates every registered tool and fails if any can write. A conversation can never turn a private fact into shared knowledge, and only the ingestion pipeline writes the company graph.",
      },
      {
        question: "Who is the audience in a shared Slack channel?",
        answer:
          "Private surfaces answer as the asker. A shared channel answers as a channel principal: the lowest member level plus the channel's own groups. If that's too little to be useful, the bot offers the full answer by DM.",
      },
    ],
    metrics: [
      { label: "Connectors", value: "7", detail: "Slack, Notion, Drive, GitHub, Gmail, Calendar, HubSpot" },
      { label: "Graph node types", value: "13", detail: "Org, work, claims and evidence families on a fixed ontology" },
      { label: "Agent tools", value: "12", detail: "Vetted, read-only, each with the permission gate built in" },
      { label: "Tool calls per answer", value: "6", unit: "max", detail: "Bounded plan-and-act loop; claims without evidence ids are dropped" },
      { label: "Impact walk depth", value: "3", unit: "hops", detail: "One gated hop per query; hidden edges counted, never named" },
      { label: "Expertise half-life", value: "30", unit: "days", detail: "find_owner score = Σ 0.5^(age/30) over visible items only" },
      { label: "Test suite", value: "375", unit: "tests", detail: "Visibility matrix, tenant isolation, read-only tools, Wisp and @bubble" },
    ],
    reflection:
      "The most useful constraint was FalkorDB itself: with no EXISTS subqueries, 'keep a claim only if it has visible evidence' had to become a WITH step, and that rewrite turned out better than the original because one query now both filters the fact and returns its citations. Putting permissions in the query rather than the prompt made the system easy to reason about and test. The next steps are broader connector permission fidelity (group and sharing sync beyond public channels and shared folders) and taking the Wisp desktop companion beyond Windows.",
    journey: [
      {
        phase: "Facts as nodes",
        icon: "gear",
        color: "var(--accent)",
        content:
          "Fixed a core ontology (Person, Team, Project, Decision, Commitment, Figure, Item, Source and more) so every claim is a node with EVIDENCED_BY edges carrying quote, span and confidence. No evidence, no fact.",
      },
      {
        phase: "Permissions in the query",
        icon: "settings",
        color: "var(--signal-amber)",
        content:
          "Built one gate that compiles a caller's level, groups and source freshness into Cypher and SQL predicates, backed by Postgres row-level security for tenant isolation. A stalled ACL sync hides data instead of leaking it.",
      },
      {
        phase: "Agents and the pet",
        icon: "zap",
        color: "var(--signal-green)",
        content:
          "Answer agent and impact watcher behind MCP, Slack replies, and Wisp, a Windows desktop companion that watches for @bubble in Cursor and Gmail and fills only that blank from the graph, with the citation on a card first.",
      },
      {
        phase: "Off the laptop",
        icon: "cloud",
        color: "var(--text-secondary)",
        content:
          "Containerized the webhook, agent and worker, deployed to AWS ECS in Sydney behind an nginx edge, added a hosted Connect page and per-company login so each browser session stays on its own tenant, and pooled Postgres connections so typing-time cues return quickly.",
      },
    ],
  },
  {
    id: "orpheus-tts",
    name: "Orpheus TTS",
    tagline: "A language model where the 'language' is sound",
    featured: true,
    stack: ["Llama 3.2 3B", "LoRA", "Unsloth", "SNAC Codec", "llama.cpp", "GGUF", "FastAPI", "Lightning AI"],
    period: "March 2026",
    cover: { kind: "waveform" },
    petScript:
      "Orpheus turns a language model into a voice. Yuvraj fine-tuned Llama 3.2 3B to predict audio tokens instead of text, then moved inference from CPU to a GPU for about 30 times the speed.",
    petFact: "19 minutes of training on about 1,200 audio clips.",
    links: {
      github: "https://github.com/yuv008/Orpheus-tts",
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
    featured: true,
    stack: ["FastAPI", "React", "PostgreSQL", "Qdrant", "CrewAI"],
    period: "July 2025 – June 2026",
    cover: { kind: "diagram" },
    petScript:
      "Smart Pathshala is an offline-first AI school platform for Tier-2 and Tier-3 India, with views for admins, teachers, parents and students. AI handles the calendar, exam generation and search.",
    petFact: "Built to keep working without reliable internet.",
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
    cover: {
      kind: "hover-video",
      image: "/covers/shetniyojan-home.webp",
      video: "/covers/shetniyojan-loop.mp4",
    },
    petScript:
      "ShetNiyojan helps farmers from planning to selling: crop recommendations, plant-disease detection and supply-chain routing in one app.",
    petFact: "First place at Devclash 2025.",
    links: {
      github: "https://github.com/yuv008/ShetNiyojan",
    },
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
    id: "warcast",
    name: "WarCast",
    tagline: "AI-based defense news aggregator with sentiment analysis and summaries",
    featured: false,
    stack: ["Flask", "Python", "DistilBERT", "BART", "BeautifulSoup", "Newspaper3k"],
    period: "2025",
    cover: {
      kind: "slides",
      images: [
        "/covers/warcast-home.webp",
        "/covers/warcast-search.webp",
        "/covers/warcast-code.webp",
        "/covers/warcast-dashboard.webp",
      ],
    },
    petScript:
      "WarCast collects defense news from 10+ sources, scores the sentiment with DistilBERT and writes short BART summaries, in several languages.",
    petFact: "First prize at L&T NeuroHack.",
    links: {
      github: "https://github.com/GopalDose/WarCast",
    },
    architecture: {
      nodes: [
        { id: "sources", label: "10+ Defense Sources", type: "data" },
        { id: "scraper", label: "News Scraper", type: "backend" },
        { id: "sentiment", label: "DistilBERT", type: "ai" },
        { id: "summary", label: "BART Summarizer", type: "ai" },
        { id: "api", label: "Flask REST API", type: "backend" },
        { id: "feed", label: "Categorized Feed", type: "frontend" },
        { id: "multi", label: "Multilingual Output", type: "feature" },
      ],
      edges: [
        { from: "sources", to: "scraper" },
        { from: "scraper", to: "sentiment" },
        { from: "scraper", to: "summary" },
        { from: "sentiment", to: "api" },
        { from: "summary", to: "api" },
        { from: "api", to: "feed" },
        { from: "api", to: "multi" },
      ],
    },
    decisions: [
      {
        question: "Why combine scraping with NLP instead of a simple feed reader?",
        answer:
          "WarCast is designed to reduce noise, not just collect links. Scraping pulls in articles from multiple defense sources, then sentiment analysis and summarization turn them into a faster, more focused briefing experience.",
      },
      {
        question: "Why DistilBERT for sentiment?",
        answer:
          "The model is lightweight enough to run in a Flask pipeline while still providing reliable classification for short news articles and headlines. That keeps the backend responsive without sacrificing much accuracy.",
      },
      {
        question: "Why BART for summaries?",
        answer:
          "Defense news tends to be dense and repetitive. BART gives concise abstractive summaries that keep the important signal while trimming the article down to something you can scan quickly.",
      },
    ],
    metrics: [
      { label: "Sources", value: "10+", detail: "Global defense publishers aggregated in real time" },
      { label: "Summary length", value: "150", unit: "words", detail: "Concise BART-based article summaries" },
      { label: "Languages", value: "Multi", detail: "Multilingual support for broader access" },
    ],
    reflection:
      "The strongest next step is better source quality controls and stronger deduplication, since defense news often repeats the same story across publishers. A production version would also benefit from source freshness scoring and a clearer personalization layer so the sentiment feed learns what matters most to each reader.",
  },
  {
    id: "legify",
    name: "Legify",
    tagline: "AI-powered legal document simplification and Q&A",
    featured: false,
    stack: ["BERTSum", "FAISS", "Django", "TTS/STT"],
    period: "March 2025",
    cover: {
      kind: "slides",
      images: ["/covers/legify-home.webp", "/covers/legify-dashboard.webp"],
    },
    petScript:
      "Legify turns dense legal documents into plain-language summaries, and lets you ask questions about them with voice in and out.",
    petFact: "First place at Synapse 2.0.",
    links: {
      github: "https://github.com/yuv008/LegiFy",
    },
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
