import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmModalProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      const mount = setTimeout(() => setMounted(true), 0);
      const enter = setTimeout(() => setVisible(true), 10);
      return () => {
        clearTimeout(mount);
        clearTimeout(enter);
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      const hide = setTimeout(() => setVisible(false), 0);
      const exit = setTimeout(() => setMounted(false), 300);
      return () => {
        clearTimeout(hide);
        clearTimeout(exit);
      };
    }
  }, [open]);

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(onConfirm, 280);
  };

  const handleCancel = () => {
    setVisible(false);
    setTimeout(onCancel, 280);
  };

  if (!mounted) return null;

  const accentColor  = danger ? "#dc2626" : "var(--sky)";
  const accentBg     = danger ? "#fff5f5" : "var(--sky-pale)";
  const accentBorder = danger ? "rgba(220,38,38,0.2)" : "var(--sky-light)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        background: "rgba(13,43,110,0.08)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Modal card */}
      <div
        style={{
          position: "relative",
          background: "white",
          border: "1.5px solid rgba(13,43,110,0.12)",
          borderRadius: 16,
          padding: "1.5rem",
          maxWidth: 380,
          width: "100%",
          boxShadow: "0 8px 32px rgba(13,43,110,0.10), 0 2px 8px rgba(13,43,110,0.06)",
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.96) translateY(8px)",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "auto",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: accentBg,
            border: `1.5px solid ${accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <AlertTriangle size={18} strokeWidth={2.5} style={{ color: accentColor }} />
        </div>

        {/* Title */}
        <h3
          className="font-head"
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--navy)",
            margin: "0 0 0.4rem 0",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "0.84rem",
            color: "#6B82A8",
            lineHeight: 1.6,
            margin: "0 0 1.25rem 0",
            fontWeight: 400,
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {/* Cancel */}
          <button
            onClick={handleCancel}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "1.5px solid rgba(13,43,110,0.12)",
              background: "white",
              color: "var(--navy)",
              fontSize: "0.85rem",
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--sky-pale)";
              e.currentTarget.style.borderColor = "var(--sky)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "rgba(13,43,110,0.12)";
            }}
          >
            {cancelLabel}
          </button>

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: `1.5px solid ${accentBorder}`,
              background: accentColor,
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}