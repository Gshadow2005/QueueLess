export default function CtaSection() {
  return (
    <section id="join" className="py-24 px-8 text-center" style={{ background: "var(--navy)" }}>
      <div className="max-w-xl mx-auto">
        <h2
          className="font-head font-extrabold text-white mb-4"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
        >
          No more guessing. No more standing.
        </h2>
        <p className="text-lg mb-8" style={{ color: "var(--sky-light)" }}>
          Join a queue the smart way — track your spot, get notified, arrive on time.
        </p>
        <a
          href="#"
          className="inline-block text-base font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:-translate-y-px"
          style={{
            background: "white",
            color: "var(--navy)",
            border: "2px solid white",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--sky-pale)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "white")
          }
        >
          Get Started Free →
        </a>
      </div>
    </section>
  );
}