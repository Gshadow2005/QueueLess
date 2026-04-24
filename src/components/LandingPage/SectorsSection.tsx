const SECTORS = [
  {
    title: "Banks",
    desc: "Reduce wait times and improve customer satisfaction with remote queue management.",
  },
  {
    title: "Government Offices",
    desc: "Streamline citizen services and eliminate long lines at public facilities.",
  },
  {
    title: "Utility Providers",
    desc: "Help customers manage their time while waiting for bill payments or service requests.",
  },
];

export default function SectorsSection() {
  return (
    <section
      id="sectors"
      className="py-24 px-36"
      style={{ background: "var(--off)" }}
    >
      <div className="w-full">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--sky)" }}>
          Industries
        </p>
        <h2
          className="font-head font-extrabold mb-12"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--navy)" }}
        >
          Built for service-heavy sectors
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTORS.map((sector) => (
            <div
              key={sector.title}
              className="rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 cursor-default"
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
                {sector.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B82A8" }}>
                {sector.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}