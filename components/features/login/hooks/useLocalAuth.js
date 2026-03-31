import { useState } from "react";
import { AUTH_STORAGE_KEY } from "@/components/features/login/constants/auth";

export default function useLocalAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (email, name) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ email, name, loggedInAt: Date.now() }),
    );

    setIsLoggedIn(true);
  };

  return { isLoggedIn, login };
}
