interface NavbarProps {
  onLaunchApp: () => void;
}

export default function Navbar({ onLaunchApp }: NavbarProps) {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(13,43,110,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "0 1.25rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "1.375rem" }}>⏱</span>
          <span className="font-head" style={{ fontSize: "1.25rem", color: "var(--navy)" }}>
            Queue<strong style={{ fontWeight: 800 }}>Less</strong>
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex gap-6 ml-auto">
          {[
            { label: "How It Works", id: "how" },
            { label: "Features", id: "features" },
            { label: "Who It's For", id: "sectors" },
          ].map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleSmoothScroll(e, id)}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#6B82A8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B82A8")}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onLaunchApp}
          className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-all duration-200 hover:-translate-y-px"
          style={{ background: "var(--navy)", border: "2px solid var(--navy)", fontFamily: "var(--font-body)", cursor: "pointer" }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
