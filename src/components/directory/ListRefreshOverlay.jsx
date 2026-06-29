import { memo } from "react";

const ListRefreshOverlay = memo(function ListRefreshOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 15,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: 40,
        background: "rgba(11,18,32,0.55)", backdropFilter: "blur(1px)",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 20, padding: "8px 16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: 16, height: 16,
            border: "2px solid rgba(59,130,246,0.3)", borderTopColor: "#3B82F6",
            borderRadius: "50%", animation: "spin 0.7s linear infinite",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>
          Updating…
        </span>
      </div>
    </div>
  );
});

export default ListRefreshOverlay;
