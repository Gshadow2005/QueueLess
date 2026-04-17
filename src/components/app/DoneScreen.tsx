import { useState } from "react";
import { type Institution } from "../../data/institutions";
import { formatQueueNumber } from "../../utils/queueHelpers";

interface DoneScreenProps {
  institution: Institution;
  yourNumber: number;
  waitMinutes: number;
  cancelled: boolean;
  onReset: () => void;
}

export default function DoneScreen({
  institution,
  yourNumber,
  waitMinutes,
  cancelled,
  onReset,
}: DoneScreenProps) {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-5 pt-8 pb-6 flex flex-col gap-4">
        {/* Done hero */}
        <div className="text-center mb-2">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
            style={{
              background: cancelled ? "#fff7ed" : "rgba(34,197,94,0.1)",
              border: `3px solid ${cancelled ? "#f97316" : "#22c55e"}`,
            }}
          >
            {cancelled ? "✕" : "✓"}
          </div>
          <h2 className="font-head text-2xl font-extrabold mb-2" style={{ color: "var(--navy)" }}>
            {cancelled ? "Queue cancelled" : "You've been served!"}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B82A8" }}>
            {cancelled
              ? "You've left the queue. No worries — you can join again anytime."
              : `Queue ${formatQueueNumber(yourNumber)} at ${institution.name} — all done!`}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Institution", value: institution.name.split("–")[0].trim() },
            { label: "Your number", value: formatQueueNumber(yourNumber) },
            { label: "Wait (min)", value: waitMinutes.toString() },
            { label: "Status", value: cancelled ? "Cancelled" : "Served" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "white",
                border: "1.5px solid rgba(13,43,110,0.12)",
              }}
            >
              <p
                className="font-head text-xl font-extrabold mb-1"
                style={{ color: "var(--navy)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: "#6B82A8", fontSize: "0.68rem" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Rating */}
        {!cancelled && (
          <div
            className="rounded-2xl p-5 text-center"
            style={{
              background: "white",
              border: "1.5px solid rgba(13,43,110,0.12)",
            }}
          >
            <p className="text-sm mb-3" style={{ color: "#6B82A8" }}>
              How was your experience?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="text-2xl transition-opacity duration-150"
                  style={{ opacity: n <= rating ? 1 : 0.25 }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onReset}
          className="w-full py-3.5 rounded-full font-bold text-base text-white transition-all duration-200 hover:-translate-y-px"
          style={{ background: "var(--navy)", fontFamily: "var(--font-body)" }}
        >
          Join Another Queue
        </button>
      </div>
    </div>
  );
}