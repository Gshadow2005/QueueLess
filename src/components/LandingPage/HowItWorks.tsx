const STEPS = [
  {
    num: "01",
    label: "Join the queue",
    sub: "Get your queue number at the counter or scan a QR code.",
  },
  {
    num: "02",
    label: "Go live your life",
    sub: "Leave the building. Grab coffee. Run that errand you've been putting off.",
  },
  {
    num: "03",
    label: "Get notified",
    sub: "Receive a ping when you're a few numbers away from being served.",
  },
  {
    num: "04",
    label: "Come back & get served",
    sub: "Arrive just in time. No wasted minutes, no lost patience.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24">
      <div className="max-w-384 mx-auto px-6 sm:px-10 xl:px-16">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--sky)" }}>
          Simple process
        </p>
        <h2
          className="font-head font-extrabold mb-3"
          style={{ fontSize: "clamp(1.75rem, 2.5vw, 2.75rem)", color: "var(--navy)" }}
        >
          How QueueLess works
        </h2>
        <p className="text-base mb-12" style={{ color: "#6B82A8" }}>
          Four steps between you and a stress-free wait.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {STEPS.map((step) => (
            <div key={step.num} className="flex gap-4 items-start">
              <div
                className="font-head font-extrabold leading-none shrink-0 min-w-14"
                style={{ fontSize: "clamp(2.5rem, 3.5vw, 4rem)", color: "var(--sky-light)" }}
              >
                {step.num}
              </div>
              <div>
                <h3
                  className="font-head text-base font-bold mb-1"
                  style={{ color: "var(--navy)" }}
                >
                  {step.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B82A8" }}>
                  {step.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}