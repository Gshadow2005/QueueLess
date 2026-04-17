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
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search */}
      <div className="px-5 pt-5 pb-3">
        <div className="relative">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "#6B82A8" }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search institutions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full text-sm outline-none"
            style={{
              border: "1.5px solid rgba(13,43,110,0.14)",
              background: "white",
              color: "var(--navy)",
              fontFamily: "var(--font-body)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sky)")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)")
            }
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-2 px-5 pb-4 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-150"
            style={{
              fontFamily: "var(--font-body)",
              background: filter === f.value ? "var(--navy)" : "white",
              color: filter === f.value ? "white" : "#6B82A8",
              borderColor:
                filter === f.value ? "var(--navy)" : "rgba(13,43,110,0.14)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#6B82A8", letterSpacing: "0.08em" }}
        >
          Available now
        </p>
        <div className="flex flex-col gap-3">
          {filtered.map((inst) => {
            const s = statusColors[inst.status];
            const disabled = inst.status === "closed";
            return (
              <div
                key={inst.id}
                onClick={() => !disabled && onSelect(inst)}
                className="flex items-center gap-3 rounded-2xl p-4 transition-all duration-150"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(13,43,110,0.12)",
                  opacity: disabled ? 0.55 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  if (!disabled) {
                    e.currentTarget.style.borderColor = "var(--sky)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(91,163,224,0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(13,43,110,0.12)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: iconBg[inst.type] }}
                >
                  {INSTITUTION_ICONS[inst.type]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-head font-bold text-sm truncate"
                    style={{ color: "var(--navy)" }}
                  >
                    {inst.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B82A8" }}>
                    {inst.address}
                  </p>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "#6B82A8" }}
                  >
                    {inst.inQueue} in queue
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}