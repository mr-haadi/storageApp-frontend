export function SkeletonCard() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 14,
        height: 90,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 7,
          marginBottom: 10,
          animation: "skpulse 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 10,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 4,
          marginBottom: 6,
          width: "75%",
          animation: "skpulse 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 8,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 4,
          width: "50%",
          animation: "skpulse 1.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 4,
          flexShrink: 0,
          animation: "skpulse 1.4s ease-in-out infinite",
        }}
      />

      <div
        style={{
          flex: 1,
          height: 10,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 4,
          animation: "skpulse 1.4s ease-in-out infinite",
        }}
      />

      <div
        style={{
          width: 60,
          height: 9,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 4,
          animation: "skpulse 1.4s ease-in-out infinite",
        }}
      />

      <div
        style={{
          width: 90,
          height: 9,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 4,
          animation: "skpulse 1.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}