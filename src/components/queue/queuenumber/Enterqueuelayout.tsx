import { type Institution, TYPE_LABELS } from "../../../types/institution";
import QueueContextCard from "./Queuecontextcard";

interface EnterQueueLayoutProps {
  institution: Institution;
  showSkeleton: boolean;
  // input state
  queueNumberInput: string;
  setQueueNumberInput: (v: string) => void;
  inputError: string;
  setInputError: (v: string) => void;
  isValid: boolean;
  spotsAway: number;
  estWait: number;
  joining: boolean;
  onSubmit: () => void;
}

export default function EnterQueueLayout({
  institution,
  showSkeleton,
  queueNumberInput,
  setQueueNumberInput,
  inputError,
  setInputError,
  isValid,
  spotsAway,
  estWait,
  joining,
  onSubmit,
}: EnterQueueLayoutProps) {
  const shortName = institution.name.split("–")[0].trim();

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
          {TYPE_LABELS[institution.type]} · {shortName}
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
          Check your physical ticket at the counter and enter the number here to start tracking your spot.
        </p>
      </div>

      {/* ── Current serving context card ── */}
      <QueueContextCard
        institutionName={institution.name}
        serving={institution.serving}
        inQueue={institution.inQueue}
        showSkeleton={showSkeleton}
      />

      {/* ── Input + preview ── */}
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

        <div style={{ position: "relative", marginBottom: inputError ? 6 : 0 }}>
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
              pointerEvents: "none" as const,
            }}
          >
            #
          </span>
          <input
            type="number"
            min={1}
            placeholder="00"
            value={queueNumberInput}
            onChange={(e) => {
              setQueueNumberInput(e.target.value);
              if (inputError) setInputError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            disabled={joining}
            style={{
              width: "100%",
              paddingLeft: 44,
              paddingRight: 100,
              paddingTop: 16,
              paddingBottom: 16,
              borderRadius: 12,
              border: `2px solid ${inputError ? "#dc2626" : isValid ? "var(--sky)" : "rgba(13,43,110,0.14)"}`,
              background: isValid ? "var(--sky-pale)" : "var(--off)",
              color: "var(--navy)",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 6vw, 3rem)",
              boxSizing: "border-box" as const,
              letterSpacing: "0.05em",
              outline: "none",
              transition: "border-color 0.15s, background 0.15s",
              opacity: joining ? 0.6 : 1,
              MozAppearance: "textfield" as unknown as undefined,
            }}
            onFocus={(e) => {
              if (!inputError) e.currentTarget.style.borderColor = "var(--sky)";
            }}
            onBlur={(e) => {
              if (!inputError && !isValid) e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)";
            }}
          />
          {isValid && (
            <span
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 999,
                background: "var(--sky-light)",
                color: "var(--navy-light)",
                fontFamily: "var(--font-body)",
              }}
            >
              Entered
            </span>
          )}
        </div>

        {inputError && (
          <p style={{ fontSize: "0.75rem", color: "#dc2626", marginBottom: 12, fontWeight: 500 }}>
            {inputError}
          </p>
        )}

        {/* ── Spots ahead / Est. wait preview ── */}
        {isValid && (
          <div
            style={{
              background: "var(--sky-pale)",
              border: "1px solid var(--sky-light)",
              borderRadius: 12,
              padding: "0.875rem 1rem",
              margin: "1.25rem 0 1.5rem",
              display: "flex",
              gap: 0,
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "0.68rem",
                  color: "#6B82A8",
                  letterSpacing: "0.04em",
                  fontWeight: 600,
                  marginBottom: 4,
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                }}
              >
                Spots ahead
              </p>
              <p
                className="font-head"
                style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)", margin: 0 }}
              >
                {spotsAway === 0 ? "You're next!" : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div
              style={{
                width: 1,
                background: "var(--sky-light)",
                margin: "0 1rem",
                alignSelf: "stretch",
                flexShrink: 0,
              }}
            />

            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "0.68rem",
                  color: "#6B82A8",
                  letterSpacing: "0.04em",
                  fontWeight: 600,
                  marginBottom: 4,
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                }}
              >
                Est. wait
              </p>
              <p
                className="font-head"
                style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)", margin: 0 }}
              >
                {estWait === 0 ? "Any moment!" : `~${estWait} min`}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={!isValid || joining}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 999,
            border: "none",
            background: isValid && !joining ? "var(--navy)" : "#e2e8f0",
            color: isValid && !joining ? "white" : "#94a3b8",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: isValid && !joining ? "pointer" : "not-allowed",
            transition: "transform 0.15s, background 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: isValid ? 0 : "1.5rem",
          }}
          onMouseEnter={(e) => {
            if (isValid && !joining) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.background = "var(--navy-mid)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = isValid && !joining ? "var(--navy)" : "#e2e8f0";
          }}
        >
          {joining ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }}
              />
              Joining queue…
            </>
          ) : (
            "Start Tracking"
          )}
        </button>
      </div>

      <p style={{ fontSize: "0.78rem", textAlign: "center", color: "#94a3b8", lineHeight: 1.5 }}>
        Make sure the number matches the slip at the counter before continuing.
      </p>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}