const SECTORS = [
  "Banks",
  "Hospitals",
  "Government Offices",
  "Utility Providers",
  "Clinics",
  "Retail",
];

export default function SectorsSection() {
  return (
    <section id="sectors" className="py-24 px-8" style={{ background: "var(--off)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--sky)" }}>
          Industries
        </p>
        <h2
          className="font-head font-extrabold mb-10"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--navy)" }}
        >
          Built for service-heavy sectors
        </h2>
        <div className="flex flex-wrap gap-3 mt-10">
          {SECTORS.map((sector) => (
            <div
              key={sector}
              className="px-6 py-2.5 rounded-full text-sm font-semibold cursor-default"
              style={{
                background: "white",
                border: "1.5px solid rgba(13,43,110,0.12)",
                color: "var(--navy)",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--sky-pale)";
                e.currentTarget.style.borderColor = "var(--sky)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "rgba(13,43,110,0.12)";
              }}
            >
              {sector}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}