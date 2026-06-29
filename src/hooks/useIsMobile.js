import { useEffect, useState } from "react";

// ── mobile detection hook ─────────────────────────────────────────────────
// Uses matchMedia instead of resize events — fires only when the breakpoint
// is crossed (not on every pixel of resize), and never triggers layout.
export function useIsMobile() {
  const query = "(max-width: 768px)";
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
