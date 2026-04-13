"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

export default function ClientOnlyNavbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Navbar />;
}
