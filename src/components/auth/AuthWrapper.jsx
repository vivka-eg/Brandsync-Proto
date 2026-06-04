"use client";

import { useAuthContext } from "@/context/auth/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loader from "../shared/Loader";

const AuthWrapper = ({ children }) => {
  const { loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = pathname === "/login";

  useEffect(() => {
    if (!isPublic && !loading && !isAuthenticated) {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [isPublic, loading, isAuthenticated, router]);

  if (!isPublic && (loading || !isAuthenticated)) return <Loader />;

  return children;
};

export default AuthWrapper;
