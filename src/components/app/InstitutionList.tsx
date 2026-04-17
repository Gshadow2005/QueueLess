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
    { label: "Gov't", value: "government" },
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
      <div style={{ marginBottom: "1.75rem" }}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
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
            fontSize: "clamp(1.35rem, 3vw, 1.875rem)",
            fontWeight: 700,
            color: "var(--navy)",
            marginBottom: "0.4rem",
            lineHeight: 1.25,
          }}
        >
          Where do you need to queue?
        </h1>
        <p style={{ color: "#6B82A8", fontSize: "0.875rem", lineHeight: 1.6, fontWeight: 400 }}>
          Pick an institution to check live queue status and get your number.
        </p>
      </div>

      {/* ── Search + filters ── */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", marginBottom: "0.75rem" }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "0.875rem",
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
              fontWeight: 400,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sky)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)")}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 2,
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                fontSize: "0.78rem",
                fontWeight: 500,
                border: "1.5px solid",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.15s",
                background: filter === f.value ? "var(--navy)" : "white",
                color: filter === f.value ? "white" : "#6B82A8",
                borderColor: filter === f.value ? "var(--navy)" : "rgba(13,43,110,0.14)",
                whiteSpace: "nowrap",
                flexShrink: 0,
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
          fontSize: "0.7rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#94a3b8",
          marginBottom: "0.875rem",
        }}
      >
        {filtered.length} location{filtered.length !== 1 ? "s" : ""} available
      </p>

      {/* ── List ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
          margin: "0 auto",
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
                border: "1.5px solid rgba(13,43,110,0.10)",
                borderRadius: 14,
                padding: "1rem 1.125rem",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  const el = e.currentTarget;
                  el.style.borderColor = "var(--sky)";
                  el.style.boxShadow = "0 4px 16px rgba(91,163,224,0.12)";
                  el.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(13,43,110,0.10)";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: iconBg[inst.type],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                {INSTITUTION_ICONS[inst.type]}
              </div>

              {/* Name + address */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="font-head"
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "var(--navy)",
                    marginBottom: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {inst.name}
                </p>
                <p style={{ fontSize: "0.775rem", color: "#6B82A8", fontWeight: 400 }}>
                  {inst.address}
                </p>
              </div>

              {/* Status badge */}
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: s.bg,
                  color: s.text,
                  flexShrink: 0,
                }}
              >
                {s.label}
              </span>

              {/* Stats — hidden on mobile via CSS class */}
              <div
                className="inst-stats"
                style={{
                  display: "flex",
                  borderLeft: "1px solid rgba(13,43,110,0.08)",
                  marginLeft: 4,
                  flexShrink: 0,
                }}
              >
                {[
                  { label: "Serving", value: `#${String(inst.serving).padStart(2, "0")}` },
                  { label: "In queue", value: inst.inQueue.toString() },
                  { label: "Est. wait", value: `~${inst.inQueue * inst.waitPer}m` },
                ].map((stat, i, arr) => (
                  <div
                    key={stat.label}
                    style={{
                      textAlign: "center",
                      padding: "0 12px",
                      borderRight:
                        i < arr.length - 1 ? "1px solid rgba(13,43,110,0.08)" : "none",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#b0bfd4",
                        fontWeight: 500,
                        marginBottom: 3,
                      }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="font-head"
                      style={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "#4a6080",
                      }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#94a3b8",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔍</p>
            <p style={{ fontWeight: 600, color: "var(--navy)", marginBottom: "0.35rem" }}>
              No results found
            </p>
            <p style={{ fontSize: "0.875rem" }}>Try a different search term or filter.</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 540px) {
          .inst-stats { display: none !important; }
        }
      `}</style>
    </div>
  );
}