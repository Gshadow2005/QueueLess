import LiveDemoCard from "./LiveDemoCard";

const STATS = [
  { value: "82%", label: "of people avoid long lines" },
  { value: "40%", label: "leave without being served" },
  { value: "30 min", label: "average patience threshold" },
];

export default function HeroSection() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen grid md:grid-cols-[1fr_420px] gap-12 items-center max-w-6xl mx-auto px-8 py-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            background: "var(--sky)",
            filter: "blur(80px)",
            opacity: 0.18,
            top: -100,
            right: -100,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            background: "var(--navy-light)",
            filter: "blur(80px)",
            opacity: 0.18,
            bottom: 0,
            left: -80,
          }}
        />
      </div>

      {/* Left content */}
      <div className="relative z-10">
        {/* Badge */}
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border"
          style={{
            background: "var(--sky-pale)",
            color: "var(--navy-light)",
            borderColor: "var(--sky-light)",
          }}
        >
          Now serving smarter queues
        </div>

        {/* Title */}
        <h1
          className="font-head font-extrabold leading-tight mb-5"
          style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)", color: "var(--navy)" }}
        >
          Your place in line,
          <br />
          <span style={{ color: "var(--sky)" }}>wherever you go.</span>
        </h1>

        {/* Subtitle — matches original text-muted color #6B82A8, no extra opacity */}
        <p
          className="text-lg leading-relaxed max-w-lg mb-8"
          style={{ color: "#6B82A8" }}
        >
          Stop standing in line. QueueLess lets you track your queue position
          remotely — get notified when your turn is near, so you can use your
          waiting time however you want.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 items-center mb-12">
          <a
            href="#join"
            onClick={(e) => handleScroll(e, "join")}
            className="text-base font-semibold px-8 py-3 rounded-full text-white transition-all duration-200 hover:-translate-y-px"
            style={{ background: "var(--navy)", border: "2px solid var(--navy)" }}
          >
            Join a Queue →
          </a>
          <a
            href="#how"
            onClick={(e) => handleScroll(e, "how")}
            className="text-base font-medium px-6 py-3 rounded-full transition-all duration-200"
            style={{
              color: "#6B82A8",
              border: "2px solid rgba(13,43,110,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--sky)";
              e.currentTarget.style.color = "var(--navy)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(13,43,110,0.2)";
              e.currentTarget.style.color = "#6B82A8";
            }}
          >
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.value} className="flex items-center gap-6">
              <div>
                <strong
                  className="block font-head text-2xl font-extrabold"
                  style={{ color: "var(--navy)" }}
                >
                  {stat.value}
                </strong>
                <span className="text-xs" style={{ color: "#6B82A8" }}>
                  {stat.label}
                </span>
              </div>
              {i < STATS.length - 1 && (
                <div
                  className="w-px h-9"
                  style={{ background: "rgba(13,43,110,0.12)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — Live Demo Card */}
      <LiveDemoCard />
    </section>
  );
}