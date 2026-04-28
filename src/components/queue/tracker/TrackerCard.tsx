import { formatQueueNumber } from "../../../utils/queueHelpers";
import Skeleton from "../../common/Skeleton";

interface TrackerCardProps {
  institutionName: string;
  currentServing: number;
  yourNumber: number;
  pct: number;
  queueLoading: boolean;
  isFlashing: boolean;
  isServing: boolean;
  isAlmost: boolean;
  isTurn: boolean;
  isNext: boolean;
  awayLabel: string;
  statusColor: string;
  statusBadge: string;
  /** Pass extra padding/margin styles for mobile vs desktop variants */
  compact?: boolean;
}

export default function TrackerCard({
  institutionName,
  currentServing,
  yourNumber,
  pct,
  queueLoading,
  isFlashing,
  isServing,
  isAlmost,
  isTurn,
  isNext,
  awayLabel,
  statusColor,
  statusBadge,
  compact = false,
}: TrackerCardProps) {
  const padding = compact ? "1.25rem" : "1.5rem";
  const numberFontSize = compact
    ? "clamp(2.5rem, 12vw, 3.5rem)"
    : "clamp(2rem, 5vw, 4rem)";

  const badgeBg = !queueLoading && isServing
    ? "rgba(245,158,11,0.1)"
    : !queueLoading && (isAlmost || isTurn)
    ? "rgba(34,197,94,0.1)"
    : "var(--sky-pale)";

  const badgeColor = !queueLoading && isServing
    ? "#b45309"
    : !queueLoading && (isAlmost || isTurn)
    ? "#16a34a"
    : "var(--navy-light)";

  const badgeBorder = !queueLoading && isServing
    ? "rgba(245,158,11,0.3)"
    : !queueLoading && (isAlmost || isTurn)
    ? "rgba(34,197,94,0.3)"
    : "var(--sky-light)";

  return (
    <div
      style={{
        background: "white",
        border: "1.5px solid rgba(13,43,110,0.12)",
        borderRadius: 16,
        padding,
        marginBottom: compact ? "1rem" : 0,
      }}
    >
      {/* Header row */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: compact ? "1.25rem" : "1.5rem" }}
      >
        <span
          className="animate-pulse-ring"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isServing ? "#f59e0b" : "#22c55e",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: compact ? "0.8rem" : "0.875rem",
            fontWeight: 500,
            color: "#6B82A8",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {compact ? institutionName : `Live updates · ${institutionName}`}
        </span>
        <span
          style={{
            marginLeft: compact ? undefined : "auto",
            fontSize: "0.72rem",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 999,
            background: badgeBg,
            color: badgeColor,
            border: `1px solid ${badgeBorder}`,
            flexShrink: 0,
          }}
        >
          {queueLoading ? "Loading…" : statusBadge}
        </span>
      </div>

      {/* Numbers */}
      <div
        style={{
          display: compact ? "flex" : "grid",
          flexDirection: compact ? "column" : undefined,
          gridTemplateColumns: compact ? undefined : "1fr auto 1fr",
          gap: compact ? 0 : 16,
          alignItems: "center",
          marginBottom: compact ? "1.25rem" : "1.5rem",
        }}
      >
        {/* Now serving */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: compact ? "1.25rem" : 0,
            borderBottom: compact ? "1px solid rgba(13,43,110,0.1)" : "none",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6B82A8",
              marginBottom: compact ? 8 : 6,
              fontWeight: 500,
            }}
          >
            Now serving
          </p>
          {queueLoading ? (
            <Skeleton width={compact ? 100 : 80} height={compact ? 56 : 48} borderRadius={8} style={{ margin: "0 auto" }} />
          ) : (
            <p
              className={`font-head ${isFlashing ? "queue-flash" : ""}`}
              style={{
                fontWeight: 800,
                fontSize: numberFontSize,
                color: "var(--navy)",
                lineHeight: 1,
                transition: "color 0.2s, transform 0.2s",
              }}
            >
              {formatQueueNumber(currentServing)}
            </p>
          )}
        </div>

        {/* Divider — desktop only */}
        {!compact && (
          <div style={{ width: 1, height: 60, background: "rgba(13,43,110,0.12)" }} />
        )}

        {/* Your number */}
        <div style={{ textAlign: "center", paddingTop: compact ? "1.25rem" : 0 }}>
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6B82A8",
              marginBottom: compact ? 8 : 6,
              fontWeight: 500,
            }}
          >
            Your number
          </p>
          {queueLoading ? (
            <Skeleton width={compact ? 100 : 80} height={compact ? 56 : 48} borderRadius={8} style={{ margin: "0 auto" }} />
          ) : (
            <p
              className="font-head"
              style={{
                fontWeight: 800,
                fontSize: numberFontSize,
                color: isServing ? "#f59e0b" : "var(--sky)",
                lineHeight: 1,
              }}
            >
              {formatQueueNumber(yourNumber)}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 6,
          borderRadius: 999,
          overflow: "hidden",
          background: "var(--sky-pale)",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 999,
            width: queueLoading ? "0%" : isServing ? "100%" : `${pct}%`,
            background: isServing
              ? "linear-gradient(90deg, #f59e0b, #d97706)"
              : "linear-gradient(90deg, var(--sky), var(--navy-light))",
            transition: "width 0.7s ease",
          }}
        />
      </div>

      {/* Away label */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          fontWeight:
            !queueLoading && (isTurn || isAlmost || isNext || isServing) ? 600 : 400,
          color: queueLoading ? "#6B82A8" : statusColor,
        }}
      >
        {queueLoading ? "Loading status…" : awayLabel}
      </p>
    </div>
  );
}