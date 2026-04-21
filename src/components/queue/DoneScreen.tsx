import { useState } from "react";
import { Check, X, Star } from "lucide-react";
import { type Institution } from "../../types/institution";
import { formatQueueNumber } from "../../utils/queueHelpers";

interface DoneScreenProps {
  institution: Institution;
  yourNumber: number;
  waitMinutes: number;
  cancelled: boolean;
  onGoHome: () => void;
  onReset: () => void;
}

export default function DoneScreen({
  institution,
  yourNumber,
  waitMinutes,
  cancelled,
  onGoHome,
  onReset,
}: DoneScreenProps) {
  const [rating, setRating] = useState(0);

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 1.25rem",
            background: cancelled ? "#fff7ed" : "rgba(34,197,94,0.1)",
            border: `3px solid ${cancelled ? "#f97316" : "#22c55e"}`,
          }}
        >
          {cancelled ? (
            <X size={32} strokeWidth={3} color="#f97316" />
          ) : (
            <Check size={32} strokeWidth={3} color="#22c55e" />
          )}
        </div>
        <h1
          className="font-head"
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "var(--navy)",
            marginBottom: "0.5rem",
          }}
        >
          {cancelled ? "Queue cancelled" : "You've been served!"}
        </h1>
        <p
          style={{
            color: "#6B82A8",
            fontSize: "0.95rem",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          {cancelled
            ? "You've left the queue. No worries — you can join again anytime."
            : `Queue ${formatQueueNumber(yourNumber)} at ${institution.name} — all done!`}
        </p>
      </div>

      {/* ── Two-column on desktop ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Left: Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              background: "white",
              border: "1.5px solid rgba(13,43,110,0.12)",
              borderRadius: 16,
              padding: "1.5rem",
            }}
          >
            <h3
              className="font-head"
              style={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--navy)",
                marginBottom: "1rem",
              }}
            >
              Session summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  label: "Institution",
                  value: institution.name.split("–")[0].trim(),
                },
                { label: "Your number", value: formatQueueNumber(yourNumber) },
                { label: "Wait time", value: `${waitMinutes} min` },
                {
                  label: "Status",
                  value: cancelled ? "Cancelled" : "Served",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--off)",
                    borderRadius: 12,
                    padding: "0.875rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#6B82A8",
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="font-head"
                    style={{
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "var(--navy)",
                      textAlign: "right",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "60%",
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Primary: Go Home */}
            <button
              onClick={onGoHome}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 999,
                border: "none",
                background: "var(--navy)",
                color: "white",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "transform 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "var(--navy-mid)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "var(--navy)";
              }}
            >
              Go Home
            </button>

            {/* Secondary: Find Another Queue */}
            <button
              onClick={onReset}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 999,
                border: "1.5px solid rgba(13,43,110,0.2)",
                background: "white",
                color: "var(--navy-light)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "transform 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.borderColor = "var(--sky)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(13,43,110,0.2)";
              }}
            >
              Find Another Queue
            </button>
          </div>
        </div>

        {/* Right: Rating + tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {!cancelled && (
            <div
              style={{
                background: "white",
                border: "1.5px solid rgba(13,43,110,0.12)",
                borderRadius: 16,
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <h3
                className="font-head"
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--navy)",
                  marginBottom: "0.5rem",
                }}
              >
                How was your experience?
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#6B82A8",
                  marginBottom: "1rem",
                }}
              >
                Tap a star to rate
              </p>
              <div
                style={{ display: "flex", justifyContent: "center", gap: 8 }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    style={{
                      width: 36,
                      height: 36,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      opacity: n <= rating ? 1 : 0.25,
                      transition: "opacity 0.15s, transform 0.15s",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.15)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {n <= rating ? (
                      <Star
                        size={20}
                        strokeWidth={1.5}
                        fill="currentColor"
                        color="#f59e0b"
                      />
                    ) : (
                      <Star size={20} strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--sky)",
                    marginTop: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  Thanks for the {rating}-star rating!
                </p>
              )}
            </div>
          )}

          <div
            style={{
              background: "var(--sky-pale)",
              border: "1.5px solid var(--sky-light)",
              borderRadius: 16,
              padding: "1.25rem",
            }}
          >
            <p
              className="font-head"
              style={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "var(--navy)",
                marginBottom: "0.5rem",
              }}
            >
              Skip the wait next time
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--navy-light)",
                marginBottom: "1rem",
                lineHeight: 1.5,
              }}
            >
              Share QueueLess with friends and family so they can track their
              queues too.
            </p>
            <button
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                border: "1.5px solid var(--sky-light)",
                background: "white",
                color: "var(--navy-light)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
              onClick={() => {
                const txt =
                  "I just skipped the wait with QueueLess! Check it out.";
                navigator.clipboard
                  ?.writeText(txt)
                  .then(() => alert("Copied!"));
              }}
            >
              Share QueueLess
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}