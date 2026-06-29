import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { formatStorage } from "../utils/directoryUtils";


// Mock plan data — replace with real API calls when available
const MOCK_PLANS = [
  { id: "free", name: "Free", price: 0, storageBytes: 5 * 1024 ** 3, subscribers: 1240, status: "active", color: "#6B7280" },
  { id: "pro", name: "Pro", price: 9, storageBytes: 100 * 1024 ** 3, subscribers: 387, status: "active", color: "#3B82F6" },
  { id: "business", name: "Business", price: 29, storageBytes: 1024 ** 4, subscribers: 64, status: "active", color: "#8B5CF6" },
];

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || "var(--text)", marginBottom: 3 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>}
    </div>
  );
}

export default function AdminPlansPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [plans] = useState(MOCK_PLANS);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user && user.role !== "SuperAdmin" && user.role !== "Admin" && user.role !== "Manager") {
      navigate("/directory");
    }
  }, [user, navigate]);

  const totalSubs = plans.reduce((s, p) => s + p.subscribers, 0);
  const mrr = plans.reduce((s, p) => s + p.price * p.subscribers, 0);

  return (
    <AppLayout>
      <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Plan Management</h1>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Configure and monitor subscription tiers</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
            background: "#3B82F6", color: "#fff", border: "none", borderRadius: 9,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif",
          }}
            onMouseOver={e => e.currentTarget.style.background = "#2563EB"}
            onMouseOut={e => e.currentTarget.style.background = "#3B82F6"}
          >
            + New Plan
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
          <StatCard label="Total Plans" value={plans.length} sub="Active plans" />
          <StatCard label="Total Subscribers" value={totalSubs.toLocaleString()} sub="Across all plans" color="#3B82F6" />
          <StatCard label="Monthly Revenue" value={`$${mrr.toLocaleString()}`} sub="Estimated MRR" color="#10B981" />
          <StatCard label="Avg. Plan Value" value={`$${totalSubs > 0 ? (mrr / totalSubs).toFixed(2) : "0"}`} sub="Per subscriber" color="#8B5CF6" />
        </div>

        {/* Plans table */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 28 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>All Plans</span>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 100px 90px 80px 90px", gap: 10, padding: "10px 20px", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid var(--border)" }}
            className="admin-plans-row">
            <span>Plan Name</span>
            <span>Storage</span>
            <span>Price/mo</span>
            <span>Subscribers</span>
            <span>Status</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>

          {plans.map((plan, i) => (
            <div key={plan.id} style={{
              display: "grid", gridTemplateColumns: "1fr 90px 100px 90px 80px 90px",
              gap: 10, padding: "14px 20px", alignItems: "center",
              borderBottom: i < plans.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.1s",
            }}
              className="admin-plans-row"
              onMouseOver={e => e.currentTarget.style.background = "var(--surface-hover)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: plan.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{plan.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>ID: {plan.id}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>{formatStorage(plan.storageBytes)}</div>
              <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>
                {plan.price === 0 ? <span style={{ color: "var(--muted)" }}>Free</span> : `$${plan.price}`}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>{plan.subscribers.toLocaleString()}</div>
              <div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10,
                  background: plan.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                  color: plan.status === "active" ? "#34D399" : "#F87171",
                }}>{plan.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                <button onClick={() => setEditingPlan(plan)} style={{
                  padding: "5px 12px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: 6, color: "#93C5FD", fontSize: 12, cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                }}>Edit</button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscriber breakdown */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Subscriber Distribution</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {plans.map(plan => {
              const pct = totalSubs > 0 ? (plan.subscribers / totalSubs) * 100 : 0;
              return (
                <div key={plan.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: "var(--text)", fontWeight: 500 }}>{plan.name}</span>
                    <span style={{ color: "var(--muted)" }}>{plan.subscribers} subscribers ({Math.round(pct)}%)</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: plan.color, borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit modal */}
        {editingPlan && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={e => e.target === e.currentTarget && setEditingPlan(null)}>
            <div style={{ background: "#1a2433", border: "1px solid var(--border)", borderRadius: 14, padding: "26px 28px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Edit Plan: {editingPlan.name}</h3>
                <button onClick={() => setEditingPlan(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.65 }}>
                Plan editing is connected to your backend API. Wire up the form fields below to your update endpoint.
              </div>
              {[["Plan Name", editingPlan.name], ["Monthly Price ($)", editingPlan.price], ["Storage (bytes)", editingPlan.storageBytes]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 5 }}>{label}</label>
                  <input defaultValue={val} style={{ width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "Inter,sans-serif", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "var(--primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button onClick={() => setEditingPlan(null)} style={{ flex: 1, padding: 10, background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Cancel</button>
                <button onClick={() => setEditingPlan(null)} style={{ flex: 1, padding: 10, background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={e => e.target === e.currentTarget && setShowCreateModal(false)}>
            <div style={{ background: "#1a2433", border: "1px solid var(--border)", borderRadius: 14, padding: "26px 28px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Create New Plan</h3>
                <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
              </div>
              {[["Plan Name", "e.g. Enterprise"], ["Monthly Price ($)", "49"], ["Storage Limit (GB)", "5000"]].map(([label, ph]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 5 }}>{label}</label>
                  <input placeholder={ph} style={{ width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "Inter,sans-serif", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "var(--primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: 10, background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Cancel</button>
                <button onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: 10, background: "#059669", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Create Plan</button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 640px) {
            .admin-plans-row { grid-template-columns: 1fr 70px 80px 70px !important; }
            .admin-plans-row > :nth-child(5),
            .admin-plans-row > :nth-child(6) { display: none !important; }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
