import { useState } from "react";
import { type Institution, TYPE_LABELS } from "../../data/institutions";
import { formatQueueNumber } from "../../utils/queueHelpers";

interface JoinQueueProps {
  institution: Institution;
  onBack: () => void;
  onJoin: (phone: string, notifyEnabled: boolean) => void;
}

export default function JoinQueue({ institution, onJoin }: JoinQueueProps) {
  const [phone, setPhone] = useState("");
  const [notify, setNotify] = useState(true);

  return (
    <div>
      {/* ── Page header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--sky)",
            marginBottom: "0.5rem",
          }}
        >
          {TYPE_LABELS[institution.type]}
        </p>
        <h1
          className="font-head"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "0.25rem",
          }}
        >
          {institution.name}
        </h1>
        <p style={{ color: "#6B82A8", fontSize: "0.95rem" }}>{institution.address}</p>
      </div>

      {/* ── Two-column layout on desktop ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Left: Queue status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Hero card */}
          <div
            style={{
              background: "var(--navy)",
              borderRadius: 16,
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
                gap: 0,
                alignItems: "center",
              }}
            >
              {[
                { label: "Now Serving", value: formatQueueNumber(institution.serving), highlight: false },
                null,
                { label: "In Queue", value: institution.inQueue.toString(), highlight: false },
                null,
                {
                  label: "Est. Wait",
                  value: `~${institution.inQueue * institution.waitPer}`,
                  sub: "min",
                  highlight: false,
                },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} style={{ height: 40, background: "rgba(255,255,255,0.12)" }} />
                ) : (
                  <div key={item.label} style={{ textAlign: "center", padding: "0 0.5rem" }}>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--sky-light)",
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="font-head"
                      style={{ fontWeight: 800, fontSize: "1.6rem", color: "white", lineHeight: 1 }}
                    >
                      {item.value}
                    </p>
                    {"sub" in item && item.sub && (
                      <p style={{ fontSize: "0.7rem", color: "var(--sky-light)", marginTop: 2 }}>
                        {item.sub}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* What to expect */}
          <div
            style={{
              background: "white",
              border: "1.5px solid rgba(13,43,110,0.12)",
              borderRadius: 16,
              padding: "1.25rem",
            }}
          >
            <h3
              className="font-head"
              style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}
            >
              What to expect
            </h3>
            {[
              { icon: "🔢", text: `Your number will be #${String(institution.serving + institution.inQueue + 1).padStart(2, "0")}` },
              { icon: "⏱", text: `Estimated wait: ~${institution.inQueue * institution.waitPer} minutes` },
              { icon: "🔔", text: "We'll notify you when your turn is near" },
              { icon: "📍", text: "You can track from anywhere" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(13,43,110,0.06)",
                }}
              >
                <span style={{ fontSize: "0.95rem", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: "0.875rem", color: "#6B82A8" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
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
              style={{ fontWeight: 700, fontSize: "1rem", color: "var(--navy)", marginBottom: "1.25rem" }}
            >
              Your details{" "}
              <span style={{ fontWeight: 400, fontSize: "0.875rem", color: "#6B82A8" }}>(optional)</span>
            </h3>

            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#6B82A8",
                  marginBottom: 6,
                }}
              >
                Phone number
              </label>
              <input
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1.5px solid rgba(13,43,110,0.14)",
                  background: "var(--off)",
                  color: "var(--navy)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sky)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)")}
              />
            </div>

            {/* Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderTop: "1px solid rgba(13,43,110,0.08)",
              }}
            >
              <span style={{ flex: 1, fontSize: "0.875rem", color: "var(--navy)" }}>
                Notify me when my turn is near
              </span>
              <button
                onClick={() => setNotify((n) => !n)}
                style={{
                  position: "relative",
                  width: 44,
                  height: 24,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background: notify ? "var(--sky)" : "#cbd5e1",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
                role="switch"
                aria-checked={notify}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                    left: notify ? "calc(100% - 20px)" : 4,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onJoin(phone, notify)}
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
            Get My Queue Number →
          </button>

          <p style={{ fontSize: "0.78rem", textAlign: "center", color: "#6B82A8" }}>
            No account needed. Your session is private and temporary.
          </p>
        </div>
      </div>
    </div>
  );
}