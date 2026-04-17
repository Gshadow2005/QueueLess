import { useState, useEffect, useRef } from "react";
import { type Institution } from "../../data/institutions";
import { formatQueueNumber } from "../../utils/queueHelpers";

interface LiveTrackerProps {
  institution: Institution;
  yourNumber: number;
  joinedAt: Date;
  onDone: (waitMinutes: number, cancelled: boolean) => void;
}

export default function LiveTracker({
  institution,
  yourNumber,
  joinedAt,
  onDone,
}: LiveTrackerProps) {
  const [serving, setServing] = useState(institution.serving);
  const [isFlashing, setIsFlashing] = useState(false);
  const [notified, setNotified] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [notifText, setNotifText] = useState({ title: "", body: "" });
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spotsAway = Math.max(0, yourNumber - serving - 1);
  const pct = Math.max(0, Math.min(100, 100 - (spotsAway / 15) * 100));
  const isNext = spotsAway === 0;
  const isTurn = serving >= yourNumber;
  const isAlmost = spotsAway <= 3 && spotsAway > 0;

  useEffect(() => {
    tickerRef.current = setInterval(() => {
      setServing((prev) => {
        const next = prev + 1;
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 400);
        if (next >= yourNumber) {
          if (tickerRef.current) clearInterval(tickerRef.current);
          setTimeout(() => {
            const mins = Math.round((Date.now() - joinedAt.getTime()) / 60000) || 1;
            onDone(mins, false);
          }, 900);
        }
        return next;
      });
    }, 2000);

    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [yourNumber, joinedAt, onDone]);

  useEffect(() => {
    if (isAlmost && !notified) {
      setNotified(true);
      setNotifText({
        title: "Almost your turn!",
        body: `You're ${formatQueueNumber(yourNumber)}, currently serving ${formatQueueNumber(serving)}. Head back now!`,
      });
      setShowBanner(true);
    }
  }, [isAlmost, notified, serving, yourNumber]);

  const handleCancel = () => {
    if (!window.confirm("Cancel your spot in the queue?")) return;
    if (tickerRef.current) clearInterval(tickerRef.current);
    const mins = Math.round((Date.now() - joinedAt.getTime()) / 60000) || 0;
    onDone(mins, true);
  };

  const handleRefresh = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 400);
  };

  const handleShare = () => {
    const txt = `I'm ${formatQueueNumber(yourNumber)} in the queue at ${institution.name}. Track with QueueLess!`;
    if (navigator.share) {
      navigator.share({ text: txt });
    } else {
      navigator.clipboard?.writeText(txt).then(() => alert("Copied to clipboard!"));
    }
  };

  const awayLabel = isTurn
    ? "It's your turn!"
    : isNext
    ? "Next up!"
    : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""} away · ~${Math.ceil(spotsAway * institution.waitPer)} min`;

  const statusBadge = isTurn ? "Your Turn!" : isAlmost ? "Almost!" : "Waiting";

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-5 pt-5 pb-6 flex flex-col gap-4">
        {/* Tracker card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "white",
            border: "1.5px solid rgba(13,43,110,0.12)",
          }}
        >
          {/* Live header */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse-ring"
              style={{ background: "#22c55e" }}
            />
            <span className="text-sm font-semibold" style={{ color: "#6B82A8" }}>
              Live updates
            </span>
            <span className="ml-auto text-xs" style={{ color: "#6B82A8" }}>
              {institution.name.split("–")[1]?.trim() || "Main Branch"}
            </span>
          </div>

          {/* Numbers */}
          <div className="flex justify-around items-center mb-5">
            <div className="text-center">
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: "#6B82A8", fontSize: "0.68rem" }}
              >
                Serving
              </p>
              <p
                className={`font-head font-extrabold transition-all duration-200 ${isFlashing ? "queue-flash" : ""}`}
                style={{ fontSize: "clamp(2.75rem,8vw,3.5rem)", color: "var(--navy)", lineHeight: 1 }}
              >
                {formatQueueNumber(serving)}
              </p>
            </div>
            <div style={{ width: 1, height: 60, background: "rgba(13,43,110,0.12)" }} />
            <div className="text-center">
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: "#6B82A8", fontSize: "0.68rem" }}
              >
                Yours
              </p>
              <p
                className="font-head font-extrabold"
                style={{ fontSize: "clamp(2.75rem,8vw,3.5rem)", color: "var(--sky)", lineHeight: 1 }}
              >
                {formatQueueNumber(yourNumber)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div
            className="h-1.5 rounded-full overflow-hidden mb-2"
            style={{ background: "var(--sky-pale)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, var(--sky), var(--navy-light))",
              }}
            />
          </div>
          <p
            className="text-sm text-center font-medium"
            style={{
              color: isTurn ? "var(--navy)" : isAlmost || isNext ? "#22c55e" : "#6B82A8",
              fontWeight: isTurn || isAlmost || isNext ? 700 : 500,
            }}
          >
            {awayLabel}
          </p>
        </div>

        {/* Notification banner */}
        {showBanner && (
          <div
            className="rounded-2xl p-4 flex gap-3 items-start"
            style={{ background: "var(--navy)" }}
          >
            <span className="text-xl shrink-0 mt-0.5">🔔</span>
            <div>
              <strong className="block text-white text-sm mb-1">{notifText.title}</strong>
              <p className="text-xs leading-relaxed" style={{ color: "var(--sky-light)" }}>
                {notifText.body}
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="ml-auto text-xs shrink-0"
              style={{ color: "var(--sky-light)", opacity: 0.7 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Action row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "↻ Refresh", action: handleRefresh, danger: false },
            { label: "↑ Share", action: handleShare, danger: false },
            { label: "✕ Cancel", action: handleCancel, danger: true },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150"
              style={{
                fontFamily: "var(--font-body)",
                background: "white",
                color: btn.danger ? "#dc2626" : "var(--navy)",
                borderColor: btn.danger ? "rgba(220,38,38,0.2)" : "rgba(13,43,110,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = btn.danger ? "#fff5f5" : "var(--sky-pale)";
                e.currentTarget.style.borderColor = btn.danger ? "#dc2626" : "var(--sky)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = btn.danger
                  ? "rgba(220,38,38,0.2)"
                  : "rgba(13,43,110,0.12)";
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Session info */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "white",
            border: "1.5px solid rgba(13,43,110,0.12)",
          }}
        >
          <h4 className="font-head text-sm font-bold mb-4" style={{ color: "var(--navy)" }}>
            Session info
          </h4>
          {[
            { label: "Institution", value: institution.name.split("–")[0].trim() },
            { label: "Queue #", value: formatQueueNumber(yourNumber) },
            {
              label: "Joined at",
              value: joinedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
            { label: "Threshold", value: "3 spots" },
            { label: "Status", value: statusBadge },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex justify-between items-center py-2"
              style={{
                borderBottom: i < arr.length - 1 ? "1px solid rgba(13,43,110,0.08)" : "none",
              }}
            >
              <span className="text-sm" style={{ color: "#6B82A8" }}>
                {row.label}
              </span>
              <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}