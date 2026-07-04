import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const axiosWithCreds = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosWithoutCreds = axios.create({
  baseURL: BASE_URL,
});

// ── Session-expiry handling ────────────────────────────────────────────────
let isRedirectingToLogin = false;

axiosWithCreds.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const skip = error?.config?.skipAuthRedirect;
    const path = window.location.pathname;
    const isAuthPage = path === "/login" || path === "/register" || path === "/";

    if (status === 401 && !skip && !isAuthPage && !isRedirectingToLogin) {
      isRedirectingToLogin = true;
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
