import { memo } from "react";

const MobileActionBar = memo(function MobileActionBar({ onUploadClick, onCreateDir }) {
  return (
    <div
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", alignItems: "stretch",
        background: "var(--surface)", borderTop: "1px solid var(--border)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.35)",
        zIndex: 30, paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Upload */}
      <button
        onClick={onUploadClick}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 4, padding: "10px 0 12px",
          background: "transparent", border: "none",
          cursor: "pointer", color: "var(--text)",
          fontFamily: "Inter,sans-serif", transition: "background 0.15s",
        }}
        onTouchStart={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.10)")}
        onTouchEnd={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div
          style={{
            width: 42, height: 42, borderRadius: "50%", background: "#3B82F6",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(59,130,246,0.45)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#3B82F6", letterSpacing: 0.1 }}>Upload</span>
      </button>

      <div style={{ width: 1, background: "var(--border)", margin: "10px 0" }} />

      {/* New Folder */}
      <button
        onClick={onCreateDir}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 4, padding: "10px 0 12px",
          background: "transparent", border: "none",
          cursor: "pointer", color: "var(--text)",
          fontFamily: "Inter,sans-serif", transition: "background 0.15s",
        }}
        onTouchStart={(e) => (e.currentTarget.style.background = "rgba(5,150,105,0.10)")}
        onTouchEnd={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div
          style={{
            width: 42, height: 42, borderRadius: "50%", background: "#059669",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(5,150,105,0.40)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", letterSpacing: 0.1 }}>New Folder</span>
      </button>
    </div>
  );
});

export default MobileActionBar;
