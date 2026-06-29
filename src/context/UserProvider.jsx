import { useEffect, useState, useCallback, useMemo } from "react";
import { UserContext } from "./UserContext";
import { fetchUser } from "../api/userApi";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stable reference — won't cause child re-renders when parent re-renders
  const refreshUser = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const data = await fetchUser();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // Stable context value — only changes when user/loading actually change
  const value = useMemo(
    () => ({ user, setUser, loading, refreshUser }),
    [user, loading, refreshUser]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
