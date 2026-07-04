import { useState, useRef, useEffect } from "react";

const OPTIONS = [
  { label: "Name", field: "name", icon: "🔤" },
  { label: "Date Modified", field: "date", icon: "📅" },
  { label: "Size", field: "size", icon: "📏" },
  { label: "Type", field: "type", icon: "🗂️" },
];

export default function SortDropdown({ sortBy, sortDir, onSort }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = OPTIONS.find((o) => o.field === sortBy);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 7,
          border: "1px solid var(--border)",
          background: open ? "rgba(59,130,246,0.1)" : "var(--surface-hover)",
          color: "var(--text)",
          fontSize: 12,
          cursor: "pointer",
          fontFamily: "Inter,sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {current ? (
          <>
            <span>{current.icon}</span>
            <span style={{ fontWeight: 500 }}>{current.label}</span>
            <span style={{ color: "var(--muted)", fontSize: 10 }}>
              {sortDir === "asc" ? "↑" : "↓"}
            </span>
          </>
        ) : (
          <>
            <span>↕️</span>
            <span style={{ fontWeight: 500 }}>Sort</span>
          </>
        )}

        <span
          style={{
            color: "var(--muted)",
            fontSize: 9,
            marginLeft: 1,
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: "#1a2433",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 4,
            zIndex: 200,
            minWidth: 170,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {OPTIONS.map((opt) => {
            const active = sortBy === opt.field;

            return (
              <button
                key={opt.field}
                onClick={() => {
                  onSort(opt.field);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "8px 12px",
                  background: active ? "rgba(59,130,246,0.12)" : "none",
                  border: "none",
                  color: active ? "#93C5FD" : "var(--text)",
                  fontSize: 13,
                  cursor: "pointer",
                  borderRadius: 6,
                  textAlign: "left",
                  fontFamily: "Inter,sans-serif",
                }}
                onMouseOver={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "var(--surface-hover)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </span>

                {active && (
                  <span style={{ fontSize: 11 }}>
                    {sortDir === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            );
          })}

          {current && (
            <>
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  margin: "4px 0",
                }}
              />

              <button
                onClick={() => {
                  onSort(null);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  color: "var(--text)",
                  fontSize: 13,
                  cursor: "pointer",
                  borderRadius: 6,
                  textAlign: "left",
                  fontFamily: "Inter,sans-serif",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "var(--surface-hover)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                ✖ Clear sorting
              </button>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  margin: "4px 0 2px",
                  padding: "4px 4px 0",
                }}
              >
                {[
                  ["asc", "↑ Ascending"],
                  ["desc", "↓ Descending"],
                ].map(([dir, label]) => (
                  <button
                    key={dir}
                    onClick={() => {
                      onSort(sortBy, dir);
                      setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "7px 12px",
                      background:
                        sortDir === dir ? "rgba(59,130,246,0.12)" : "none",
                      border: "none",
                      color: sortDir === dir ? "#93C5FD" : "var(--muted)",
                      fontSize: 12,
                      cursor: "pointer",
                      borderRadius: 6,
                      textAlign: "left",
                      fontFamily: "Inter,sans-serif",
                    }}
                    onMouseOver={(e) => {
                      if (sortDir !== dir) {
                        e.currentTarget.style.background =
                          "var(--surface-hover)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (sortDir !== dir) {
                        e.currentTarget.style.background = "none";
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
