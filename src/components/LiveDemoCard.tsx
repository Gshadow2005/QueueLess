import { useQueueTracker } from "../hooks/useQueueTracker";
import { formatQueueNumber } from "../utils/queueHelpers";

export default function LiveDemoCard() {
  const { currentServing, yourNumber, spotsAway, progressPct, isFlashing } =
    useQueueTracker({ initialCurrent: 20, yourNumber: 35, intervalMs: 1800 });

  return (
    <div
      className="relative z-10 rounded-2xl p-7 animate-float"
      style={{
        background: "white",
        border: "1.5px solid rgba(13,43,110,0.12)",
        boxShadow:
          "0 20px 60px rgba(13,43,110,0.12), 0 4px 16px rgba(13,43,110,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span
          className="w-2 h-2 rounded-full animate-pulse-ring"
          style={{ background: "#22c55e" }}
        />
        <span className="text-sm font-semibold" style={{ color: "var(--sky)" }}>
          City Bank – Main Branch
        </span>
      </div>

      {/* Now Serving */}
      <div className="text-center mb-4">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: "var(--sky)", letterSpacing: "0.08em" }}
        >
          Now Serving
        </p>
        <div
          className={`font-head text-7xl font-extrabold leading-none transition-all duration-200 ${
            isFlashing ? "queue-flash" : ""
          }`}
          style={{ color: "var(--navy)" }}
        >
          {formatQueueNumber(currentServing)}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4" style={{ height: 1, background: "rgba(13,43,110,0.12)" }} />

      {/* Your Number */}
      <div className="text-center mb-4">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: "var(--sky)", letterSpacing: "0.08em" }}
        >
          Your Number
        </p>
        <div
          className="font-head text-4xl font-bold"
          style={{ color: "var(--sky)" }}
        >
          {formatQueueNumber(yourNumber)}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div
          className="h-1.5 rounded-full overflow-hidden mb-2"
          style={{ background: "var(--sky-pale)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, var(--sky), var(--navy-light))`,
            }}
          />
        </div>
        <span
          className={`block text-center text-sm font-medium ${
            spotsAway <= 3 ? "font-bold" : ""
          }`}
          style={{ color: spotsAway <= 3 ? "#22c55e" : "var(--sky)" }}
        >
          {spotsAway <= 0
            ? "🎉 It's your turn!"
            : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""} away`}
        </span>
      </div>

      {/* Notify button */}
      <div className="text-center">
        <button
          className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors duration-200 hover:opacity-80"
          style={{
            color: "var(--navy-light)",
            background: "var(--sky-pale)",
            borderColor: "var(--sky-light)",
          }}
        >
          🔔 Notify me when I'm close
        </button>
      </div>
    </div>
  );
}