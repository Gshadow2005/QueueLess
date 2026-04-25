import { useCallback, useEffect } from "react";
import { Bell, RefreshCw, Share2, X, ArrowRight } from "lucide-react";
import { type Institution } from "../../types/institution";
import { formatQueueNumber } from "../../utils/queueHelpers";
import { useLiveQueue } from "../../hooks/useLiveQueue";
import { useNotifications } from "../../hooks/useNotifications";
import { useToast } from "../../hooks/useToast";
import Skeleton from "../common/Skeleton";
import Toast from "../common/Toast";

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
    loading: queueLoading,
    error,
  } = useLiveQueue({
    sessionId,
    institutionId: institution.id,
    onServed: () => {
      const mins = Math.round((Date.now() - joinedAt.getTime()) / 60000) || 1;
      onDone(mins, false);
    },
  });

  // ── Notifications ──────────────────────────────────────────────────────
  const handleNearTurn = useCallback(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      new Notification("Almost your turn!", {
        body: `Queue ${formatQueueNumber(yourNumber)} — head back now!`,
        icon: "/favicon.svg",
      });
    }
  }, [yourNumber]);

  const handleTurnCalled = useCallback(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      new Notification("It's your turn!", {
        body: `Queue ${formatQueueNumber(yourNumber)} is now being served.`,
        icon: "/favicon.svg",
      });
    }
  }, [yourNumber]);

  const { latestNearTurn, latestTurnCalled } = useNotifications({
    sessionId,
    onNearTurn: handleNearTurn,
    onTurnCalled: handleTurnCalled,
  });

  // ── Derived state ──────────────────────────────────────────────────────
  const spotsAway = peopleAhead;
  const pct = Math.max(0, Math.min(100, 100 - (spotsAway / 15) * 100));

  const isServing = status === "serving";
  const isTurn = status === "served" || spotsAway === 0;
  const isAlmost =
    nearTurnNotified ||
    !!latestNearTurn ||
    (spotsAway <= 3 && spotsAway > 0);
  const isNext = spotsAway === 0 && status !== "served" && status !== "serving";

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

  const awayLabel = isServing
    ? "Head to the counter now!"
    : isTurn
    ? "It's your turn!"
    : isNext
    ? "Next up!"
    : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""} away`;

  const statusColor = isServing
    ? "#f59e0b"
    : isTurn
    ? "#22c55e"
    : isAlmost || isNext
    ? "#22c55e"
    : "#6B82A8";

  const statusBadge = isServing
    ? "At Counter"
    : isTurn
    ? "Your Turn!"
    : isAlmost
    ? "Almost!"
    : "Waiting";

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

  // ── Notification banner logic ──────────────────────────────────────────
  const showTurnCalled = !!(latestTurnCalled || status === "served" || status === "serving");
  const showNearTurn =
    !!(nearTurnNotified || latestNearTurn || (spotsAway <= 3 && spotsAway > 0)) &&
    !showTurnCalled;

  const notifTitle = isServing
    ? "Head to the counter!"
    : showTurnCalled
    ? "It's your turn!"
    : "Almost your turn!";

  const notifMessage = isServing
    ? `Queue ${formatQueueNumber(yourNumber)} — please go to the counter now!`
    : showTurnCalled
    ? latestTurnCalled?.message ??
      `Queue ${formatQueueNumber(yourNumber)} is now being served. Head to the counter now!`
    : latestNearTurn
    ? latestNearTurn.message
    : `You're ${formatQueueNumber(yourNumber)}, currently serving ${formatQueueNumber(currentServing)}. Head back now!`;

  const notifStyle: React.CSSProperties = showTurnCalled || isServing
    ? { background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 16, padding: "1rem 1.25rem", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: "1.5rem" }
    : { background: "var(--navy)", borderRadius: 16, padding: "1rem 1.25rem", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: "1.5rem" };

  const notifIconColor = showTurnCalled || isServing ? "#16a34a" : "white";
  const notifTitleColor = showTurnCalled || isServing ? "#15803d" : "white";
  const notifBodyColor = showTurnCalled || isServing ? "#166534" : "var(--sky-light)";

  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(`Could not update queue status: ${error}`);
    }
  }, [error, showToast]);

  // ── Mobile tracker card (matches screenshot style) ─────────────────────
  const MobileTrackerCard = () => (
    <div style={{ background: "white", border: "1.5px solid rgba(13,43,110,0.12)", borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
      {/* Header: live dot + institution name + status badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
        <span
          className="animate-pulse-ring"
          style={{ width: 8, height: 8, borderRadius: "50%", background: isServing ? "#f59e0b" : "#22c55e", flexShrink: 0 }}
        />
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#6B82A8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {institution.name}
        </span>
        <span style={{
          fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px", borderRadius: 999,
          background: !queueLoading && isServing ? "rgba(245,158,11,0.1)" : !queueLoading && (isAlmost || isTurn) ? "rgba(34,197,94,0.1)" : "var(--sky-pale)",
          color: !queueLoading && isServing ? "#b45309" : !queueLoading && (isAlmost || isTurn) ? "#16a34a" : "var(--navy-light)",
          border: `1px solid ${!queueLoading && isServing ? "rgba(245,158,11,0.3)" : !queueLoading && (isAlmost || isTurn) ? "rgba(34,197,94,0.3)" : "var(--sky-light)"}`,
          flexShrink: 0,
        }}>
          {queueLoading ? "Loading…" : statusBadge}
        </span>
      </div>

      {/* Now Serving / Your Number — stacked vertically like the screenshot */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "1.25rem" }}>
        {/* Now Serving */}
        <div style={{ textAlign: "center", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(13,43,110,0.1)" }}>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B82A8", marginBottom: 8, fontWeight: 500 }}>
            Now serving
          </p>
          {queueLoading ? (
            <Skeleton width={100} height={56} borderRadius={8} style={{ margin: "0 auto" }} />
          ) : (
            <p
              className={`font-head ${isFlashing ? "queue-flash" : ""}`}
              style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 12vw, 3.5rem)", color: "var(--navy)", lineHeight: 1, transition: "color 0.2s, transform 0.2s" }}
            >
              {formatQueueNumber(currentServing)}
            </p>
          )}
        </div>

        {/* Your Number */}
        <div style={{ textAlign: "center", paddingTop: "1.25rem" }}>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B82A8", marginBottom: 8, fontWeight: 500 }}>
            Your number
          </p>
          {queueLoading ? (
            <Skeleton width={100} height={56} borderRadius={8} style={{ margin: "0 auto" }} />
          ) : (
            <p
              className="font-head"
              style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 12vw, 3.5rem)", color: isServing ? "#f59e0b" : "var(--sky)", lineHeight: 1 }}
            >
              {formatQueueNumber(yourNumber)}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 999, overflow: "hidden", background: "var(--sky-pale)", marginBottom: 8 }}>
        <div style={{
          height: "100%", borderRadius: 999,
          width: queueLoading ? "0%" : isServing ? "100%" : `${pct}%`,
          background: isServing
            ? "linear-gradient(90deg, #f59e0b, #d97706)"
            : "linear-gradient(90deg, var(--sky), var(--navy-light))",
          transition: "width 0.7s ease",
        }} />
      </div>
      <p style={{ textAlign: "center", fontSize: "0.9rem", fontWeight: !queueLoading && (isTurn || isAlmost || isNext || isServing) ? 600 : 400, color: queueLoading ? "#6B82A8" : statusColor }}>
        {queueLoading ? "Loading status…" : awayLabel}
      </p>
    </div>
  );

  // ── Desktop tracker card (original layout) ─────────────────────────────
  const DesktopTrackerCard = () => (
    <div style={{ background: "white", border: "1.5px solid rgba(13,43,110,0.12)", borderRadius: 16, padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
        <span className="animate-pulse-ring" style={{ width: 8, height: 8, borderRadius: "50%", background: isServing ? "#f59e0b" : "#22c55e", flexShrink: 0 }} />
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#6B82A8" }}>
          Live updates · {institution.name}
        </span>
        <span style={{
          marginLeft: "auto", fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px", borderRadius: 999,
          background: !queueLoading && isServing ? "rgba(245,158,11,0.1)" : !queueLoading && (isAlmost || isTurn) ? "rgba(34,197,94,0.1)" : "var(--sky-pale)",
          color: !queueLoading && isServing ? "#b45309" : !queueLoading && (isAlmost || isTurn) ? "#16a34a" : "var(--navy-light)",
          border: `1px solid ${!queueLoading && isServing ? "rgba(245,158,11,0.3)" : !queueLoading && (isAlmost || isTurn) ? "rgba(34,197,94,0.3)" : "var(--sky-light)"}`,
        }}>
          {queueLoading ? "Loading…" : statusBadge}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B82A8", marginBottom: 6, fontWeight: 500 }}>Now serving</p>
          {queueLoading ? (
            <Skeleton width={80} height={48} borderRadius={8} style={{ margin: "0 auto" }} />
          ) : (
            <p
              className={`font-head ${isFlashing ? "queue-flash" : ""}`}
              style={{ fontWeight: 800, fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--navy)", lineHeight: 1, transition: "color 0.2s, transform 0.2s" }}
            >
              {formatQueueNumber(currentServing)}
            </p>
          )}
        </div>
        <div style={{ width: 1, height: 60, background: "rgba(13,43,110,0.12)" }} />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B82A8", marginBottom: 6, fontWeight: 500 }}>Your number</p>
          {queueLoading ? (
            <Skeleton width={80} height={48} borderRadius={8} style={{ margin: "0 auto" }} />
          ) : (
            <p className="font-head" style={{ fontWeight: 800, fontSize: "clamp(2rem, 5vw, 4rem)", color: isServing ? "#f59e0b" : "var(--sky)", lineHeight: 1 }}>
              {formatQueueNumber(yourNumber)}
            </p>
          )}
        </div>
      </div>

      <div style={{ height: 6, borderRadius: 999, overflow: "hidden", background: "var(--sky-pale)", marginBottom: 8 }}>
        <div style={{ height: "100%", borderRadius: 999, width: queueLoading ? "0%" : isServing ? "100%" : `${pct}%`, background: isServing ? "linear-gradient(90deg, #f59e0b, #d97706)" : "linear-gradient(90deg, var(--sky), var(--navy-light))", transition: "width 0.7s ease" }} />
      </div>
      <p style={{ textAlign: "center", fontSize: "0.9rem", fontWeight: !queueLoading && (isTurn || isAlmost || isNext || isServing) ? 600 : 400, color: queueLoading ? "#6B82A8" : statusColor }}>
        {queueLoading ? "Loading status…" : awayLabel}
      </p>
    </div>
  );

  return (
    <>
      {/* Responsive styles injected once */}
      <style>{`
        .lt-mobile-only { display: none; }
        .lt-desktop-only { display: block; }
        @media (max-width: 639px) {
          .lt-mobile-only { display: block; }
          .lt-desktop-only { display: none; }
        }
      `}</style>

      <div>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} variant={t.variant} onClose={() => removeToast(t.id)} />
        ))}

        {!queueLoading && (showTurnCalled || showNearTurn || isServing) && (
          <div style={notifStyle}>
            <Bell style={{ flexShrink: 0, width: 24, height: 24, color: notifIconColor }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", color: notifTitleColor, fontSize: "0.9rem", marginBottom: 2 }}>{notifTitle}</strong>
              <p style={{ fontSize: "0.8rem", color: notifBodyColor, lineHeight: 1.5 }}>{notifMessage}</p>
            </div>
          </div>
        )}

        {/* ── DESKTOP layout (original) ── */}
        <div className="lt-desktop-only">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
            {/* Left: Main tracker card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <DesktopTrackerCard />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <button
                  style={{ ...btnBase, color: "var(--navy)", borderColor: "rgba(13,43,110,0.12)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
                  disabled
                  title="Auto-updating every 10s"
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
                  { label: "Status", value: queueLoading ? "Loading…" : statusBadge },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(13,43,110,0.08)" : "none", gap: 8 }}>
                    <span style={{ fontSize: "0.85rem", color: "#6B82A8", fontWeight: 400 }}>{row.label}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

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

        {/* ── MOBILE layout (screenshot-style) ── */}
        <div className="lt-mobile-only">
          <MobileTrackerCard />

          {/* Action buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1rem" }}>
            <button
              style={{ ...btnBase, color: "var(--navy)", borderColor: "rgba(13,43,110,0.12)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
              disabled
              title="Auto-updating every 10s"
            >
              <RefreshCw size={15} /> Auto
            </button>
            <button
              onClick={handleShare}
              style={{ ...btnBase, color: "var(--navy)", borderColor: "rgba(13,43,110,0.12)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
            >
              <Share2 size={15} /> Share
            </button>
            <button
              onClick={handleCancel}
              style={{ ...btnBase, color: "#dc2626", borderColor: "rgba(220,38,38,0.2)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
            >
              <X size={15} /> Cancel
            </button>
          </div>

          {/* Session info — compact on mobile */}
          <div style={{ background: "white", border: "1.5px solid rgba(13,43,110,0.12)", borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
            <h4 className="font-head" style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--navy)", marginBottom: "0.75rem" }}>Session info</h4>
            {[
              { label: "Institution", value: institution.name.split("–")[0].trim() },
              { label: "Queue #", value: formatQueueNumber(yourNumber) },
              { label: "Joined at", value: joinedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
              { label: "Notify threshold", value: "3 spots" },
              { label: "Status", value: queueLoading ? "Loading…" : statusBadge },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(13,43,110,0.08)" : "none", gap: 8 }}>
                <span style={{ fontSize: "0.8rem", color: "#6B82A8", fontWeight: 400 }}>{row.label}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", textAlign: "right", maxWidth: "55%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div style={{ background: "var(--sky-pale)", border: "1.5px solid var(--sky-light)", borderRadius: 16, padding: "1.1rem" }}>
            <p className="font-head" style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--navy)", marginBottom: "0.6rem" }}>While you wait</p>
            {[
              "Queue updates automatically every 10 seconds",
              "Return when you get the near-turn notification",
              "Have your ID and documents ready",
            ].map((tip) => (
              <p key={tip} style={{ fontSize: "0.77rem", color: "var(--navy-light)", display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5, lineHeight: 1.5 }}>
                <ArrowRight style={{ color: "var(--sky)", flexShrink: 0, width: 14, height: 14, marginTop: 2 }} />
                {tip}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}