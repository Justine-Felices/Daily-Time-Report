import { Suspense } from "react";
import LoginPageClient from "@/components/features/login/LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageClient />
    </Suspense>
  );
}
