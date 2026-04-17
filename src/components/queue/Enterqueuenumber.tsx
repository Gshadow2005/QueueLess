import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { type Institution, TYPE_LABELS } from "../../data/institutions";
import { formatQueueNumber } from "../../utils/queueHelpers";

interface EnterQueueNumberProps {
  institution: Institution;
  onSubmit: (queueNumber: number) => void;
  onBack?: () => void;
}

export default function EnterQueueNumber({ institution, onSubmit }: EnterQueueNumberProps) {
  const [rawValue, setRawValue] = useState("");
  const [error, setError] = useState("");

  const parsed = parseInt(rawValue, 10);
  const isValid = !isNaN(parsed) && parsed > 0 && parsed <= 9999;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setRawValue(val);
    setError("");
  };

  const handleSubmit = () => {
    if (!rawValue.trim()) {
      setError("Please enter your queue number.");
      return;
    }
    if (!isValid) {
      setError("Enter a valid number between 1 and 9999.");
      return;
    }
    onSubmit(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const spotsAway = isValid ? Math.max(0, parsed - institution.serving - 1) : null;
  const estWait = spotsAway !== null ? spotsAway * institution.waitPer : null;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--sky)",
            marginBottom: "0.5rem",
          }}
        >
          {TYPE_LABELS[institution.type]} · {institution.name.split("–")[0].trim()}
        </p>
        <h1
          className="font-head"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "0.4rem",
            lineHeight: 1.2,
          }}
        >
          Enter your queue number
        </h1>
        <p style={{ color: "#6B82A8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Check your physical ticket and type in the number printed on it.
        </p>
      </div>

      {/* ── Current serving context ── */}
      <div
        style={{
          background: "var(--navy)",
          borderRadius: 16,
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Two stat blocks stacked */}
        <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          {/* Now Serving */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--sky-light)",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              Now serving at {institution.name.split("–")[0].trim()}
            </p>
            <p
              className="font-head"
              style={{ fontWeight: 800, fontSize: "2.25rem", color: "white", lineHeight: 1 }}
            >
              {formatQueueNumber(institution.serving)}
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)", margin: "0 1.25rem", flexShrink: 0 }} />

          {/* People in queue */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--sky-light)",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              People in queue
            </p>
            <p
              className="font-head"
              style={{ fontWeight: 800, fontSize: "2.25rem", color: "white", lineHeight: 1 }}
            >
              {institution.inQueue}
            </p>
          </div>
        </div>
      </div>

      {/* ── Input card ── */}
      <div
        style={{
          background: "white",
          border: "1.5px solid rgba(13,43,110,0.12)",
          borderRadius: 16,
          padding: "1.75rem",
          marginBottom: "1rem",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#6B82A8",
            marginBottom: 10,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Your ticket number
        </label>

        {/* Large number input */}
        <div style={{ position: "relative", marginBottom: error ? "0.5rem" : "1.5rem" }}>
          <span
            style={{
              position: "absolute",
              left: 18,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.5rem",
              color: "#6B82A8",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              pointerEvents: "none",
            }}
          >
            #
          </span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="00"
            value={rawValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={4}
            autoFocus
            style={{
              width: "100%",
              paddingLeft: 44,
              paddingRight: 18,
              paddingTop: 16,
              paddingBottom: 16,
              borderRadius: 12,
              border: `2px solid ${error ? "#dc2626" : isValid ? "var(--sky)" : "rgba(13,43,110,0.14)"}`,
              background: "var(--off)",
              color: "var(--navy)",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 6vw, 3rem)",
              outline: "none",
              boxSizing: "border-box",
              letterSpacing: "0.05em",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = "var(--sky)";
            }}
            onBlur={(e) => {
              if (!error && !isValid) e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)";
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <p style={{ fontSize: "0.8rem", color: "#dc2626", marginBottom: "1rem", fontWeight: 500 }}>
            <AlertCircle style={{ width: 16, height: 16, verticalAlign: "middle", marginRight: 4 }} /> {error}
          </p>
        )}

        {/* Live preview when valid */}
        {isValid && spotsAway !== null && (
          <div
            style={{
              background: "var(--sky-pale)",
              border: "1px solid var(--sky-light)",
              borderRadius: 12,
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <p style={{ fontSize: "0.68rem", color: "#6B82A8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 3 }}>
                Spots ahead of you
              </p>
              <p className="font-head" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>
                {spotsAway === 0 ? "You're next!" : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""}`}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.68rem", color: "#6B82A8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 3 }}>
                Est. wait time
              </p>
              <p className="font-head" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>
                {estWait === 0 ? "Any moment!" : `~${estWait} min`}
              </p>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!rawValue.trim()}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 999,
            border: "none",
            background: rawValue.trim() ? "var(--navy)" : "#e2e8f0",
            color: rawValue.trim() ? "white" : "#94a3b8",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: rawValue.trim() ? "pointer" : "not-allowed",
            transition: "transform 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (rawValue.trim()) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.background = "var(--navy-mid)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = rawValue.trim() ? "var(--navy)" : "#e2e8f0";
          }}
        >
          Start Tracking →
        </button>
      </div>

      <p style={{ fontSize: "0.78rem", textAlign: "center", color: "#94a3b8", lineHeight: 1.5 }}>
        Your number is printed on the physical slip given at the counter.
      </p>
    </div>
  );
}