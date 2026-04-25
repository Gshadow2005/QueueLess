import LiveDemoCard from "./LiveDemoCard";

const STATS = [
  { value: "82%", label: "of people avoid long lines" },
  { value: "40%", label: "leave without being served" },
  { value: "30 min", label: "average patience threshold" },
];

interface HeroSectionProps {
  onLaunchApp: () => void;
}

export default function HeroSection({ onLaunchApp }: HeroSectionProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen grid md:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-center max-w-384 mx-auto px-6 sm:px-10 xl:px-16 py-20">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute rounded-full"
          style={{
            width: 900,
            height: 900,
            background: "var(--sky)",
            filter: "blur(140px)",
            opacity: 0.12,
            top: -200,
            right: -200,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            background: "var(--navy-light)",
            filter: "blur(140px)",
            opacity: 0.12,
            bottom: -100,
            left: -150,
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
          style={{ fontSize: "clamp(2.25rem, 3.5vw, 4rem)", color: "var(--navy)" }}
        >
          Your place in line,
          <br />
          <span style={{ color: "var(--sky)" }}>wherever you go.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="leading-relaxed max-w-xl mb-8"
          style={{ fontSize: "clamp(1rem, 1.25vw, 1.2rem)", color: "#6B82A8" }}
        >
          Stop standing in line. QueueLess lets you track your queue position
          remotely — get notified when your turn is near, so you can use your
          waiting time however you want.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 items-center mb-12">
          <button
            onClick={onLaunchApp}
            className="font-semibold px-8 py-3 rounded-full text-white transition-all duration-200 hover:-translate-y-px"
            style={{ fontSize: "clamp(0.9rem, 1vw, 1.05rem)", background: "var(--navy)", border: "2px solid var(--navy)", fontFamily: "var(--font-body)", cursor: "pointer" }}
          >
            Join a Queue
          </button>
          <a
            href="#how"
            onClick={(e) => handleScroll(e, "how")}
            className="font-medium px-6 py-3 rounded-full transition-all duration-200"
            style={{
              fontSize: "clamp(0.9rem, 1vw, 1.05rem)",
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
                  className="block font-head font-extrabold"
                  style={{ fontSize: "clamp(1.4rem, 1.75vw, 2rem)", color: "var(--navy)" }}
                >
                  {stat.value}
                </strong>
                <span style={{ fontSize: "clamp(0.7rem, 0.75vw, 0.8rem)", color: "#6B82A8" }}>
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