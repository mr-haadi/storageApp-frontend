// Thin wrapper around console.error so error details are visible during
// development but stripped out of production builds. Swap the body for a
// real logging service (Sentry, LogRocket, etc.) later without touching
// call sites.
export function logError(...args) {
  if (import.meta.env.DEV) {
    console.error(...args);
  }
}
