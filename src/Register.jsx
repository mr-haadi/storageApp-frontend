import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendOtp, verifyOtp } from "./api/authApi";
import { registerUser } from "./api/userApi";
import { UserContext } from "./context/UserContext";
import GoogleAuthButton from "./components/GoogleAuthButton";

const spinnerStyle = {
  width: 15,
  height: 15,
  border: "2px solid rgba(255,255,255,0.35)",
  borderTopColor: "#fff",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
  display: "inline-block",
  flexShrink: 0,
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const { refreshUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/directory";

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (googleError) setGoogleError("");
    if (name === "email") {
      setServerError("");
      setOtpError("");
      setOtpSent(false);
      setOtpVerified(false);
      setCountdown(0);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setServerError("Please enter your email first.");
      return;
    } else if (!validateEmail()) return;
    try {
      setIsSending(true);
      await sendOtp(formData.email);
      setOtpSent(true);
      setCountdown(60);
      setServerError("");
    } catch (err) {
      setServerError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setOtpError("Please enter OTP.");
      return;
    }
    try {
      setIsVerifying(true);
      await verifyOtp(formData.email, otp);
      setOtpVerified(true);
      setOtpError("");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setOtpError("Please verify your email with OTP.");
      return;
    }
    try {
      setIsSubmitting(true);
      await registerUser({ ...formData, otp });
      await refreshUser();
      setIsSuccess(true);
      setTimeout(() => navigate(redirectTo, { replace: true }), 1500);
    } catch (err) {
      setServerError(err.response?.data?.error || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setServerError("Please Enter Valid Email");
      return false;
    }
    setServerError("");
    return true;
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
    fontFamily: "Inter, sans-serif",
  };
  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--muted)",
    marginBottom: 6,
  };

  const isFormDisabled = !otpVerified || isSuccess || isSubmitting;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 32,
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "var(--primary)",
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          ☁️
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
          Cloud Storage
        </span>
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "36px 32px",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 28 }}>
          Get started with Haadi Cloud for free
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={labelStyle}>Email address</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  flex: 1,
                  borderColor: serverError ? "#EF4444" : "var(--border)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) =>
                  (e.target.style.borderColor = serverError
                    ? "#EF4444"
                    : "var(--border)")
                }
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  otpVerified || isSending || countdown > 0 || !formData.email
                }
                style={{
                  padding: "0 14px",
                  background: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: countdown > 0 ? "var(--muted)" : "var(--primary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    otpVerified || isSending || countdown > 0 || !formData.email
                      ? "not-allowed"
                      : "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "Inter, sans-serif",
                  opacity: otpVerified || !formData.email ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 90,
                  justifyContent: "center",
                }}
              >
                {isSending ? (
                  <>
                    <span
                      style={{
                        ...spinnerStyle,
                        borderTopColor: "var(--primary)",
                        borderColor: "rgba(59,130,246,0.25)",
                      }}
                    />
                    Sending
                  </>
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
            {serverError && (
              <p style={{ color: "#FCA5A5", fontSize: 12, marginTop: 4 }}>
                {serverError}
              </p>
            )}
          </div>

          {otpSent && (
            <div>
              <label style={labelStyle}>
                Verification code{" "}
                {otpVerified && (
                  <span style={{ color: "#34D399" }}>Verified</span>
                )}
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    letterSpacing: 5,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otpVerified}
                  style={{
                    padding: "0 14px",
                    background: otpVerified
                      ? "rgba(52,211,153,0.15)"
                      : "var(--primary)",
                    border: "none",
                    borderRadius: 8,
                    color: otpVerified ? "#34D399" : "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor:
                      isVerifying || otpVerified ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "Inter, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 72,
                    justifyContent: "center",
                  }}
                >
                  {isVerifying ? (
                    <>
                      <span style={spinnerStyle} />
                      Verifying
                    </>
                  ) : otpVerified ? (
                    "Verified"
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
              {otpError && (
                <p style={{ color: "#FCA5A5", fontSize: 12, marginTop: 4 }}>
                  {otpError}
                </p>
              )}
            </div>
          )}

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Choose a strong password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <button
            type="submit"
            disabled={isFormDisabled}
            style={{
              width: "100%",
              padding: 12,
              background: isSuccess
                ? "#059669"
                : !otpVerified
                  ? "rgba(59,130,246,0.3)"
                  : isSubmitting
                    ? "rgba(59,130,246,0.6)"
                    : "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 15,
              fontWeight: 600,
              cursor: isFormDisabled ? "not-allowed" : "pointer",
              opacity: !otpVerified && !isSubmitting ? 0.6 : 1,
              fontFamily: "Inter, sans-serif",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.15s",
            }}
          >
            {isSubmitting && <span style={spinnerStyle} />}
            {isSuccess
              ? "Account Created"
              : isSubmitting
                ? "Processing…"
                : "Create Account"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "22px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Google button wrapper — always full width, loading state overlays the real button */}
        <GoogleAuthButton
          onSuccess={async () => {
            await refreshUser();
            navigate(redirectTo, { replace: true });
          }}
          onError={(msg) => setGoogleError(msg)}
        />

        {googleError && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#FCA5A5",
              marginTop: 12,
            }}
          >
            {googleError}
          </div>
        )}

        {/* ── "By continuing…" legal line ──────────────────────────────── */}
        <p
          style={{
            marginTop: "14px",
            fontSize: "12.5px",
            textAlign: "center",
            color: "#6b7280",
            lineHeight: "1.55",
            maxWidth: "100%",
          }}
        >
          By continuing, you agree to our{" "}
          <Link
            to="/terms"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Terms of Service
          </Link>
          . and acknowledge that you have read our < br className="desktop-only" />
          <Link
            to="/privacy"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Privacy Policy
          </Link>
          .
        </p>

        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "var(--muted)",
            marginTop: 24,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
