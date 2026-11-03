"use client";

const CARDS = [
  {
    icon: "graphic_eq",
    kicker: "Voice systems",
    title: "Real-Time Voice Infrastructure",
    body: "Built LiveKit voice pipelines with streaming inference, connection pooling, and smart caching, reducing response time from 3 seconds to 1.2 seconds.",
    stat: "3s → 1.2s",
  },
  {
    icon: "manage_search",
    kicker: "Retrieval",
    title: "Hybrid Vector Search",
    body: "Migrated Chroma to Qdrant with hybrid dense-sparse search, reducing query latency by 90% for voice-agent workloads.",
    stat: "−90%",
  },
  {
    icon: "model_training",
    kicker: "Models",
    title: "Fine-Tuning & Evaluation",
    body: "Fine-tuned Llama-3.1-8B with PEFT on a 10,000+ term dream-interpretation dataset and trained Orpheus TTS to generate SNAC audio tokens.",
    stat: "10k+ terms",
  },
];

export function About() {
  return (
    <section id="about" className="section-shell">
      <div className="section-container">
        <header className="mb-14 text-center">
          <p className="section-kicker mb-4">// Manifest_v5.0</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CARDS.map((card) => (
            <article key={card.kicker} className="tile tile-hover flex min-h-[320px] flex-col p-7">
              <div className="flex items-start justify-between">
                <span className="tile-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                    {card.icon}
                  </span>
                </span>
                <span className="tile-label">{card.kicker}</span>
              </div>

              <p className="mt-6 font-display text-3xl font-semibold tracking-tight text-neural-cyan">{card.stat}</p>

              <div className="mt-auto pt-8">
                <h3 className="tile-title">{card.title}</h3>
                <p className="tile-body mt-3">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
