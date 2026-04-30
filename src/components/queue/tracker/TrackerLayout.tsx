import { RefreshCw, Share2, X, ArrowRight } from "lucide-react";
import { type Institution } from "../../../types/institution";
import { formatQueueNumber } from "../../../utils/queueHelpers";
import TrackerCard from "./TrackerCard";

const WAIT_TIPS = [
  "You'll be notified at 5 spots away - start heading back",
  "A second alert fires at 3 spots - return immediately",
  "Have your ID and documents ready",
];

const SESSION_ROWS = (params: {
  institution: Institution;
  yourNumber: number;
  joinedAt: Date;
  pushSubscribed: boolean;
  queueLoading: boolean;
  statusBadge: string;
}) => [
  { label: "Institution", value: params.institution.name.split("–")[0].trim() },
  { label: "Queue #", value: formatQueueNumber(params.yourNumber) },
  {
    label: "Joined at",
    value: params.joinedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
  { label: "Alerts at", value: "5 - 3 spots" },
  { label: "Push", value: params.pushSubscribed ? "Active" : "Disabled" },
  { label: "Status", value: params.queueLoading ? "Loading…" : params.statusBadge },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface ActionButtonsProps {
  isServing: boolean;
  compact: boolean;
  cancelling: boolean;
  refreshing: boolean;
  onShare: () => void;
  onCancel: () => void;
  onRefresh: () => void;
}

function ActionButtons({ isServing, compact, cancelling, refreshing, onShare, onCancel, onRefresh }: ActionButtonsProps) {
  const size = compact ? 15 : 16;
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        marginBottom: compact ? "1rem" : 0,
      }}
    >
      {/* Auto refresh — now functional */}
      <button
        onClick={onRefresh}
        disabled={refreshing}
        style={{
          ...btnBase,
          color: refreshing ? "#94a3b8" : "var(--navy)",
          borderColor: refreshing ? "rgba(148,163,184,0.3)" : "rgba(13,43,110,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: "center",
          cursor: refreshing ? "not-allowed" : "pointer",
          opacity: refreshing ? 0.7 : 1,
        }}
        title={refreshing ? "Refreshing..." : "Refresh queue status"}
        onMouseEnter={(e) => {
          if (!compact && !refreshing) {
            e.currentTarget.style.background = "var(--sky-pale)";
            e.currentTarget.style.borderColor = "var(--sky)";
          }
        }}
        onMouseLeave={(e) => {
          if (!compact && !refreshing) {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "rgba(13,43,110,0.12)";
          }
        }}
      >
        {refreshing ? (
          <>
            <span
              style={{
                width: size === 15 ? 12 : 14,
                height: size === 15 ? 12 : 14,
                border: "2px solid rgba(13,43,110,0.2)",
                borderTopColor: "var(--sky)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Syncing…
          </>
        ) : (
          <><RefreshCw size={size} /> Refresh</>
        )}
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        style={{
          ...btnBase,
          color: "var(--navy)",
          borderColor: "rgba(13,43,110,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          if (!compact) {
            e.currentTarget.style.background = "var(--sky-pale)";
            e.currentTarget.style.borderColor = "var(--sky)";
          }
        }}
        onMouseLeave={(e) => {
          if (!compact) {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "rgba(13,43,110,0.12)";
          }
        }}
      >
        <Share2 size={size} /> Share
      </button>

      {/* Cancel */}
      <button
        onClick={onCancel}
        disabled={isServing || cancelling}
        style={{
          ...btnBase,
          color: isServing || cancelling ? "#94a3b8" : "#dc2626",
          borderColor: isServing || cancelling ? "rgba(148,163,184,0.3)" : "rgba(220,38,38,0.2)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: "center",
          cursor: isServing || cancelling ? "not-allowed" : "pointer",
          opacity: isServing || cancelling ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isServing && !cancelling) {
            e.currentTarget.style.background = "#fff5f5";
            e.currentTarget.style.borderColor = "#dc2626";
          }
        }}
        onMouseLeave={(e) => {
          if (!isServing && !cancelling) {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
          }
        }}
      >
        {cancelling ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(220,38,38,0.2)",
                borderTopColor: "#dc2626",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Cancelling…
          </>
        ) : (
          <><X size={size} /> Cancel</>
        )}
      </button>
    </div>
  );
}

interface SessionInfoProps {
  rows: { label: string; value: string }[];
  compact: boolean;
}

function SessionInfo({ rows, compact }: SessionInfoProps) {
  return (
    <div
      style={{
        background: "white",
        border: "1.5px solid rgba(13,43,110,0.12)",
        borderRadius: 16,
        padding: compact ? "1.25rem" : "1.5rem",
        marginBottom: compact ? "1rem" : 0,
      }}
    >
      <h4
        className="font-head"
        style={{
          fontWeight: 700,
          fontSize: compact ? "0.85rem" : "0.9rem",
          color: "var(--navy)",
          marginBottom: "0.75rem",
        }}
      >
        Session info
      </h4>
      {rows.map((row, i, arr) => (
        <div
          key={row.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: compact ? "9px 0" : "10px 0",
            borderBottom: i < arr.length - 1 ? "1px solid rgba(13,43,110,0.08)" : "none",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: compact ? "0.8rem" : "0.85rem",
              color: "#6B82A8",
              fontWeight: 400,
            }}
          >
            {row.label}
          </span>
          <span
            style={{
              fontSize: compact ? "0.8rem" : "0.85rem",
              fontWeight: 600,
              color: "var(--navy)",
              textAlign: "right",
              maxWidth: compact ? "55%" : "60%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

interface WaitTipsProps {
  compact: boolean;
}

function WaitTips({ compact }: WaitTipsProps) {
  return (
    <div
      style={{
        background: "var(--sky-pale)",
        border: "1.5px solid var(--sky-light)",
        borderRadius: 16,
        padding: compact ? "1.1rem" : "1.25rem",
      }}
    >
      <p
        className="font-head"
        style={{
          fontWeight: 700,
          fontSize: compact ? "0.82rem" : "0.85rem",
          color: "var(--navy)",
          marginBottom: compact ? "0.6rem" : "0.75rem",
        }}
      >
        While you wait
      </p>
      {WAIT_TIPS.map((tip) => (
        <p
          key={tip}
          style={{
            fontSize: compact ? "0.77rem" : "0.8rem",
            color: "var(--navy-light)",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            marginBottom: compact ? 5 : 6,
            lineHeight: 1.5,
          }}
        >
          <ArrowRight
            style={{
              color: "var(--sky)",
              flexShrink: 0,
              width: compact ? 14 : 16,
              height: compact ? 14 : 16,
              marginTop: 2,
            }}
          />
          {tip}
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main TrackerLayout export
// ─────────────────────────────────────────────────────────────────────────────

interface TrackerLayoutProps {
  institution: Institution;
  yourNumber: number;
  joinedAt: Date;
  // TrackerCard props
  currentServing: number;
  pct: number;
  queueLoading: boolean;
  isFlashing: boolean;
  isServing: boolean;
  isNext: boolean;
  isTurn: boolean;
  isAlmost: boolean;
  awayLabel: string;
  statusColor: string;
  statusBadge: string;
  pushSubscribed: boolean;
  cancelling: boolean;
  refreshing: boolean;
  // handlers
  onShare: () => void;
  onCancel: () => void;
  onRefresh: () => void;
}

export default function TrackerLayout({
  institution,
  yourNumber,
  joinedAt,
  currentServing,
  pct,
  queueLoading,
  isFlashing,
  isServing,
  isNext,
  isTurn,
  isAlmost,
  awayLabel,
  statusColor,
  statusBadge,
  pushSubscribed,
  cancelling,
  refreshing,
  onShare,
  onCancel,
  onRefresh,
}: TrackerLayoutProps) {
  const cardProps = {
    institutionName: institution.name,
    currentServing,
    yourNumber,
    pct,
    queueLoading,
    refreshing,
    isFlashing,
    isServing,
    isAlmost,
    isTurn,
    isNext,
    awayLabel,
    statusColor,
    statusBadge,
  };

  const sessionRows = SESSION_ROWS({
    institution,
    yourNumber,
    joinedAt,
    pushSubscribed,
    queueLoading,
    statusBadge,
  });

  return (
    <>
      <style>{`
        .lt-mobile-only { display: none; }
        .lt-desktop-only { display: block; }
        @media (max-width: 639px) {
          .lt-mobile-only { display: block; }
          .lt-desktop-only { display: none; }
        }
      `}</style>

      {/* ── DESKTOP layout ── */}
      <div className="lt-desktop-only">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Left column: card + action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TrackerCard {...cardProps} compact={false} />
            <ActionButtons
              isServing={isServing}
              compact={false}
              cancelling={cancelling}
              refreshing={refreshing}
              onShare={onShare}
              onCancel={onCancel}
              onRefresh={onRefresh}
            />
          </div>

          {/* Right column: session info + tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SessionInfo rows={sessionRows} compact={false} />
            <WaitTips compact={false} />
          </div>
        </div>
      </div>

      {/* ── MOBILE layout ── */}
      <div className="lt-mobile-only">
        <TrackerCard {...cardProps} compact />
        <ActionButtons
          isServing={isServing}
          compact
          cancelling={cancelling}
          refreshing={refreshing}
          onShare={onShare}
          onCancel={onCancel}
          onRefresh={onRefresh}
        />
        <SessionInfo rows={sessionRows} compact />
        <WaitTips compact />
      </div>
    </>
  );
}