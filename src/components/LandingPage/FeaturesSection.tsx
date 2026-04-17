const FEATURES = [
  {
    title: "Real-Time Position",
    desc: "See your exact queue number and who's currently being served — updated live, no refresh needed.",
  },
  {
    title: "Smart Notifications",
    desc: "Get alerted when your turn is approaching so you can return right on time.",
  },
  {
    title: "Remote Monitoring",
    desc: "Track your queue from anywhere on your phone. Run errands, grab food — we'll hold your spot.",
  },
  {
    title: "Zero Physical Wait",
    desc: "No more standing in line. Use your waiting time productively while the system tracks your place.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-8"
      style={{ background: "var(--off)" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--sky)" }}>
          What you get
        </p>
        <h2
          className="font-head font-extrabold mb-12"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--navy)" }}
        >
          Built for real waiting
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1 cursor-default"
              style={{
                background: "white",
                border: "1px solid rgba(13,43,110,0.12)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(13,43,110,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              <h3
                className="font-head text-base font-bold mb-2"
                style={{ color: "var(--navy)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B82A8" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}