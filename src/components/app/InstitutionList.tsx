import { useState } from "react";
import {
  INSTITUTIONS,
  INSTITUTION_ICONS,
  type Institution,
  type InstitutionType,
} from "../../data/institutions";

type FilterType = "all" | InstitutionType;

interface InstitutionListProps {
  onSelect: (inst: Institution) => void;
}

export default function InstitutionList({ onSelect }: InstitutionListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = INSTITUTIONS.filter((i) => {
    const matchFilter = filter === "all" || i.type === filter;
    const matchSearch =
      !query ||
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.address.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Banks", value: "bank" },
    { label: "Government", value: "government" },
    { label: "Utilities", value: "utility" },
  ];

  const statusColors = {
    open: { bg: "rgba(34,197,94,0.1)", text: "#16a34a", label: "Open" },
    busy: { bg: "#fff7ed", text: "#c2410c", label: "Busy" },
    closed: { bg: "#f1f5f9", text: "#94a3b8", label: "Closed" },
  };

  const iconBg: Record<string, string> = {
    bank: "var(--sky-pale)",
    government: "#EDF3FF",
    utility: "#F0FBF4",
  };

  return (
    <div>
      {/* ── Page header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--sky)",
            marginBottom: "0.5rem",
          }}
        >
          Select location
        </p>
        <h1
          className="font-head"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "0.5rem",
          }}
        >
          Where do you need to queue?
        </h1>
        <p style={{ color: "#6B82A8", fontSize: "0.95rem" }}>
          Pick an institution to check live queue status and get your number.
        </p>
      </div>

      {/* ── Search + filters row ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 260px", minWidth: 220 }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "0.9rem",
              color: "#6B82A8",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search institutions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 38,
              paddingRight: 16,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 999,
              border: "1.5px solid rgba(13,43,110,0.14)",
              background: "white",
              color: "var(--navy)",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sky)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)")}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: "0.8rem",
                fontWeight: 600,
                border: "1.5px solid",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.15s",
                background: filter === f.value ? "var(--navy)" : "white",
                color: filter === f.value ? "white" : "#6B82A8",
                borderColor: filter === f.value ? "var(--navy)" : "rgba(13,43,110,0.14)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results label ── */}
      <p
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#6B82A8",
          marginBottom: "1rem",
        }}
      >
        {filtered.length} location{filtered.length !== 1 ? "s" : ""} available
      </p>

      {/* ── Grid of cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        {filtered.map((inst) => {
          const s = statusColors[inst.status];
          const disabled = inst.status === "closed";
          return (
            <div
              key={inst.id}
              onClick={() => !disabled && onSelect(inst)}
              style={{
                background: "white",
                border: "1.5px solid rgba(13,43,110,0.12)",
                borderRadius: 16,
                padding: "1.25rem",
                opacity: disabled ? 0.55 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  const el = e.currentTarget;
                  el.style.borderColor = "var(--sky)";
                  el.style.boxShadow = "0 4px 20px rgba(91,163,224,0.15)";
                  el.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(13,43,110,0.12)";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Card top row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: iconBg[inst.type],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {INSTITUTION_ICONS[inst.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="font-head"
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "var(--navy)",
                      marginBottom: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {inst.name}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#6B82A8" }}>{inst.address}</p>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: s.bg,
                    color: s.text,
                    flexShrink: 0,
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
                  borderTop: "1px solid rgba(13,43,110,0.08)",
                  paddingTop: 12,
                  gap: 0,
                  alignItems: "center",
                }}
              >
                {[
                  { label: "Serving", value: `#${String(inst.serving).padStart(2, "0")}` },
                  null,
                  { label: "In queue", value: inst.inQueue.toString() },
                  null,
                  { label: "Est. wait", value: `~${inst.inQueue * inst.waitPer}m` },
                ].map((item, i) =>
                  item === null ? (
                    <div key={i} style={{ height: 28, background: "rgba(13,43,110,0.08)" }} />
                  ) : (
                    <div key={item.label} style={{ textAlign: "center" }}>
                      <p
                        className="font-head"
                        style={{ fontWeight: 700, fontSize: "1rem", color: "var(--navy)" }}
                      >
                        {item.value}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#6B82A8", marginTop: 1 }}>
                        {item.label}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}