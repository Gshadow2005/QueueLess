import { Bell } from "lucide-react";
import { type Institution } from "../../types/institution";
import { useTrackerState } from "../../hooks/useTrackerState";
import TrackerLayout from "./tracker/TrackerLayout";
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
    // queue state
    currentServing,
    spotsAway,
    pct,
    queueLoading,
    isFlashing,
    // derived booleans
    isServing,
    isNext,
    isTurn,
    isAlmost,
    showTurnCalled,
    showNearTurn,
    // notification alert
    notifTitle,
    notifMessage,
    // push
    pushSubscribed,
    pushLoading,
    showPushBanner,
    pushUnsupported,
    // labels
    awayLabel,
    statusColor,
    statusBadge,
    // handlers
    handleCancel,
    handleShare,
    handleEnablePush,
    // toasts
    toasts,
    removeToast,
  } = useTrackerState({ institution, sessionId, yourNumber, joinedAt, onDone });

  // ── Notification alert banner styles ─────────────────────────────────────
  const notifStyle: React.CSSProperties =
    showTurnCalled || isServing
      ? {
          background: "#f0fdf4",
          border: "1.5px solid #86efac",
          borderRadius: 16,
          padding: "1rem 1.25rem",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }
      : spotsAway <= 3
      ? {
          background: "#fff7ed",
          border: "1.5px solid #fed7aa",
          borderRadius: 16,
          padding: "1rem 1.25rem",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }
      : {
          background: "var(--navy)",
          borderRadius: 16,
          padding: "1rem 1.25rem",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        };

  const notifIconColor =
    showTurnCalled || isServing ? "#16a34a" : spotsAway <= 3 ? "#c2410c" : "white";
  const notifTitleColor =
    showTurnCalled || isServing ? "#15803d" : spotsAway <= 3 ? "#c2410c" : "white";
  const notifBodyColor =
    showTurnCalled || isServing
      ? "#166534"
      : spotsAway <= 3
      ? "#7c2d12"
      : "var(--sky-light)";

  return (
    <div>
      {/* ── Toast stack ── */}
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          variant={t.variant}
          onClose={() => removeToast(t.id)}
        />
      ))}

      {/* ── Push permission banner ── */}
      {showPushBanner && (
        <div
          style={{
            background: "var(--sky-pale)",
            border: "1.5px solid var(--sky-light)",
            borderRadius: 12,
            padding: "0.875rem 1.125rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Bell size={18} style={{ color: "var(--sky)", flexShrink: 0 }} />
          <p
            style={{
              fontSize: "0.84rem",
              color: "var(--navy-light)",
              fontWeight: 500,
              lineHeight: 1.5,
              margin: 0,
              flex: 1,
            }}
          >
            {pushUnsupported
              ? "To enable push notifications, please open this page in a supported browser."
              : "Enable notifications to get alerted when your turn is near."}
          </p>
          {!pushUnsupported && (
            <button
              onClick={handleEnablePush}
              disabled={pushLoading}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1.5px solid var(--sky)",
                background: pushLoading ? "var(--sky-pale)" : "white",
                color: "var(--navy-light)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: pushLoading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                opacity: pushLoading ? 0.7 : 1,
                transition: "all 0.15s",
              }}
            >
              {pushLoading && (
                <span
                  style={{
                    width: 12,
                    height: 12,
                    border: "2px solid rgba(13,43,110,0.2)",
                    borderTopColor: "var(--sky)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              )}
              {pushLoading ? "Enabling…" : "Allow"}
            </button>
          )}
        </div>
      )}

      {/* ── Near-turn / turn-called alert ── */}
      {!queueLoading && (showTurnCalled || showNearTurn || isServing) && (
        <div style={notifStyle}>
          <Bell
            style={{ flexShrink: 0, width: 24, height: 24, color: notifIconColor }}
          />
          <div style={{ flex: 1 }}>
            <strong
              style={{
                display: "block",
                color: notifTitleColor,
                fontSize: "0.9rem",
                marginBottom: 2,
              }}
            >
              {notifTitle}
            </strong>
            <p
              style={{ fontSize: "0.8rem", color: notifBodyColor, lineHeight: 1.5 }}
            >
              {notifMessage}
            </p>
          </div>
        </div>
      )}

      {/* ── Main layout (mobile + desktop) ── */}
      <TrackerLayout
        institution={institution}
        yourNumber={yourNumber}
        joinedAt={joinedAt}
        currentServing={currentServing}
        pct={pct}
        queueLoading={queueLoading}
        isFlashing={isFlashing}
        isServing={isServing}
        isNext={isNext}
        isTurn={isTurn}
        isAlmost={isAlmost}
        awayLabel={awayLabel}
        statusColor={statusColor}
        statusBadge={statusBadge}
        pushSubscribed={pushSubscribed}
        onShare={handleShare}
        onCancel={handleCancel}
      />
    </div>
  );
}