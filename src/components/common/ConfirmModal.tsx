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

  const accentColor = danger ? "#dc2626" : "var(--sky)";
  const accentBg    = danger ? "#fef2f2" : "var(--sky-pale)";
  const accentBorder = danger ? "#fca5a5" : "var(--sky-light)";
  const iconBorder   = danger ? "#fecaca" : "var(--sky-light)";

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
        background: "rgba(255,255,255,0.08)",
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
          border: "1.5px solid rgba(13,43,110,0.14)",
          borderRadius: 20,
          padding: "1.75rem",
          maxWidth: 380,
          width: "100%",
          boxShadow:
            "0 24px 60px rgba(13,43,110,0.14), 0 4px 16px rgba(13,43,110,0.06)",
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(10px)",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "auto",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: accentBg,
            border: `1.5px solid ${iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}
        >
          <AlertTriangle size={20} strokeWidth={2.5} style={{ color: accentColor }} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--navy)",
            margin: "0 0 0.5rem 0",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6B82A8",
            lineHeight: 1.6,
            margin: "0 0 1.5rem 0",
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
          <button
            onClick={handleCancel}
            style={{
              padding: "11px 16px",
              borderRadius: 12,
              border: "1.5px solid rgba(13,43,110,0.14)",
              background: "white",
              color: "var(--navy)",
              fontSize: "0.875rem",
              fontWeight: 600,
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
              e.currentTarget.style.borderColor = "rgba(13,43,110,0.14)";
            }}
          >
            {cancelLabel}
          </button>

          <button
            onClick={handleConfirm}
            style={{
              padding: "11px 16px",
              borderRadius: 12,
              border: `1.5px solid ${accentBorder}`,
              background: accentColor,
              color: "white",
              fontSize: "0.875rem",
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