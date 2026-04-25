import { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  variant?: "error" | "success" | "info";
}

const variantStyles = {
  error: { bg: "#fff5f5", border: "#fecaca", icon: "#dc2626", text: "#dc2626" },
  success: { bg: "#f0fdf4", border: "#86efac", icon: "#16a34a", text: "#15803d" },
  info: { bg: "#eff6ff", border: "#bfdbfe", icon: "#3b82f6", text: "#1d4ed8" },
};

export default function Toast({
  message,
  onClose,
  duration = 5000,
  variant = "error",
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const styles = variantStyles[variant];

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const exit = setTimeout(() => setVisible(false), duration);
    const remove = setTimeout(() => onClose(), duration + 300);

    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
      clearTimeout(remove);
    };
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
        maxWidth: 380,
        width: "calc(100vw - 40px)",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          background: styles.bg,
          border: `1.5px solid ${styles.border}`,
          borderRadius: 12,
          padding: "12px 14px",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        <AlertCircle
          size={18}
          style={{ color: styles.icon, flexShrink: 0, marginTop: 2 }}
        />
        <p
          style={{
            flex: 1,
            fontSize: "0.85rem",
            color: styles.text,
            fontWeight: 500,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {message}
        </p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: styles.icon,
            padding: 2,
            flexShrink: 0,
            opacity: 0.6,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

