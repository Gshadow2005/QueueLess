import { formatQueueNumber } from "../../../utils/queueHelpers";

function StatSkeleton() {
  return (
    <div
      style={{
        height: "2.25rem",
        width: 64,
        borderRadius: 6,
        background: "rgba(255,255,255,0.15)",
        animation: "pulse 1.2s ease-in-out infinite",
      }}
    />
  );
}

interface QueueContextCardProps {
  institutionName: string;
  serving: number;
  inQueue: number;
  showSkeleton: boolean;
}

export default function QueueContextCard({
  institutionName,
  serving,
  inQueue,
  showSkeleton,
}: QueueContextCardProps) {
  return (
    <div
      style={{
        background: "var(--navy)",
        borderRadius: 16,
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {/* Label row */}
      <div style={{ display: "flex", gap: 0, marginBottom: 6 }}>
        <p
          style={{
            flex: 1,
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--sky-light)",
            fontWeight: 500,
            margin: 0,
            paddingRight: "1.25rem",
          }}
        >
          Now serving
        </p>
        <div style={{ width: 1, flexShrink: 0, marginRight: "1.25rem" }} />
        <p
          style={{
            flex: 1,
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--sky-light)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          People in queue
        </p>
      </div>

      {/* Value row */}
      <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
        <div style={{ flex: 1, paddingRight: "1.25rem" }}>
          {showSkeleton ? (
            <StatSkeleton />
          ) : (
            <p
              className="font-head"
              style={{ fontWeight: 800, fontSize: "2.25rem", color: "white", lineHeight: 1, margin: 0 }}
            >
              {formatQueueNumber(serving)}
            </p>
          )}
        </div>

        <div
          style={{
            width: 1,
            background: "rgba(255,255,255,0.15)",
            alignSelf: "stretch",
            marginRight: "1.25rem",
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          {showSkeleton ? (
            <StatSkeleton />
          ) : (
            <p
              className="font-head"
              style={{ fontWeight: 800, fontSize: "2.25rem", color: "white", lineHeight: 1, margin: 0 }}
            >
              {inQueue}
            </p>
          )}
        </div>
      </div>

      {/* Institution name */}
      {!showSkeleton && (
        <p
          style={{
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.35)",
            marginTop: 10,
            marginBottom: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {institutionName}
        </p>
      )}
    </div>
  );
}