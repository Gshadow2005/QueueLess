import { Bell } from "lucide-react";
import { type Institution } from "../../types/institution";
import { useTrackerState } from "../../hooks/useTrackerState";
import TrackerLayout from "./tracker/TrackerLayout";
import Toast from "../common/Toast";
import ConfirmModal from "../common/ConfirmModal";

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
    // notification
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
    bannerAccent,
    // cancelling
    cancelling,
    showCancelModal,
    // handlers
    handleCancelClick,
    handleCancelConfirm,
    handleCancelClose,
    handleShare,
    handleEnablePush,
    // toasts
    toasts,
    removeToast,
  } = useTrackerState({ institution, sessionId, yourNumber, joinedAt, onDone });

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
            background: "white",
            border: "1.5px solid rgba(13,43,110,0.12)",
            borderRadius: 16,
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
        <div
          style={{
            background: "white",
            border: "1.5px solid rgba(13,43,110,0.12)",
            borderRadius: 16,
            padding: "1rem 1.25rem",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            marginBottom: "1.5rem",
            transition: "border-color 0.4s ease",
          }}
        >
          <Bell
            style={{
              flexShrink: 0,
              width: 20,
              height: 20,
              color: bannerAccent,
              marginTop: 1,
              transition: "color 0.4s ease",
            }}
          />
          <div style={{ flex: 1 }}>
            <strong
              style={{
                display: "block",
                color: "var(--navy)",
                fontSize: "0.9rem",
                marginBottom: 2,
              }}
            >
              {notifTitle}
            </strong>
            <p
              style={{ fontSize: "0.8rem", color: "#6B82A8", lineHeight: 1.5, margin: 0 }}
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
        cancelling={cancelling}
        onShare={handleShare}
        onCancel={handleCancelClick}
      />

      {/* ── Cancel confirmation modal ── */}
      <ConfirmModal
        open={showCancelModal}
        title="Cancel Queue"
        message="Are you sure you want to leave the queue? Your spot will be lost."
        confirmLabel="Leave Queue"
        cancelLabel="Stay"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelClose}
        danger={true}
      />
    </div>
  );
}
