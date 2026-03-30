import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  onClose: () => void;
}

const TYPE_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  success: {
    bg: "rgba(34, 197, 94, 0.08)",
    border: "rgba(34, 197, 94, 0.25)",
    icon: "#22c55e",
  },
  error: {
    bg: "rgba(244, 63, 94, 0.08)",
    border: "rgba(244, 63, 94, 0.25)",
    icon: "#f43f5e",
  },
  info: {
    bg: "rgba(99, 102, 241, 0.08)",
    border: "rgba(99, 102, 241, 0.25)",
    icon: "#6366f1",
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type, visible, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setExiting(false);
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 200);
    }, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible && !exiting) return null;

  const style = TYPE_STYLES[type] ?? TYPE_STYLES.info;

  return (
    <div
      className={exiting ? "toast-exit" : "toast-enter"}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 10,
        background: style.bg,
        border: `1px solid ${style.border}`,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        maxWidth: 360,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: `${style.icon}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {type === "success" && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={style.icon} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {type === "error" && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={style.icon} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
        {type === "info" && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={style.icon} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
      </div>

      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4 }}>
        {message}
      </span>

      <button
        onClick={() => {
          setExiting(true);
          setTimeout(onClose, 200);
        }}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-tertiary)",
          cursor: "pointer",
          padding: 2,
          marginLeft: 4,
          flexShrink: 0,
          lineHeight: 1,
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};
