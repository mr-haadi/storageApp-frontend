import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserProvider.jsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
     <UserProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1F2937",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#F9FAFB",
              borderRadius: 8,
              fontSize: 13,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            },
            success: {
              style: {
                background: "#1F2937",
                border: "1px solid rgba(52,211,153,0.35)",
                color: "#F9FAFB",
              },
              iconTheme: { primary: "#34D399", secondary: "#1F2937" },
            },
            error: {
              style: {
                background: "#1F2937",
                border: "1px solid rgba(239,68,68,0.35)",
                color: "#F9FAFB",
              },
              iconTheme: { primary: "#EF4444", secondary: "#1F2937" },
            },
          }}
        />
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
