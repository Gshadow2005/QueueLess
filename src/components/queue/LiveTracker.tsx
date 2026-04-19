import { useCallback } from "react";
import { Bell, RefreshCw, Share2, X, ArrowRight } from "lucide-react";
import { type Institution } from "../../data/institutions";
import { formatQueueNumber } from "../../utils/queueHelpers";
import { useLiveQueue } from "../../hooks/useLiveQueue";

interface LiveTrackerProps {
  institution: Institution;
  sessionId: string;
  yourNumber: number;
  joinedAt: Date;
  onDone: (waitMinutes: number, cancelled: boolean) => void;
}

export default function LiveTracker({
  institution,
  sessionId,
  yourNumber,
  joinedAt,
  onDone,
}: LiveTrackerProps) {
  const {
    currentServing,
    peopleAhead,
    status,
    nearTurnNotified,
    isFlashing,
    error,
  } = useLiveQueue({
    sessionId,
    institutionId: institution.id,
    onServed: () => {
      const mins = Math.round((Date.now() - joinedAt.getTime()) / 60000) || 1;
      onDone(mins, false);
    },
  });

  const spotsAway = peopleAhead;
  const pct = Math.max(0, Math.min(100, 100 - (spotsAway / 15) * 100));
  const isTurn = status === "served" || spotsAway === 0;
  const isAlmost = nearTurnNotified || (spotsAway <= 3 && spotsAway > 0);
  const isNext = spotsAway === 0 && status !== "served";

  const handleCancel = useCallback(() => {
    if (!window.confirm("Cancel your spot in the queue?")) return;
    const mins = Math.round((Date.now() - joinedAt.getTime()) / 60000) || 0;
    onDone(mins, true);
  }, [joinedAt, onDone]);

  const handleShare = useCallback(() => {
    const txt = `I'm ${formatQueueNumber(yourNumber)} in the queue at ${institution.name}. Track with QueueLess!`;
    if (navigator.share) {
      navigator.share({ text: txt });
    } else {
      navigator.clipboard?.writeText(txt).then(() => alert("Copied to clipboard!"));
    }
  }, [yourNumber, institution.name]);

  const awayLabel = isTurn
    ? "It's your turn!"
    : isNext
    ? "Next up!"
    : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""} away`;

  const statusColor = isTurn ? "#22c55e" : isAlmost || isNext ? "#22c55e" : "#6B82A8";
  const statusBadge = isTurn ? "Your Turn!" : isAlmost ? "Almost!" : "Waiting";

  const btnBase: React.CSSProperties = {
    padding: "10px",
    borderRadius: 12,
    fontSize: "0.85rem",
    fontWeight: 500,
    border: "1.5px solid",
    fontFamily: "var(--font-body)",
    cursor: "pointer",
    background: "white",
    transition: "all 0.15s",
  };

  return (
    <div>
      {/* ── Error banner ── */}
      {error && (
        <div style={{ background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: 12, padding: "0.875rem 1.25rem", marginBottom: "1.25rem", fontSize: "0.85rem", color: "#dc2626" }}>
          ⚠ Could not update queue status: {error}
        </div>
      )}

      {/* ── Near-turn notification banner ── */}
      {nearTurnNotified && !isTurn && (
        <div style={{ background: "var(--navy)", borderRadius: 16, padding: "1rem 1.25rem", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <Bell style={{ fontSize: "1.2rem", flexShrink: 0, width: 24, height: 24, color: "white" }} />
          <div style={{ flex: 1 }}>
            <strong style={{ display: "block", color: "white", fontSize: "0.9rem", marginBottom: 2 }}>Almost your turn!</strong>
            <p style={{ fontSize: "0.8rem", color: "var(--sky-light)", lineHeight: 1.5 }}>
              You're {formatQueueNumber(yourNumber)}, currently serving {formatQueueNumber(currentServing)}. Head back now!
            </p>
          </div>
        </div>
      )}

      {/* ── Two-column desktop layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>

        {/* Left: Main tracker card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "white", border: "1.5px solid rgba(13,43,110,0.12)", borderRadius: 16, padding: "1.5rem" }}>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
              <span className="animate-pulse-ring" style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#6B82A8" }}>
                Live updates · {institution.name}
              </span>
              <span style={{ marginLeft: "auto", fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: isAlmost || isTurn ? "rgba(34,197,94,0.1)" : "var(--sky-pale)", color: isAlmost || isTurn ? "#16a34a" : "var(--navy-light)", border: `1px solid ${isAlmost || isTurn ? "rgba(34,197,94,0.3)" : "var(--sky-light)"}` }}>
                {statusBadge}
              </span>
            </div>

            {/* Big numbers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B82A8", marginBottom: 6, fontWeight: 500 }}>Now serving</p>
                <p
                  className={`font-head ${isFlashing ? "queue-flash" : ""}`}
                  style={{ fontWeight: 800, fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--navy)", lineHeight: 1, transition: "color 0.2s, transform 0.2s" }}
                >
                  {formatQueueNumber(currentServing)}
                </p>
              </div>
              <div style={{ width: 1, height: 60, background: "rgba(13,43,110,0.12)" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B82A8", marginBottom: 6, fontWeight: 500 }}>Your number</p>
                <p className="font-head" style={{ fontWeight: 800, fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--sky)", lineHeight: 1 }}>
                  {formatQueueNumber(yourNumber)}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 999, overflow: "hidden", background: "var(--sky-pale)", marginBottom: 8 }}>
              <div style={{ height: "100%", borderRadius: 999, width: `${pct}%`, background: "linear-gradient(90deg, var(--sky), var(--navy-light))", transition: "width 0.7s ease" }} />
            </div>
            <p style={{ textAlign: "center", fontSize: "0.9rem", fontWeight: isTurn || isAlmost || isNext ? 600 : 400, color: statusColor }}>
              {awayLabel}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <button
              style={{ ...btnBase, color: "var(--navy)", borderColor: "rgba(13,43,110,0.12)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
              disabled
              title="Auto-updating every 5s"
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sky-pale)"; e.currentTarget.style.borderColor = "var(--sky)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "rgba(13,43,110,0.12)"; }}
            >
              <RefreshCw size={16} /> Auto
            </button>
            <button
              onClick={handleShare}
              style={{ ...btnBase, color: "var(--navy)", borderColor: "rgba(13,43,110,0.12)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sky-pale)"; e.currentTarget.style.borderColor = "var(--sky)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "rgba(13,43,110,0.12)"; }}
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={handleCancel}
              style={{ ...btnBase, color: "#dc2626", borderColor: "rgba(220,38,38,0.2)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.borderColor = "#dc2626"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)"; }}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>

        {/* Right: Session info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "white", border: "1.5px solid rgba(13,43,110,0.12)", borderRadius: 16, padding: "1.5rem" }}>
            <h4 className="font-head" style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)", marginBottom: "1rem" }}>Session info</h4>
            {[
              { label: "Institution", value: institution.name.split("–")[0].trim() },
              { label: "Queue #", value: formatQueueNumber(yourNumber) },
              { label: "Joined at", value: joinedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
              { label: "Notify threshold", value: "3 spots" },
              { label: "Status", value: statusBadge },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(13,43,110,0.08)" : "none", gap: 8 }}>
                <span style={{ fontSize: "0.85rem", color: "#6B82A8", fontWeight: 400 }}>{row.label}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div style={{ background: "var(--sky-pale)", border: "1.5px solid var(--sky-light)", borderRadius: 16, padding: "1.25rem" }}>
            <p className="font-head" style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--navy)", marginBottom: "0.75rem" }}>While you wait</p>
            {[
              "Queue updates automatically every 10 seconds",
              "Return when you get the near-turn notification",
              "Have your ID and documents ready",
            ].map((tip) => (
              <p key={tip} style={{ fontSize: "0.8rem", color: "var(--navy-light)", display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, lineHeight: 1.5 }}>
                <ArrowRight style={{ color: "var(--sky)", flexShrink: 0, width: 16, height: 16, marginTop: 2 }} />
                {tip}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}