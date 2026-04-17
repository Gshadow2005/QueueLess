import { useState } from "react";
import { Ticket, Hash, Bell, MapPin } from "lucide-react";
import { type Institution, TYPE_LABELS } from "../../data/institutions";

interface JoinQueueProps {
  institution: Institution;
  onBack?: () => void;
  onJoin: (phone: string, notifyEnabled: boolean) => void;
}

export default function JoinQueue({ institution, onJoin }: JoinQueueProps) {
  const [phone, setPhone] = useState("");
  const [notify, setNotify] = useState(true);

  return (
    <div>
      {/* ── Page header ── */}
      <div style={{ marginBottom: "1.75rem" }}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
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
            fontSize: "clamp(1.35rem, 3vw, 1.875rem)",
            fontWeight: 700,
            color: "var(--navy)",
            marginBottom: "0.35rem",
            lineHeight: 1.25,
          }}
        >
          {institution.name}
        </h1>
        <p style={{ color: "#6B82A8", fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 }}>
          {institution.address}
        </p>
      </div>

      {/* ── Two-column layout on desktop ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* Left: Queue status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Hero card */}
          <div
            style={{
              background: "var(--navy)",
              borderRadius: 14,
              padding: "1.25rem 1.5rem",
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
                { label: "Now Serving", value: `#${String(institution.serving).padStart(2, "0")}` },
                null,
                { label: "In Queue", value: institution.inQueue.toString() },
                null,
                { 
                  label: "Est. Wait. min",
                  value: `~${institution.inQueue * institution.waitPer}`,
                  sub: undefined
                },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} style={{ height: 36, background: "rgba(255,255,255,0.12)" }} />
                ) : (
                  <div key={item.label} style={{ textAlign: "center", padding: "0 0.375rem" }}>
                    <p
                      style={{
                        fontSize: "0.6rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--sky-light)",
                        marginBottom: 4,
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="font-head"
                      style={{ fontWeight: 800, fontSize: "clamp(1.25rem, 3vw, 1.6rem)", color: "white", lineHeight: 1 }}
                    >
                      {item.value}
                    </p>
                    {"sub" in item && item.sub && (
                      <p style={{ fontSize: "0.65rem", color: "var(--sky-light)", marginTop: 2 }}>
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
              border: "1.5px solid rgba(13,43,110,0.10)",
              borderRadius: 14,
              padding: "1.125rem",
            }}
          >
            <h3
              className="font-head"
              style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--navy)", marginBottom: "0.75rem" }}
            >
              What to expect
            </h3>
            {[
              { icon: <Ticket size={20} strokeWidth={2} />, text: "Get a physical ticket at the counter first" },
              { icon: <Hash size={20} strokeWidth={2} />, text: "Then enter your number here to start tracking" },
              { icon: <Bell size={20} strokeWidth={2} />, text: "We'll notify you when your turn is near" },
              { icon: <MapPin size={20} strokeWidth={2} />, text: "You can track from anywhere" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "7px 0",
                  borderBottom: "1px solid rgba(13,43,110,0.06)",
                }}
              >
                <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: "0.84rem", color: "#6B82A8", fontWeight: 400, lineHeight: 1.5 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              background: "white",
              border: "1.5px solid rgba(13,43,110,0.10)",
              borderRadius: 14,
              padding: "1.5rem",
            }}
          >
            <h3
              className="font-head"
              style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", marginBottom: "1.125rem" }}
            >
              Your details{" "}
              <span style={{ fontWeight: 400, fontSize: "0.84rem", color: "#94a3b8" }}>(optional)</span>
            </h3>

            <div style={{ marginBottom: "1.125rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#6B82A8",
                  marginBottom: 6,
                  letterSpacing: "0.03em",
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
                  borderRadius: 10,
                  border: "1.5px solid rgba(13,43,110,0.14)",
                  background: "var(--off)",
                  color: "var(--navy)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
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
                padding: "10px 0",
                borderTop: "1px solid rgba(13,43,110,0.07)",
              }}
            >
              <span style={{ flex: 1, fontSize: "0.84rem", color: "var(--navy)", fontWeight: 400, lineHeight: 1.4 }}>
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
            Continue →
          </button>

          <p style={{ fontSize: "0.78rem", textAlign: "center", color: "#94a3b8", lineHeight: 1.5 }}>
            You'll enter your ticket number on the next screen.
          </p>
        </div>
      </div>
    </div>
  );
}
