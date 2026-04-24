import { useQueueTracker } from "../../hooks/useQueueTracker";
import { formatQueueNumber } from "../../utils/queueHelpers";

export default function LiveDemoCard() {
  const { currentServing, yourNumber, spotsAway, progressPct, isFlashing } =
    useQueueTracker({ initialCurrent: 20, yourNumber: 35, intervalMs: 1800 });

  return (
    <div
      className="relative z-10 rounded-3xl p-10 animate-float w-full max-w-130"
      style={{
        background: "white",
        border: "1.5px solid rgba(13,43,110,0.12)",
        boxShadow:
          "0 24px 80px rgba(13,43,110,0.14), 0 6px 24px rgba(13,43,110,0.07)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse-ring shrink-0"
          style={{ background: "#22c55e" }}
        />
        <span className="text-base font-semibold" style={{ color: "#6B82A8" }}>
          City Bank – Main Branch
        </span>
      </div>

      {/* Now Serving */}
      <div className="text-center mb-6">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: "#6B82A8", letterSpacing: "0.1em" }}
        >
          Now Serving
        </p>
        <div
          className={`font-head font-extrabold leading-none transition-all duration-200 ${
            isFlashing ? "queue-flash" : ""
          }`}
          style={{ color: "var(--navy)", fontSize: "7rem" }}
        >
          {formatQueueNumber(currentServing)}
        </div>
      </div>

      {/* Divider */}
      <div className="my-6" style={{ height: 1, background: "rgba(13,43,110,0.10)" }} />

      {/* Your Number */}
      <div className="text-center mb-6">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: "#6B82A8", letterSpacing: "0.1em" }}
        >
          Your Number
        </p>
        <div
          className="font-head font-bold"
          style={{ color: "var(--sky)", fontSize: "4rem" }}
        >
          {formatQueueNumber(yourNumber)}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-7">
        <div
          className="h-2 rounded-full overflow-hidden mb-3"
          style={{ background: "var(--sky-pale)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, var(--sky), var(--navy-light))",
            }}
          />
        </div>
        <span
          className="block text-center text-sm"
          style={{
            color: spotsAway <= 3 ? "#22c55e" : "#6B82A8",
            fontWeight: spotsAway <= 3 ? 700 : 500,
          }}
        >
          {spotsAway <= 0
            ? "It's your turn!"
            : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""} away`}
        </span>
      </div>

      {/* Notify button */}
      <div className="text-center">
        <button
          className="text-sm font-semibold px-6 py-3 rounded-full border transition-colors duration-200 hover:opacity-80 w-full"
          style={{
            color: "var(--navy-light)",
            background: "var(--sky-pale)",
            borderColor: "var(--sky-light)",
          }}
        >
          Notify me when I'm close
        </button>
      </div>
    </div>
  );
}