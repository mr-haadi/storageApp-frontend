import { memo } from "react";

const ToastStack = memo(function ToastStack({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", gap: 8,
        zIndex: 500, pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onRemove(toast.id)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px",
            background: toast.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
            border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
            borderRadius: 8, fontSize: 13,
            color: toast.type === "error" ? "#FCA5A5" : "#6EE7B7",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap", pointerEvents: "all",
            cursor: "pointer", animation: "slideInDown 0.2s ease",
          }}
        >
          <span>{toast.type === "error" ? "⚠️" : "✓"}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
});

export default ToastStack;
