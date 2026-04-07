"use client";

import dynamic from "next/dynamic";

const LoginContent = dynamic(
  () => import("@/components/features/login/LoginContent.jsx"),
  { ssr: false },
);

export default function LoginPageClient() {
  return <LoginContent />;
}
