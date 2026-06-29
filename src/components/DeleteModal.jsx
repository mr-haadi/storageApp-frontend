import { useState } from "react";
import Modal from "./Modal";

export default function DeleteModal({ deleteItem, setDeleteItem, confirmDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!deleteItem) return null;

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await confirmDelete(deleteItem);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal title="Delete Item" onClose={() => !isDeleting && setDeleteItem(null)}>
      <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20, lineHeight: 1.65 }}>
        Are you sure you want to delete{" "}
        <strong style={{ color: "var(--text)" }}>{deleteItem.name}</strong>?
        {deleteItem.isDirectory && " All contents inside will be deleted too."}
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => !isDeleting && setDeleteItem(null)}
          disabled={isDeleting}
          style={{
            flex: 1, padding: 10, background: "var(--surface-hover)",
            border: "1px solid var(--border)", borderRadius: 8,
            color: "var(--text)", fontSize: 14,
            cursor: isDeleting ? "not-allowed" : "pointer",
            fontFamily: "Inter,sans-serif",
            opacity: isDeleting ? 0.5 : 1,
          }}
        >Cancel</button>
        <button
          onClick={handleConfirm}
          disabled={isDeleting}
          style={{
            flex: 1, padding: 10, background: isDeleting ? "rgba(239,68,68,0.7)" : "#EF4444",
            color: "#fff", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600,
            cursor: isDeleting ? "not-allowed" : "pointer",
            fontFamily: "Inter,sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {isDeleting && (
            <span style={{
              display: "inline-block",
              width: 13, height: 13,
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              flexShrink: 0,
            }} />
          )}
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
