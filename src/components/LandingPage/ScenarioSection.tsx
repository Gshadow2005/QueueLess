const SCENARIO_STEPS = [
  { text: "You walk in and get", bold: "Queue #35" },
  { text: "The board shows", bold: "Now Serving: #20" },
  { text: "You open QueueLess on your phone", bold: null },
  { text: "Go grab lunch — you have 15 minutes", bold: null },
  { text: "At", bold: "#32", suffix: ", you get a notification" },
  { text: "You walk back in, relaxed.", bold: "#35 is called. You're there." },
];

function PhoneMockup() {
  return (
    <div
      className="w-72 rounded-[36px] p-3 mx-auto"
      style={{
        background: "var(--navy)",
        boxShadow: "0 32px 80px rgba(13,43,110,0.25)",
      }}
    >
      {/* Notch — dark navy matching original #111a30 */}
      <div
        className="w-24 h-6 rounded-full mx-auto mb-2"
        style={{ background: "#111a30" }}
      />

      {/* Screen */}
      <div
        className="rounded-[28px] p-6"
        style={{ background: "#F7F9FC", minHeight: "420px" }}
      >
        <p
          className="font-head text-lg font-extrabold text-center mb-5"
          style={{ color: "var(--navy)" }}
        >
          QueueLess
        </p>

        {/* Queue card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "white",
            border: "1px solid rgba(13,43,110,0.12)",
          }}
        >
          <p className="text-xs font-semibold mb-4" style={{ color: "#6B82A8" }}>
            City Bank
          </p>
          <div className="flex justify-around items-center mb-4">
            <div>
              <p
                className="uppercase tracking-widest mb-1"
                style={{ color: "#6B82A8", fontSize: "0.65rem" }}
              >
                Serving
              </p>
              <p className="font-head text-3xl font-extrabold" style={{ color: "var(--navy)" }}>
                #20
              </p>
            </div>
            <div className="w-px h-12" style={{ background: "rgba(13,43,110,0.12)" }} />
            <div>
              <p
                className="uppercase tracking-widest mb-1"
                style={{ color: "#6B82A8", fontSize: "0.65rem" }}
              >
                Yours
              </p>
              <p className="font-head text-3xl font-extrabold" style={{ color: "var(--sky)" }}>
                #35
              </p>
            </div>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden mb-1.5"
            style={{ background: "var(--sky-pale)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: "40%", background: "var(--sky)" }}
            />
          </div>
          <p className="text-center text-xs" style={{ color: "#6B82A8" }}>
            ~15 spots away · est. 18 min
          </p>
        </div>

        {/* Notification */}
        <div
          className="rounded-xl p-4 flex gap-3 items-start"
          style={{ background: "var(--navy)" }}
        >
          <div>
            <strong className="block text-white text-xs mb-1">Almost your turn!</strong>
            <p className="text-xs" style={{ color: "var(--sky-light)" }}>
              You're #35, currently serving #32
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScenarioSection() {
  return (
    <section id="scenario" className="py-24 px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_340px] gap-16 items-center">
        {/* Text */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--sky)" }}>
            Example
          </p>
          <h2
            className="font-head font-extrabold mb-6"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--navy)" }}
          >
            Picture this at your bank
          </h2>
          <ul className="flex flex-col gap-3.5 mt-6">
            {SCENARIO_STEPS.map((step, i) => (
              <li
                key={i}
                className="text-base leading-relaxed pl-6 relative"
                style={{ color: "#6B82A8" }}
              >
                <span
                  className="absolute left-0 font-bold"
                  style={{ color: "var(--sky)" }}
                >
                  →
                </span>
                {step.text}{" "}
                {step.bold && (
                  <strong style={{ color: "var(--navy)" }}>{step.bold}</strong>
                )}
                {step.suffix}
              </li>
            ))}
          </ul>
        </div>

        {/* Phone mockup */}
        <PhoneMockup />
      </div>
    </section>
  );
}