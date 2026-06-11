"use client";

import { useAuthContext } from "@/context/auth/AuthContext";
import { login } from "@/lib/keycloak";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Loader from "@/components/shared/Loader";

function LoginContent() {
  const { loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    const redirect = searchParams.get("redirect") || "/brandsync-make";

    if (isAuthenticated) {
      // Already logged in — go to the original destination.
      router.replace(redirect);
    } else {
      // Kick off Keycloak login, returning to the protected page after success.
      login({ redirectUri: window.location.origin + redirect });
    }
  }, [loading, isAuthenticated]);

  return <Loader />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginContent />
    </Suspense>
  );
}
