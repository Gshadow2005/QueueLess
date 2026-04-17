export default function Footer() {
  return (
    <footer
      className="py-10 px-8 text-center border-t"
      style={{ background: "#F7F9FC", borderColor: "rgba(13,43,110,0.12)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">⏱</span>
          <span className="font-head text-lg" style={{ color: "var(--navy)" }}>
            Queue<strong className="font-extrabold">Less</strong>
          </span>
        </div>
        <p className="text-sm mb-1" style={{ color: "#6B82A8" }}>
          Your place in line, wherever you go.
        </p>
        <p className="text-xs" style={{ color: "#6B82A8", opacity: 0.6 }}>
          © 2026 QueueLess. All rights reserved.
        </p>
      </div>
    </footer>
  );
}