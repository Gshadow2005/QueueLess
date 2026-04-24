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
    <section
      className="relative min-h-screen grid md:grid-cols-[1fr_590px] gap-0 items-center w-full px-25 py-20 overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

        {/* Dot grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(13,43,110,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        {/* Top-right large blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: 900,
            height: 900,
            background: "radial-gradient(ellipse at center, rgba(75,163,227,0.22) 0%, rgba(75,163,227,0.06) 60%, transparent 80%)",
            filter: "blur(40px)",
            top: -120,
            right: -200,
          }}
        />

        {/* Bottom-left blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            background: "radial-gradient(ellipse at center, rgba(26,61,143,0.16) 0%, transparent 70%)",
            filter: "blur(60px)",
            bottom: -150,
            left: -100,
          }}
        />

        {/* Mid-page subtle blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 300,
            background: "radial-gradient(ellipse at center, rgba(75,163,227,0.1) 0%, transparent 70%)",
            filter: "blur(50px)",
            top: "50%",
            left: "38%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

     {/* Left content */}
      <div className="relative z-25 pl-4 md:pl-8 lg:pl-12">
        {/* Badge */}
        <div
          className="inline-block text-sm font-semibold uppercase tracking-widest px-5 py-2 rounded-full mb-8 border"
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
          className="font-head font-extrabold leading-tight mb-8"
          style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", color: "var(--navy)" }}
        >
          Your place in line,
          <br />
          <span style={{ color: "var(--sky)" }}>wherever you go.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl leading-relaxed max-w-2xl mb-12"
          style={{ color: "#5a718e" }}
        >
          Stop standing in line. QueueLess lets you track your queue position
          remotely — get notified when your turn is near, so you can use your
          waiting time however you want.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 items-center mb-16">
          <button
            onClick={onLaunchApp}
            className="text-lg font-semibold px-10 py-4 rounded-full text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "var(--navy)",
              border: "2px solid var(--navy)",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(13,43,110,0.18)",
            }}
          >
            Join a Queue
          </button>
          <a
            href="#how"
            onClick={(e) => handleScroll(e, "how")}
            className="text-lg font-medium px-8 py-4 rounded-full transition-all duration-200"
            style={{
              color: "#6B82A8",
              border: "2px solid rgba(13,43,110,0.18)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--sky)";
              e.currentTarget.style.color = "var(--navy)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(13,43,110,0.18)";
              e.currentTarget.style.color = "#6B82A8";
            }}
          >
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-10">
          {STATS.map((stat, i) => (
            <div key={stat.value} className="flex items-center gap-10">
              <div>
                <strong
                  className="block font-head text-4xl font-extrabold"
                  style={{ color: "var(--navy)" }}
                >
                  {stat.value}
                </strong>
                <span className="text-sm" style={{ color: "#7a90ad" }}>
                  {stat.label}
                </span>
              </div>
              {i < STATS.length - 1 && (
                <div
                  className="w-px h-10"
                  style={{ background: "rgba(13,43,110,0.12)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — Live Demo Card */}
      <div className="relative z-10 flex justify-center items-center pr-8">
        {/* Card halo glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 650,
            height: 650,
            background: "radial-gradient(ellipse, rgba(75,163,227,0.18) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <LiveDemoCard />
      </div>
    </section>
  );
}