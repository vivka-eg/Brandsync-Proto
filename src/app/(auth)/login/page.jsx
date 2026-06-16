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

    // Never land the OAuth callback on "/" — app/page.js does a server-side
    // redirect("/brandsync-make") that strips the Keycloak code/state params,
    // so the token exchange never runs and login loops forever. Coerce "/"
    // (and empty) to the real app home, which renders under AuthWrapper and
    // lets keycloak-js process the callback.
    const raw = searchParams.get("redirect");
    const redirect = !raw || raw === "/" ? "/brandsync-make" : raw;

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
