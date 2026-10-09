"use client";


const CARDS = [
  {
    color: "#6ee7ff",
    kicker: "Voice_Systems",
    title: "Real-Time Voice Infrastructure",
    body: "Built LiveKit voice pipelines with streaming inference, connection pooling, and smart caching, reducing response time from 3 seconds to 1.2 seconds.",
  },
  {
    color: "#ab8aff",
    kicker: "Retrieval_Infrastructure",
    title: "Hybrid Vector Search",
    body: "Migrated Chroma to Qdrant with hybrid dense-sparse search, reducing query latency by 90% for voice-agent workloads.",
  },
  {
    color: "#ffac5e",
    kicker: "Model_Engineering",
    title: "Fine-Tuning & Evaluation",
    body: "Fine-tuned Llama-3.1-8B with PEFT on a 10,000+ term dream-interpretation dataset and trained Orpheus TTS to generate SNAC audio tokens.",
  },
];

export function About() {
  return (
    <section id="about" className="section-shell">
      <div className="section-container">
        <header
          className="mb-14 text-center"
        >
          <p className="section-kicker mb-4">// Manifest_v5.0</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card) => (
            <div
              key={card.kicker}
              className="relative rounded-[32px] overflow-hidden group"
              style={{
                padding: 28,
                background: "rgba(20,27,35,0.94)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.borderColor = `${card.color}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${card.color}12, 0 8px 24px rgba(0,0,0,0.18)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[32px] pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${card.color}, transparent)` }}
              />

              {/* Dot indicator */}
              <div
                className="w-2 h-2 rounded-full mb-3"
                style={{ background: card.color, boxShadow: `0 0 8px ${card.color}` }}
              />

              <p
                className="mb-2"
                style={{
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: card.color,
                }}
              >
                {card.kicker}
              </p>

              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "rgb(233,240,245)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgb(191,205,218)",
                  margin: 0,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
