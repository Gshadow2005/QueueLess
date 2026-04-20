import { type Institution, TYPE_LABELS } from "../../types/institution";
import { formatQueueNumber } from "../../utils/queueHelpers";

interface EnterQueueNumberProps {
  institution: Institution;
  onSubmit: (queueNumber: number) => void;
  onBack?: () => void;
  suggestedNumber?: number;
}

export default function EnterQueueNumber({
  institution,
  onSubmit,
  suggestedNumber,
}: EnterQueueNumberProps) {
  const queueNumber = suggestedNumber ?? 0;
  const spotsAway = Math.max(0, queueNumber - institution.serving - 1);
  const estWait = spotsAway * institution.waitPer;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--sky)", marginBottom: "0.5rem" }}>
          {TYPE_LABELS[institution.type]} · {institution.name.split("–")[0].trim()}
        </p>
        <h1
          className="font-head"
          style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "var(--navy)", marginBottom: "0.4rem", lineHeight: 1.2 }}
        >
          Your queue number
        </h1>
        <p style={{ color: "#6B82A8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Your spot has been reserved. Here's the number assigned to you — check it matches your physical ticket at the counter.
        </p>
      </div>

      {/* ── Current serving context ── */}
      <div style={{ background: "var(--navy)", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--sky-light)", marginBottom: 6, fontWeight: 500 }}>
              Now serving at {institution.name.split("–")[0].trim()}
            </p>
            <p className="font-head" style={{ fontWeight: 800, fontSize: "2.25rem", color: "white", lineHeight: 1 }}>
              {formatQueueNumber(institution.serving)}
            </p>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)", margin: "0 1.25rem", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--sky-light)", marginBottom: 6, fontWeight: 500 }}>
              People in queue
            </p>
            <p className="font-head" style={{ fontWeight: 800, fontSize: "2.25rem", color: "white", lineHeight: 1 }}>
              {institution.inQueue}
            </p>
          </div>
        </div>
      </div>

      {/* ── Assigned number display ── */}
      <div style={{ background: "white", border: "1.5px solid rgba(13,43,110,0.12)", borderRadius: 16, padding: "1.75rem", marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6B82A8", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Your assigned number
        </label>

        <div
          style={{
            width: "100%",
            paddingLeft: 44,
            paddingRight: 18,
            paddingTop: 16,
            paddingBottom: 16,
            borderRadius: 12,
            border: "2px solid var(--sky)",
            background: "var(--sky-pale)",
            color: "var(--navy)",
            fontFamily: "var(--font-head)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 6vw, 3rem)",
            boxSizing: "border-box" as const,
            letterSpacing: "0.05em",
            position: "relative" as const,
            userSelect: "none" as const,
          }}
        >
          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: "1.5rem", color: "#6B82A8", fontFamily: "var(--font-head)", fontWeight: 700, pointerEvents: "none" as const }}>
            #
          </span>
          {String(queueNumber).padStart(2, "0")}
          <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "var(--sky-light)", color: "var(--navy-light)", fontFamily: "var(--font-body)" }}>
            Assigned
          </span>
        </div>

        {queueNumber > 0 && (
          <div style={{ background: "var(--sky-pale)", border: "1px solid var(--sky-light)", borderRadius: 12, padding: "0.875rem 1rem", margin: "1.25rem 0 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <p style={{ fontSize: "0.68rem", color: "#6B82A8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 3 }}>Spots ahead of you</p>
              <p className="font-head" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>
                {spotsAway === 0 ? "You're next!" : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""}`}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.68rem", color: "#6B82A8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 3 }}>Est. wait time</p>
              <p className="font-head" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>
                {estWait === 0 ? "Any moment!" : `~${estWait} min`}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => onSubmit(queueNumber)}
          disabled={queueNumber === 0}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 999,
            border: "none",
            background: queueNumber > 0 ? "var(--navy)" : "#e2e8f0",
            color: queueNumber > 0 ? "white" : "#94a3b8",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: queueNumber > 0 ? "pointer" : "not-allowed",
            transition: "transform 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (queueNumber > 0) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.background = "var(--navy-mid)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = queueNumber > 0 ? "var(--navy)" : "#e2e8f0";
          }}
        >
          Start Tracking →
        </button>
      </div>

      <p style={{ fontSize: "0.78rem", textAlign: "center", color: "#94a3b8", lineHeight: 1.5 }}>
        Your number is automatically assigned by the system. Confirm it matches the slip at the counter.
      </p>
    </div>
  );
}