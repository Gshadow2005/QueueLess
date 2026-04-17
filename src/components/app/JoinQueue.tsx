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
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-5 pt-5 pb-6 flex flex-col gap-4">
        {/* Hero card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--navy)" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--sky-light)", letterSpacing: "0.08em" }}
          >
            {TYPE_LABELS[institution.type]}
          </p>
          <p
            className="font-head text-lg font-extrabold text-white mb-1"
          >
            {institution.name}
          </p>
          <p className="text-sm" style={{ color: "var(--sky-light)" }}>
            {institution.address}
          </p>
        </div>

        {/* Status row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Serving", value: formatQueueNumber(institution.serving), sub: "current" },
            { label: "In Queue", value: institution.inQueue.toString(), sub: "waiting" },
            { label: "Est. Wait", value: `~${institution.inQueue * institution.waitPer}`, sub: "minutes" },
          ].map((box) => (
            <div
              key={box.label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: "white",
                border: "1.5px solid rgba(13,43,110,0.12)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "#6B82A8", fontSize: "0.68rem" }}
              >
                {box.label}
              </p>
              <p
                className="font-head text-2xl font-extrabold"
                style={{ color: "var(--navy)" }}
              >
                {box.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6B82A8" }}>
                {box.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "white",
            border: "1.5px solid rgba(13,43,110,0.12)",
          }}
        >
          <h3
            className="font-head text-base font-bold mb-4"
            style={{ color: "var(--navy)" }}
          >
            Your details{" "}
            <span className="font-normal text-sm" style={{ color: "#6B82A8" }}>
              (optional)
            </span>
          </h3>

          <div className="mb-4">
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#6B82A8" }}
            >
              Phone number
            </label>
            <input
              type="tel"
              placeholder="+63 9XX XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
              style={{
                border: "1.5px solid rgba(13,43,110,0.14)",
                background: "var(--off)",
                color: "var(--navy)",
                fontFamily: "var(--font-body)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--sky)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)")
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="flex-1 text-sm" style={{ color: "var(--navy)" }}>
              Notify me when my turn is near
            </span>
            {/* Toggle */}
            <button
              onClick={() => setNotify((n) => !n)}
              className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
              style={{
                background: notify ? "var(--sky)" : "#cbd5e1",
              }}
              role="switch"
              aria-checked={notify}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow"
                style={{
                  left: notify ? "calc(100% - 1.25rem)" : "0.25rem",
                }}
              />
            </button>
          </div>
        </div>

        {/* Join button */}
        <button
          onClick={() => onJoin(phone, notify)}
          className="w-full py-3.5 rounded-full font-head font-bold text-base text-white transition-all duration-200 hover:-translate-y-px"
          style={{ background: "var(--navy)", fontFamily: "var(--font-body)" }}
        >
          Get My Queue Number
        </button>

        <p className="text-xs text-center" style={{ color: "#6B82A8" }}>
          No account needed. Your session is private and temporary.
        </p>
      </div>
    </div>
  );
}